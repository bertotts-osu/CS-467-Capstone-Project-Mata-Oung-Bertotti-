import os
import requests
from dotenv import load_dotenv

load_dotenv()

AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")  # e.g. https://cs467-chatgpt-api-challenge.openai.azure.com/
AZURE_DEPLOYMENT_NAME = os.getenv("AZURE_DEPLOYMENT_NAME")  # e.g. CS467-gpt-4o
AZURE_API_VERSION = os.getenv("AZURE_API_VERSION")          # e.g. 2024-11-20

def ask_gpt(messages):
    url = f"{AZURE_OPENAI_ENDPOINT}openai/deployments/{AZURE_DEPLOYMENT_NAME}/chat/completions?api-version={AZURE_API_VERSION}"

    headers = {
        "Content-Type": "application/json",
        "api-key": AZURE_OPENAI_KEY
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
