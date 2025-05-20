import os
import boto3
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from src.chatgpt.api_utils import AzureOpenAIClient
from src.config import DevConfig
from src.routes import register_routes


def start_app(config_class=DevConfig):
    # load environment variables from .env for local dev
    if config_class == DevConfig:
        load_dotenv()

    app = Flask(__name__)
    app.config.from_object(config_class)

    # setup cors for cross-origin requests
    if config_class == DevConfig:
        trusted_domains = "http://localhost:5173"
    else:
        trusted_domains = "https://your-frontend-url.com"
    CORS(app, origins=[trusted_domains])

    # configure AWS Cognito connection
    app.config["COGNITO_USER_POOL_ID"] = os.getenv("COGNITO_USER_POOL_ID")
    app.config["COGNITO_APP_CLIENT_ID"] = os.getenv("COGNITO_APP_CLIENT_ID")
    app.config["COGNITO_REGION"] = os.getenv("COGNITO_REGION")
    app.config["COGNITO_ACCESS_KEY"] = os.getenv("COGNITO_ACCESS_KEY")
    app.config["COGNITO_SECRET_ACCESS_KEY"] = os.getenv("COGNITO_SECRET_ACCESS_KEY")

    # initialize the cognito client and tie it to the app, so it can be accessed globally
    app.cognito_client = boto3.client(
        'cognito-idp',
        region_name=app.config["COGNITO_REGION"],
        aws_access_key_id=app.config["COGNITO_ACCESS_KEY"],
        aws_secret_access_key=app.config["COGNITO_SECRET_ACCESS_KEY"]
    )

    # initialize the OpenAI Azure client and tie it to the app
    app.openai_client = AzureOpenAIClient(
        endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        deployment_name=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        api_key=os.getenv("AZURE_OPENAI_KEY")
    )

    # initialize routes
    register_routes(app)

    return app
