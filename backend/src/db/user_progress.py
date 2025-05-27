from datetime import datetime, UTC, timezone, timedelta
from boto3.dynamodb.conditions import Key
from src.db.dynamodb_utils import get_dynamodb_resource


def get_user_profile(user_id):
    dynamodb = get_dynamodb_resource()
    user_table = dynamodb.Table("Users")

    # Use get_item since we expect a single profile item
    response = user_table.get_item(
        Key={"PK": f"USER#{user_id}", "SK": "PROFILE"}
    )

    item = response.get("Item")
    if not item:
        return None

    # Optionally exclude internal fields
    fields_to_exclude = {"PK", "SK", "createdAt"}
    cleaned_profile = {k: v for k, v in item.items() if k not in fields_to_exclude}

    return cleaned_profile


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
        "createdAt": datetime.now(UTC).isoformat(),
        "lastProblemSolvedAt": None
    }

    user_table.put_item(Item=new_profile)
    return {
        "problemsSolved": new_profile["problemsSolved"],
        "patternsMastered": new_profile["patternsMastered"],
        "currentStreak": new_profile["currentStreak"],
        "highestStreak": new_profile["highestStreak"],
    }


def update_user_on_problem_solved(attempt):
    user_id = attempt["user_id"]
    dynamodb = get_dynamodb_resource()
    user_table = dynamodb.Table("Users")
    today = datetime.now(timezone.utc).date()

    # Fetch the user's profile
    response = user_table.get_item(
        Key={"PK": f"USER#{user_id}", "SK": "PROFILE"}
    )
    if "Item" not in response:
        raise ValueError(f"User {user_id} not found")

    profile = response["Item"]

    # Parse lastProblemSolvedAt if it exists
    last_solved_str = profile.get("lastProblemSolvedAt")
    last_solved_date = None
    if last_solved_str:
        last_solved_date = datetime.fromisoformat(last_solved_str).date()

    # If already solved today, do nothing
    if last_solved_date == today:
        return {
            "message": "Problem already solved today. No update performed.",
            "currentStreak": profile["currentStreak"],
            "highestStreak": profile["highestStreak"],
            "problemsSolved": profile["problemsSolved"],
        }

    # Determine if the streak continues
    if last_solved_date == today - timedelta(days=1):
        new_streak = profile["currentStreak"] + 1
    else:
        new_streak = 1

    new_highest_streak = max(profile["highestStreak"], new_streak)

    # Update the profile
    user_table.update_item(
        Key={"PK": f"USER#{user_id}", "SK": "PROFILE"},
        UpdateExpression="""
            SET problemsSolved = problemsSolved + :increment,
                currentStreak = :currentStreak,
                highestStreak = :highestStreak,
                lastProblemSolvedAt = :now
        """,
        ExpressionAttributeValues={
            ":increment": 1,
            ":currentStreak": new_streak,
            ":highestStreak": new_highest_streak,
            ":now": datetime.now(timezone.utc).isoformat()
        }
    )

    return {
        "message": "Profile updated.",
        "currentStreak": new_streak,
        "highestStreak": new_highest_streak,
        "problemsSolved": profile["problemsSolved"] + 1,
    }


def get_user_streak_info(user_id: str):
    dynamodb = get_dynamodb_resource()
    user_table = dynamodb.Table("Users")

    response = user_table.get_item(
        Key={"PK": f"USER#{user_id}", "SK": "PROFILE"}
    )

    item = response.get("Item")
    if not item:
        return None

    return {
        "currentStreak": item.get("currentStreak", 0),
        "highestStreak": item.get("highestStreak", 0),
        "problemsSolved": item.get("problemsSolved", 0)
    }
