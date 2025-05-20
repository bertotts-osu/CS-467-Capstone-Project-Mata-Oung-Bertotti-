from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute, BooleanAttribute, UTCDateTimeAttribute
import os


class ProblemModel(Model):
    class Meta:
        table_name = "Problems"
        region = os.getenv("COGNITO_REGION")
        aws_access_key_id = os.getenv("COGNITO_ACCESS_KEY")
        aws_secret_access_key = os.getenv("COGNITO_SECRET_ACCESS_KEY")

    PK = UnicodeAttribute(hash_key=True)
    SK = UnicodeAttribute(range_key=True)
    name = UnicodeAttribute()
    difficulty = UnicodeAttribute()
    index = NumberAttribute()
    prompt = UnicodeAttribute()


class UserAttemptModel(Model):
    class Meta:
        table_name = "Attempts"
        region = os.getenv("COGNITO_REGION")
        aws_access_key_id = os.getenv("COGNITO_ACCESS_KEY")
        aws_secret_access_key = os.getenv("COGNITO_SECRET_ACCESS_KEY")

    # Primary Key
    PK = UnicodeAttribute(hash_key=True)  # user_id
    SK = UnicodeAttribute(range_key=True)  # "pattern#difficulty#index#attempt_id"

    # Problem-specific fields
    pattern = UnicodeAttribute()
    difficulty = UnicodeAttribute()
    index = NumberAttribute()
    modified_prompt = UnicodeAttribute()

    # Attempt Tracking
    attempt_id = UnicodeAttribute(null=True)
    number_of_attempts = NumberAttribute()
    passed = BooleanAttribute()
    last_attempt_time = UTCDateTimeAttribute()
