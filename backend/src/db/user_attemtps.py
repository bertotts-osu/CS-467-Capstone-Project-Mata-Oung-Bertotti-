import uuid
from src.db.models import UserAttemptModel
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
