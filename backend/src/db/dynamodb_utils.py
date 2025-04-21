import boto3
from flask import current_app


def get_dynamodb_resource():
    return boto3.resource(
        "dynamodb",
        region_name=current_app.config["COGNITO_REGION"],
        aws_access_key_id=current_app.config["COGNITO_ACCESS_KEY"],
        aws_secret_access_key=current_app.config["COGNITO_SECRET_ACCESS_KEY"]
    )
