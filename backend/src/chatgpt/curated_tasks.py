import json


def modify_problem(original_prompt, openAI_client):
    """
    Takes an original problem prompt and returns a modified version
    so that the solution is not easily memorized.
    """
    instruction = (
        """
         You are an AI tutor helping a user practice coding problems based on algorithm patterns.
         
         Your task:
          1. Modify the problem slightly to prevent memorization of the solution, while preserving its 
             structure and core challenge. It must remain at a similar level of difficulty.
          2. Provide only the modified problem prompt and a new example input/output.
          3. Format the response as a JSON object with exactly three **top-level** fields:
             - "name": the name of the problem (string)
             - "prompt": the modified problem description (string)
             - "example": an object with "input" and "output" fields that illustrate the problem
          4. Do not wrap these in an additional field like "problem". Return only "prompt" and "example" as top-level keys.
          5. Do not include any explanation, summary, or additional commentary — only the JSON.
        """
    )

    # build the conversation context
    messages = [
        {"role": "system", "content": "You are an Algorithm Mentor"},
        {"role": "user", "content": f"{instruction}\n\nProblem:\n{original_prompt}"}
    ]

    result = openAI_client.send_request(messages)
    modified_problem_str = result["choices"][0]["message"]["content"]
    try:
        modified_problem = json.loads(modified_problem_str)
    except json.JSONDecodeError:
        raise ValueError("The AI response was not valid JSON:\n" + modified_problem_str)
    return modified_problem


def generate_test_cases(original_prompt, openAI_client):
    """
    Takes an original problem prompt and returns test cases to test the problem's solution.
    """
    instruction = (
        """
         You are an AI tutor helping a user practice coding problems based on algorithm patterns.

         Your task:
            1. Generate test cases for the given problem prompt that cover a variety of edge cases.
            2. Provide both input and expected output for each test case.
            3. Just provide the test cases, no explanation or summary.
            4. Ensure that the test cases are written clearly and that they test different aspects of the problem.
            5. Do **not** include the `index` field in the problem.
        """
    )

    # build the conversation context
    messages = [
        {"role": "system", "content": "You are an Algorithm Mentor"},
        {"role": "user", "content": f"{instruction}\n\nProblem:\n{original_prompt}"}
    ]

    result = openAI_client.send_request(messages)
    test_cases = result["choices"][0]["message"]["content"]
    return test_cases
