from datetime import datetime, UTC
from boto3.dynamodb.conditions import Key
from src.db.dynamodb_utils import get_dynamodb_resource


def get_user_profile(user_id):
    dynamodb = get_dynamodb_resource()
    user_table = dynamodb.Table("Users")

    response = user_table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
    )

    items = response.get("Items", [])
    fields_to_exclude = {"PK", "SK", "createdAt"}

    user_profile = [
        {k: v for k, v in item.items() if k not in fields_to_exclude}
        for item in items
    ]
    return user_profile if user_profile else None


def create_user_profile(user_id):
    dynamodb = get_dynamodb_resource()
    user_table = dynamodb.Table("Users")

    # create a default profile
    new_profile = {
        "PK": f"USER#{user_id}",
        "SK": "PROFILE",
        "problemsSolved": 0,
        "patternsMastered": 0,
        "currentStreak": 0,
        "highestStreak": 0,
        "createdAt": datetime.now(UTC).isoformat()
    }

    user_table.put_item(Item=new_profile)
    return {
        "problemsSolved": new_profile["problemsSolved"],
        "patternsMastered": new_profile["patternsMastered"],
        "currentStreak": new_profile["currentStreak"],
        "highestStreak": new_profile["highestStreak"],
    }
