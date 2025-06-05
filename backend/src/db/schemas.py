# schemas.py
# Defines Marshmallow schemas for validating problem and attempt data in the backend.

import uuid
from marshmallow import Schema, fields, ValidationError, validates


class ProblemSchema(Schema):
    """
    Marshmallow schema for validating coding problem data.
    Fields:
        - name: Name of the problem (required)
        - pattern: Problem pattern/category (required)
        - difficulty: Difficulty level (required, must be Easy, Medium, or Hard)
        - prompt: Problem prompt/description (required)
    """
    name = fields.String(required=True)
    pattern = fields.String(required=True)
    difficulty = fields.String(required=True)
    prompt = fields.String(required=True)

    @validates("difficulty")
    def validate_difficulty(self, value, **kwargs):
        """
        Validates that the difficulty is one of the allowed values.
        :param value: The difficulty value to validate
        :raises ValidationError: If the value is not allowed
        """
        if value not in ["Easy", "Medium", "Hard"]:
            raise ValidationError(f"Difficulty must be one of: Easy, Medium, Hard.")


class AttemptSchema(Schema):
    """
    Marshmallow schema for validating attempt IDs.
    Fields:
        - attempt_id: UUID4 string (required)
    """
    attempt_id = fields.String(required=True)

    @validates("attempt_id")
    def validate_attempt_id(self, value, **kwargs):  # **kwargs is required to handle data_key being sent implicitly
        """
        Validates that the attempt_id is a valid UUID4 string.
        :param value: The attempt_id value to validate
        :raises ValidationError: If the value is not a valid UUID4
        """
        try:
            uuid.UUID(value, version=4)  # ensure the attempt_id is a valid uuid4
        except ValueError:
            raise ValidationError("Attempt ID must be a valid UUID4.")

