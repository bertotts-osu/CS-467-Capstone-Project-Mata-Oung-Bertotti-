# api.py
# Defines a Flask blueprint and utility functions for ChatGPT/Azure OpenAI endpoints and prompt handling.

import os
import requests
import traceback
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from .prompt_function import build_gpt_instructions, build_user_prompt

load_dotenv()

AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")  # e.g. https://cs467-chatgpt-api-challenge.openai.azure.com/
AZURE_DEPLOYMENT_NAME = os.getenv("AZURE_DEPLOYMENT_NAME")  # e.g. CS467-gpt-4o
AZURE_API_VERSION = os.getenv("AZURE_API_VERSION")  # e.g. 2024-11-20


def ask_gpt(messages):
    """
    Send a chat completion request to Azure OpenAI and return the response content.
    :param messages: List of message dicts for the chat (role/content)
    :return: The content of the AI's reply as a string, or error dict
    :raises ValueError: If required environment variables are missing
    """
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "").rstrip("/")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION")
    api_key = os.getenv("AZURE_OPENAI_KEY")

    print("[ENV DEBUG] endpoint:", endpoint)
    print("[ENV DEBUG] deployment:", deployment)
    print("[ENV DEBUG] api_version:", api_version)
    print("[ENV DEBUG] api_key:", "SET" if api_key else "MISSING")

    if not all([endpoint, deployment, api_version, api_key]):
        raise ValueError("Missing one or more Azure OpenAI environment variables.")

    url = f"{endpoint}/openai/deployments/{deployment}/chat/completions?api-version={api_version}"

    headers = {
        "Content-Type": "application/json",
        "api-key": api_key
    }

    payload = {
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 800,
        "top_p": 0.95,
        "frequency_penalty": 0,
        "presence_penalty": 0,
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code != 200:
        print("Error:", response.status_code, response.text)
        return {"error": response.text}

    return response.json()["choices"][0]["message"]["content"]


# Example test call
if __name__ == "__main__":
    message_log = [
        {"role": "system", "content": "You are an assistant that generates algorithm practice problems."},
        {"role": "user", "content": "Give me a binary search problem, medium difficulty."}
    ]
    reply = ask_gpt(message_log)
    print("GPT Response:", reply)

chatgpt_bp = Blueprint("chatgpt", __name__)


@chatgpt_bp.route("/api/problem-chat", methods=["POST"])
def problem_chat():
    """
    Flask route for handling problem chat requests to the AI assistant.
    Expects JSON with 'problem_type', 'difficulty', and user request info.
    :return: JSON response with the AI's reply or error message
    """
    try:
        data = request.json
        problem_type = data.get("problem_type")
        difficulty = data.get("difficulty")
        print("[DEBUG] Incoming data:", data)

        system_prompt = build_gpt_instructions(problem_type, difficulty)
        user_prompt = build_user_prompt(data)

        print("[DEBUG] System Prompt:", system_prompt)
        print("[DEBUG] User Prompt:", user_prompt)

        message_log = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        reply = ask_gpt(message_log)

        return jsonify({"response": reply})

    except Exception as e:
        print("[ERROR]", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
