from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute
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
