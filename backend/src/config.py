# config.py
# Defines configuration classes for the Flask application, including Cognito and environment-specific settings.

import os


class Config:
    """
    Base configuration class. Loads AWS Cognito settings from environment variables.
    """
    COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
    COGNITO_APP_CLIENT_ID = os.getenv("COGNITO_APP_CLIENT_ID")
    COGNITO_REGION = os.getenv("COGNITO_REGION")


class DevConfig(Config):
    """
    Development configuration. Enables debug mode.
    """
    DEBUG = True


class ProdConfig(Config):
    """
    Production configuration. Disables debug mode.
    """
    DEBUG = False
