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
