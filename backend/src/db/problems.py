# problems.py
# Provides functions for CRUD operations and utilities related to coding problems in DynamoDB.

import random
from src.db.models import ProblemModel
from src.exceptions import ProblemNotFound


def get_problem(pattern: str, difficulty: str) -> dict:
    """
    Select a random problem from the available patterns/difficulty.
    :param pattern: The problem pattern/category
    :param difficulty: The difficulty level
    :return: Dictionary with problem details
    :raises ProblemNotFound: If no problem is found for the given pattern and difficulty
    """
    index = get_random_problem_number(pattern, difficulty)
    sk = f"{difficulty}#{index}"

    try:
        # Fetch the problem from DynamoDB using pattern and SK
        result = ProblemModel.get(pattern, sk)
        return {
            "pattern": result.PK,
            "name": result.name,
            "difficulty": result.difficulty,
            "index": result.index,
            "prompt": result.prompt
        }
    except ProblemModel.DoesNotExist:
        raise ProblemNotFound(pattern, difficulty, index)


def add_problem(data: dict) -> dict:
    """
    Add a new problem to DynamoDB.
    :param data: Dictionary with problem data (pattern, name, difficulty, prompt)
    :return: Dictionary with the created problem's details
    """
    # Determine the next index for the problem
    index = get_problem_count(data["pattern"], data["difficulty"]) + 1
    problem = ProblemModel(
        PK=data["pattern"],
        SK=f"{data['difficulty']}#{index}",
        name=data["name"],
        difficulty=data["difficulty"],
        index=index,
        prompt=data["prompt"]
    )
    problem.save()

    if not problem:
        raise Exception("Unable to fetch problem.")

    formatted_problem = {
        "pattern": problem.PK,
        "name": problem.name,
        "difficulty": problem.difficulty,
        "index": problem.index,
        "prompt": problem.prompt
    }
    return formatted_problem


def get_problem_count(pattern: str, difficulty: str) -> int:
    """
    Get the count of problems for a given pattern and difficulty.
    :param pattern: The problem pattern/category
    :param difficulty: The difficulty level
    :return: Number of problems for the given pattern and difficulty
    """
    sk_prefix = f"{difficulty}#"
    result = ProblemModel.query(pattern, ProblemModel.SK.startswith(sk_prefix))

    result_list = list(result)
    count = len(result_list)
    return count if count > 0 else 0


def get_random_problem_number(pattern: str, difficulty: str) -> int:
    """
    Generate a random problem number based on the available problems for a pattern and difficulty.
    :param pattern: The problem pattern/category
    :param difficulty: The difficulty level
    :return: Randomly selected problem index (1-based)
    """
    count = get_problem_count(pattern, difficulty)
    rand_index = random.randint(1, count)
    return rand_index


