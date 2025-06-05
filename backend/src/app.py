# app.py
# This is the main entry point for the Flask backend, configuring CORS, AWS Cognito, Azure OpenAI, and registering routes.

import os
import boto3
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from src.chatgpt.api_utils import AzureOpenAIClient
from src.config import DevConfig
from src.routes import register_routes


def start_app(config_class=DevConfig):
    """
    Creates and configures the Flask app, including CORS, AWS Cognito, Azure OpenAI, and routes.
    :param config_class: The configuration class to use (default: DevConfig)
    :return: Configured Flask app
    """
    # Load environment variables from .env for local development
    if config_class == DevConfig:
        load_dotenv()

    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)  # Enable CORS for all routes

    # Setup CORS for cross-origin requests (adjust trusted domains as needed)
    if config_class == DevConfig:
        trusted_domains = "http://localhost:5173"
    else:
        trusted_domains = "https://your-frontend-url.com"
    CORS(app, origins=[trusted_domains])

    # Configure AWS Cognito connection
    app.config["COGNITO_USER_POOL_ID"] = os.getenv("COGNITO_USER_POOL_ID")
    app.config["COGNITO_APP_CLIENT_ID"] = os.getenv("COGNITO_APP_CLIENT_ID")
    app.config["COGNITO_REGION"] = os.getenv("COGNITO_REGION")
    app.config["COGNITO_ACCESS_KEY"] = os.getenv("COGNITO_ACCESS_KEY")
    app.config["COGNITO_SECRET_ACCESS_KEY"] = os.getenv("COGNITO_SECRET_ACCESS_KEY")

    # Initialize the Cognito client and tie it to the app for global access
    app.cognito_client = boto3.client(
        'cognito-idp',
        region_name=app.config["COGNITO_REGION"],
        aws_access_key_id=app.config["COGNITO_ACCESS_KEY"],
        aws_secret_access_key=app.config["COGNITO_SECRET_ACCESS_KEY"]
    )

    # Initialize the OpenAI Azure client and tie it to the app
    app.openai_client = AzureOpenAIClient(
        endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        deployment_name=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        api_key=os.getenv("AZURE_OPENAI_KEY")
    )

    # Register all routes
    register_routes(app)

    # Health check root route
    @app.route("/")
    def home():
        """Health check endpoint."""
        return "Backend is running!", 200

    return app
