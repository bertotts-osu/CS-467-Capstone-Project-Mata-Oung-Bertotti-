from flask import request, g
from marshmallow import ValidationError
from src.chatgpt.curated_tasks import modify_problem, generate_test_cases
from src.db.problems import get_problem, add_problem
from src.db.schemas import ProblemSchema, AttemptSchema
from src.db.user_attemtps import add_or_update_user_attempt, get_current_user_attempt, \
    update_user_attempt_result_with_record
from src.db.user_progress import get_user_profile, create_user_profile
from src.exceptions import ProblemNotFound
from src.services.test_runner import run_test_cases_against_solution
from src.verify_token import verify_token
from functools import wraps
from .chatgpt.api import chatgpt_bp

AUTH = "/auth"
PROBLEMS = "/problems"
USERS = "/users"
ATTEMPTS = "/attempts"


def register_routes(app):
    @app.route('/users/<user_id>', methods=['GET'])
    def get_user(user_id):
        user = get_user_profile(user_id)
        if not user:
            return create_user_profile(user_id)
        return user, 200

    @app.route(PROBLEMS, methods=["GET"])
    @require_auth
    def fetch_problem():
        pattern = request.args.get('pattern')
        difficulty = request.args.get('difficulty')

        if not pattern or not difficulty:
            return {"error": "Missing query parameter."}, 400

        try:
            user_id = g.user_id
            problem = get_problem(pattern, difficulty)
            modified_prompt = modify_problem(problem, app.openai_client)
            attempt_data = {
                "user_id": user_id,
                "pattern": pattern,
                "difficulty": difficulty,
                "index": problem["index"],
                "modified_prompt": modified_prompt["prompt"],
                "passed": False,
                "number_of_attempts": 1,
            }
            formatted_attempt = add_or_update_user_attempt(attempt_data)

            return {
                "name": modified_prompt["name"],
                "prompt": modified_prompt["prompt"],
                "example": modified_prompt["example"],
                "attempt_id": formatted_attempt["attempt_id"]
            }, 200

        except ProblemNotFound as e:
            return {"error": str(e)}, 404
        except Exception as e:
            return {"error": str(e)}, 500

    @app.route(ATTEMPTS + "/<attempt_id>", methods=["PATCH"])
    @require_auth
    def process_problem_attempt(attempt_id):
        # Validate the attempt_id using your schema
        schema = AttemptSchema()
        try:
            schema.load({"attempt_id": attempt_id})
        except ValidationError as e:
            return {"error": "Invalid attempt_id", "error_details": e.messages}, 400

        # Retrieve the attempt record
        try:
            attempt = get_current_user_attempt(attempt_id)
            if not attempt:
                return {"error": "Attempt not found."}, 404
        except Exception as e:
            return {"error": str(e)}, 500

        prompt = attempt["modified_prompt"]

        # Extract user code from the request body
        data = request.get_json()
        user_code = data.get("code")
        if not user_code:
            return {"error": "Missing 'code' in request body"}, 400

        # Generate and run test cases
        try:
            test_cases = generate_test_cases(prompt, app.openai_client)
            test_results = run_test_cases_against_solution(user_code, test_cases)
        except Exception as e:
            return {"error": f"Test execution failed: {str(e)}"}, 500

        overall_passed = all(r["result"] == "passed" for r in test_results)

        # Update the attempt record with the test result
        try:
            updated_attempt = update_user_attempt_result_with_record(attempt, overall_passed)
        except Exception as e:
            return {"error": f"Failed to update attempt: {str(e)}"}, 500

        return {
            "result": overall_passed,
            "result_details": test_results,
        }, 200

    @app.route(AUTH + "/signup", methods=['POST'])
    def register_user():
        try:
            data = request.get_json()
            name = data["name"]
            username = data["username"]
            password = data["password"]
            email = data["email"]

            response = app.cognito_client.sign_up(
                ClientId=app.config["COGNITO_APP_CLIENT_ID"],
                Username=username,
                Password=password,
                UserAttributes=[
                    {'Name': 'email', 'Value': email},
                    {'Name': 'given_name', 'Value': name},
                ],
            )

            # confirm users automatically (!!! remove before deploying)
            app.cognito_client.admin_confirm_sign_up(
                UserPoolId=app.config["COGNITO_USER_POOL_ID"],
                Username=username
            )

            return "User registration successful", 201
        except Exception as e:
            return {"error": str(e)}, 400

    @app.route(AUTH + "/login", methods=['POST'])
    def login_user():
        try:
            data = request.get_json()
            username = data.get("username")
            password = data.get("password")

            if not username or not password:
                return {"error": "Username and password are required."}, 400

            response = app.cognito_client.initiate_auth(
                ClientId=app.config["COGNITO_APP_CLIENT_ID"],
                AuthFlow="USER_PASSWORD_AUTH",
                AuthParameters={
                    "USERNAME": username,
                    "PASSWORD": password,
                }
            )

            # extract tokens from the response
            id_token = response['AuthenticationResult']['IdToken']
            refresh_token = response['AuthenticationResult']['RefreshToken']

            # verify and decode the ID token to get the Cognito user ID
            user_id, username = verify_token(id_token)

            # return tokens in the response
            return {
                "message": "Authentication successful",
                "user_id": user_id,
                "id_token": id_token,
                "refresh_token": refresh_token  # !!!!need to add logic to allow refresh of token later
            }, 200

        except Exception as e:
            return {"error": str(e)}, 500

    @app.route(PROBLEMS, methods=['POST'])
    @require_auth
    def create_new_problem():
        body = request.get_json()
        if not body:
            return {"error": "Request body is missing"}, 400

        # if the body is not a list, make it a list with one item
        if not isinstance(body, list):
            body = [body]

        schema = ProblemSchema()
        created_problems = []

        for problem_data in body:
            try:
                validated = schema.load(problem_data)
                problem = add_problem(validated)
                if problem is None:
                    return {"error": f"Problem could not be created."}, 500

                created_problems.append(problem)

            except ValidationError as e:
                return {"error": "Validation failed", "error_details": e.messages}, 400
            except Exception as e:
                return {"error": str(e)}, 500

        return {"data": {"problems": created_problems}}, 201

    @app.route('/api/chat', methods=['POST'])
    def chat_with_gpt():
        try:
            from openai import AzureOpenAI
            import os

            data = request.get_json()
            messages = data.get("messages", [])
            if isinstance(messages, dict):
                messages = [messages]
            problem = data.get("problem", "")
            code = data.get("code", "")

            # Prepend problem and code as system messages for context
            system_messages = []
            if problem:
                system_messages.append({
                    "role": "system",
                    "content": f"Problem Description:\n{problem}"
                })
            if code:
                system_messages.append({
                    "role": "system",
                    "content": f"User's Current Code:\n{code}"
                })
            # Validate all messages have 'role' and 'content'
            valid_messages = []
            for msg in messages:
                if isinstance(msg, dict) and 'role' in msg and 'content' in msg:
                    valid_messages.append(msg)
                else:
                    print('Skipping invalid message:', msg)

            # If no valid messages, use the problem prompt as the first user message
            if not valid_messages and problem:
                valid_messages.append({
                    "role": "user",
                    "content": f"Problem: {problem}"
                })

            full_messages = system_messages + valid_messages
            if not full_messages:
                full_messages = [{
                    "role": "system",
                    "content": "No user message or problem context was provided."
                }]
            print('full_messages:', full_messages)

            client = AzureOpenAI(
                api_key=os.getenv("AZURE_OPENAI_KEY"),
                api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
                azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
            )

            response = client.chat.completions.create(
                model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
                messages=full_messages,
                temperature=0.7
            )

            reply = response.choices[0].message.content
            return {"reply": reply}, 200

        except Exception as e:
            print("GPT API error:", str(e))
            return {"error": "GPT API failed", "details": str(e)}, 500
    app.register_blueprint(chatgpt_bp)


def require_auth(route):
    @wraps(route)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"error": "Missing or invalid Authorization header."}, 401

        token = auth_header.split(" ")[1]
        try:
            user_id, user_name = verify_token(token)
            g.user_id = user_id[0]
            g.user_name = user_name
        except Exception as e:
            return {"error": "Invalid Token", "error_data": str(e)}, 403

        return route(*args, **kwargs)
    return decorated
