import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
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

    # initialize routes
    register_routes(app)

    return app
