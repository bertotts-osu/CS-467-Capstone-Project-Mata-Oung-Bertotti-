import jwt
from jwt import PyJWKClient
from flask import current_app
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError


def verify_token(token: str) -> tuple:
    region = current_app.config["COGNITO_REGION"]
    user_pool_id = current_app.config["COGNITO_USER_POOL_ID"]
    jwks_url = f"https://cognito-idp.{region}.amazonaws.com/{user_pool_id}/.well-known/jwks.json"

    # get the public cognito keys
    jwk_client = PyJWKClient(jwks_url)

    try:
        # fetch the public key
        key = jwk_client.get_signing_key_from_jwt(token)

        # decode and validate the token
        claims = jwt.decode(
            token,
            key.key,
            algorithms=["RS256"],
            audience=current_app.config["COGNITO_APP_CLIENT_ID"],
            options={"verify_exp": True}
        )
        # Note about algorithm chosen: RS256 is an asymmetric algorithm using a 256-bit key.
        #   * involves a private and public key
        #   * chosen by Cognito

        # extract user data
        user_id = claims.get("sub"),
        user_name = claims.get("given_name")

        return user_id, user_name
    except ExpiredSignatureError:
        raise Exception("Token has expired")
    except InvalidTokenError as e:
        raise Exception(f"Token is invalid: {e}")
