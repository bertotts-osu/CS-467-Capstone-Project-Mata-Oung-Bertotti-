import uuid
from collections import defaultdict

from src.db.models import UserAttemptModel
from boto3.dynamodb.conditions import Key
from src.db.dynamodb_utils import get_dynamodb_resource
from datetime import datetime


def add_or_update_user_attempt(data: dict) -> dict:
    """
    Creates a new attempt record with SK = pattern#difficulty#index#attempt_id.
    Attempts are never updated unless the full composite key already exists.
    """
    user_id = data["user_id"]
    attempt_id = data.get("attempt_id") or str(uuid.uuid4())  # generate if missing
    sk = f"{data['pattern']}#{data['difficulty']}#{data['index']}#{attempt_id}"

    try:
        # Try to fetch existing record
        attempt = UserAttemptModel.get(user_id, sk)
        attempt.number_of_attempts += 1
        attempt.passed = data["passed"]
        attempt.last_attempt_time = datetime.now()
        attempt.save()

    except UserAttemptModel.DoesNotExist:
        # Create a new record
        attempt = UserAttemptModel(
            PK=user_id,
            SK=sk,
            pattern=data["pattern"],
            difficulty=data["difficulty"],
            index=data["index"],
            modified_prompt=data["modified_prompt"],
            attempt_id=attempt_id,
            number_of_attempts=0,
            passed=data["passed"],
            last_attempt_time=datetime.now()
        )
        attempt.save()

    return {
        "user_id": attempt.PK,
        "pattern": attempt.pattern,
        "difficulty": attempt.difficulty,
        "index": attempt.index,
        "modified_prompt": attempt.modified_prompt,
        "attempt_id": attempt.attempt_id,
        "number_of_attempts": attempt.number_of_attempts,
        "passed": attempt.passed,
        "last_attempt_time": attempt.last_attempt_time.isoformat()
    }


def get_current_user_attempt(attempt_id: str):
    """
    Fetches a user attempt based on the attempt_id
    """
    dynamodb = get_dynamodb_resource()
    tbl = dynamodb.Table("Attempts")

    response = tbl.query(
        IndexName="GSI_AttemptId",  # Specify the GSI name
        KeyConditionExpression=Key("attempt_id").eq(attempt_id)
    )
    items = response.get("Items", [])
    if not items:
        return None

    attempt = items[0]

    return {
        "user_id": attempt["PK"],
        "pattern": attempt["pattern"],
        "difficulty": attempt["difficulty"],
        "index": attempt["index"],
        "modified_prompt": attempt.get("modified_prompt"),
        "attempt_id": attempt["attempt_id"],
        "number_of_attempts": attempt["number_of_attempts"],
        "passed": attempt["passed"],
        "last_attempt_time": attempt["last_attempt_time"],
    }


def update_user_attempt_result_with_record(attempt_record: dict, passed: bool) -> dict:
    """
    Update a user attempt record in DynamoDB using the provided record dictionary.
    This function increments the number_of_attempts, updates the 'passed' field,
    and sets the last_attempt_time to the current time (in ISO format).

    :param attempt_record: The user attempt record as a dictionary.
    :param passed: Boolean indicating whether the attempt passed.
    :return: The updated attempt record as a dictionary.
    """
    # Extract required keys from the provided record.
    user_id = attempt_record["user_id"]
    pattern = attempt_record["pattern"]
    difficulty = attempt_record["difficulty"]
    index = attempt_record["index"]
    attempt_id = attempt_record["attempt_id"]

    # Construct the composite key (Sort Key) for accessing this record.
    sk = f"{pattern}#{difficulty}#{index}#{attempt_id}"
    now = datetime.now().isoformat()

    # Get the DynamoDB resource and reference the "Attempts" table.
    dynamodb = get_dynamodb_resource()
    table = dynamodb.Table("Attempts")

    # Update the record atomically using update_item.
    response = table.update_item(
        Key={"PK": user_id, "SK": sk},
        UpdateExpression="SET number_of_attempts = number_of_attempts + :inc, passed = :passed, last_attempt_time = :time",
        ExpressionAttributeValues={
            ":inc": 1,
            ":passed": passed,
            ":time": now,
        },
        ReturnValues="ALL_NEW"
    )

    updated_record = response.get("Attributes", {})
    return updated_record


def get_user_solved_stats(user_id: str):
    dynamodb = get_dynamodb_resource()
    tbl = dynamodb.Table("Attempts")

    # Get all attempts by the user
    response = tbl.query(
        KeyConditionExpression=Key("PK").eq(user_id)
    )

    items = response.get("Items", [])
    solved_counts = defaultdict(lambda: defaultdict(int))

    for item in items:
        if item.get("passed"):
            pattern = item.get("pattern", "Unknown")
            difficulty = item.get("difficulty", "Unknown")
            solved_counts[pattern][difficulty] += 1

    # Convert defaultdict to regular dict for output
    return {pattern: dict(difficulties) for pattern, difficulties in solved_counts.items()}
