import uuid

from marshmallow import Schema, fields, ValidationError, validates


class ProblemSchema(Schema):
    name = fields.String(required=True)
    pattern = fields.String(required=True)
    difficulty = fields.String(required=True)
    prompt = fields.String(required=True)

    @validates("difficulty")
    def validate_difficulty(self, value, **kwargs):
        if value not in ["Easy", "Medium", "Hard"]:
            raise ValidationError(f"Difficulty must be one of: Easy, Medium, Hard.")


class AttemptSchema(Schema):
    attempt_id = fields.String(required=True)

    @validates("attempt_id")
    def validate_attempt_id(self, value, **kwargs):  # **kwargs is required to handle data_key being sent implicitly
        try:
            uuid.UUID(value, version=4)  # ensure the attempt_id is a valid uuid4
        except ValueError:
            raise ValidationError("Attempt ID must be a valid UUID4.")

