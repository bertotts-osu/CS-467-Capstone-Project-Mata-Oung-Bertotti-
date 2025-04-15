import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import boto3
from src.config import DevConfig, ProdConfig
from src.routes import register_routes

# load environment variables from .env
load_dotenv()


def start_app(config_class=DevConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # enable cors for cross-origin requests
    CORS(app)

    # AWS Cognito Configuration
    app.config['COGNITO_USER_POOL_ID'] = os.getenv('COGNITO_USER_POOL_ID')
    app.config['COGNITO_APP_CLIENT_ID'] = os.getenv('COGNITO_APP_CLIENT_ID')
    app.config['COGNITO_REGION'] = os.getenv('COGNITO_REGION')

    # initialize Cognito client
    cognito_client = boto3.client(
        "cognito-idp",
        region_name=app.config["COGNITO_REGION"])

    # initialize routes
    register_routes(app, cognito_client)

    return app
