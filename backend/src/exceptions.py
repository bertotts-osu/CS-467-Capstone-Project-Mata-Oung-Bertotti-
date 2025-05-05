class ProblemNotFound(Exception):
    def __init__(self, pattern: str, difficulty: str, index: int):
        self.pattern = pattern
        self.difficulty = difficulty
        self.index = index
        message = f"Problem not found for pattern='{pattern}', difficulty='{difficulty}', index={index}"
        super().__init__(message)
