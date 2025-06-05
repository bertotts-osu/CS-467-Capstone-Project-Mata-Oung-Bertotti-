# exceptions.py
# Defines custom exception classes for the backend.

class ProblemNotFound(Exception):
    """
    Exception raised when a problem with the specified pattern, difficulty, and index is not found.
    """
    def __init__(self, pattern: str, difficulty: str, index: int):
        """
        Initialize the ProblemNotFound exception.
        :param pattern: The pattern of the problem
        :param difficulty: The difficulty level
        :param index: The index of the problem
        """
        self.pattern = pattern
        self.difficulty = difficulty
        self.index = index
        # Construct a descriptive error message
        message = f"Problem not found for pattern='{pattern}', difficulty='{difficulty}', index={index}"
        super().__init__(message)
