import os


class Config:
    COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
    COGNITO_APP_CLIENT_ID = os.getenv("COGNITO_APP_CLIENT_ID")
    COGNITO_REGION = os.getenv("COGNITO_REGION")


class DevConfig(Config):
    DEBUG = True


class ProdConfig(Config):
    DEBUG = False
