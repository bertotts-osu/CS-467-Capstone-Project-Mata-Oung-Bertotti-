from flask import request, g
from marshmallow import ValidationError
from src.chatgpt.curated_tasks import modify_problem
from src.db.problems import get_problem, add_problem
from src.db.schemas import ProblemSchema
from src.db.user_attemtps import add_or_update_user_attempt
from src.db.user_progress import get_user_profile, create_user_profile
from src.exceptions import ProblemNotFound
from src.verify_token import verify_token
from functools import wraps
import subprocess
import tempfile
import os
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

    # @app.route(PROBLEMS, methods=["GET"])
    # @require_auth
    # def fetch_problem():
    #     pattern = request.args.get('pattern')
    #     difficulty = request.args.get('difficulty')
    #
    #     if not pattern or not difficulty:
    #         return {"error": "Missing query parameter."}, 400
    #     try:
    #         problem = get_problem(pattern, difficulty)
    #         modified_problem = modify_problem(problem, app.openai_client)
    #         return modified_problem, 200
    #     except ProblemNotFound as e:
    #         return {"error": str(e)}, 404
    #     except Exception as e:
    #         return {"error": str(e)}, 500

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

    @app.route(AUTH + "/signup", methods=["POST"])
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

    @app.route(AUTH + "/login", methods=["POST"])
    def login_user():
        try:
            data = request.get_json()
            username = data["username"]
            password = data["password"]

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

    @app.route(PROBLEMS, methods=["POST"])
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

    @app.route(ATTEMPTS, methods=["POST"])
    @require_auth
    def process_problem_attempt():
        body = request.get_json()

        # result = evaluate_code(attempt)
        # add_record_of_attempt(attempt, result)
        return result, 200

    @app.route('/execute', methods=['POST'])
    @require_auth
    def execute_code():
        data = request.get_json()
        code = data.get('code')
        language = data.get('language', 'python')
        input_data = data.get('input', '')
        if not code or language != 'python':
            return {"error": "Only Python code execution is supported in this demo."}, 400
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp:
                temp.write(code)
                temp_filename = temp.name
            try:
                result = subprocess.run(
                    ['python', temp_filename],
                    input=input_data.encode(),
                    capture_output=True,
                    timeout=5
                )
                output = result.stdout.decode()
                error = result.stderr.decode()
                success = result.returncode == 0
            finally:
                os.remove(temp_filename)
            return {"output": output, "error": error, "success": success}, 200
        except subprocess.TimeoutExpired:
            return {"output": "", "error": "Execution timed out.", "success": False}, 200
        except Exception as e:
            return {"output": "", "error": str(e), "success": False}, 500

    @app.route('/api/chat', methods=['POST'])
    def chat_with_gpt():
        try:
            from openai import AzureOpenAI
            import os

            messages = request.get_json().get("messages", [])

            client = AzureOpenAI(
                api_key=os.getenv("AZURE_OPENAI_KEY"),
                api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
                azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
            )

            response = client.chat.completions.create(
                model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
                messages=messages,
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
