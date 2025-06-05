# curated_tasks.py
# Provides functions for modifying coding problems and generating test cases using ChatGPT/Azure OpenAI.

import json


def modify_problem(original_prompt, openAI_client):
    """
    Takes an original problem prompt and returns a modified version
    so that the solution is not easily memorized.
    :param original_prompt: The original problem prompt string
    :param openAI_client: An instance of AzureOpenAIClient
    :return: Dictionary with keys 'name', 'prompt', and 'example'
    :raises ValueError: If the AI response is not valid JSON
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
          6. Please return the response as raw JSON only—do not wrap it in markdown code fences or add any 
            explanations.
        """
    )

    # Build the conversation context for the AI
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


def generate_test_cases(prompt, openAI_client):
    """
    Takes an original problem prompt and returns test cases to test the problem's solution.
    :param prompt: The problem prompt string
    :param openAI_client: An instance of AzureOpenAIClient
    :return: List of up to 3 test case dictionaries
    :raises ValueError: If the AI response is not valid JSON
    """
    instruction = (
        """
         You are an AI tutor helping a user practice coding problems based on algorithm patterns.

         Your task:
            1. Generate 3 test cases that cover normal and edge cases.
            2. Return only the test cases as a JSON list.
            3. Each test case must be a dictionary with:
                - "input": a string of **valid Python variable assignments** (e.g., [1, 2, 3] or 4 or "test")
                - "expected_output": the expected return value from the user's function
            4. The assignments must use only simple data types: lists, integers, floats, strings, booleans, or None.
            5. Return ONLY a raw JSON list of 3 test cases — no explanation, no extra text, no markdown.
            6. Do NOT return named variables for the input, just the raw value. For example DO NOT DO THIS, 'arr = [42]'
            7. Please return the response as raw JSON only—do not wrap it in markdown code fences or add any 
            explanations.
        """
    )

    # Build the conversation context for the AI
    messages = [
        {"role": "system", "content": "You are an Algorithm Mentor"},
        {"role": "user", "content": f"{instruction}\n\nProblem:\n{prompt}"}
    ]

    result = openAI_client.send_request(messages)
    raw_output = result["choices"][0]["message"]["content"]

    try:
        test_cases = json.loads(raw_output)
        return test_cases[:3]
    except json.JSONDecodeError:
        raise ValueError("OpenAI response was not valid JSON.")
