from flask import request, jsonify

AUTH = "/auth"


def register_routes(app):
    @app.route("/")
    def index():
        return "Hello World!"

    @app.route(AUTH + "/signup", methods=["POST"])
    def create_user_profile():
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
            return f"Error: {e}", 400

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

            # Extract tokens from the response
            id_token = response['AuthenticationResult']['IdToken']
            refresh_token = response['AuthenticationResult']['RefreshToken']

            # Return tokens in the response
            return {
                "message": "Authentication successful",
                "id_token": id_token,
                "refresh_token": refresh_token  # !!!!need to add logic to allow refresh of token later
            }, 200

        except Exception as e:
            return f"Error: {e}", 400
