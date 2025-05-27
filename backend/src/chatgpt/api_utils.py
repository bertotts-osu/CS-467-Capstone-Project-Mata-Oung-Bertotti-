import json

import requests


class AzureOpenAIClient:
    def __init__(self, endpoint, deployment_name, api_version, api_key):
        self.endpoint = endpoint
        self.deployment_name = deployment_name
        self.api_version = api_version
        self.api_key = api_key

    def send_request(self, messages, temperature=0.7, max_tokens=800, top_p=0.95,
                     frequency_penalty=0, presence_penalty=0, **kwargs):

        url = (f"{self.endpoint}/openai/deployments/{self.deployment_name}/chat/completions?api-version"
               f"={self.api_version}")

        headers = {
            "Content-Type": "application/json",
            "api-key": self.api_key
        }

        payload = {
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "top_p": top_p,
            "frequency_penalty": frequency_penalty,
            "presence_penalty": presence_penalty,
            **kwargs
        }

        try:
            # Send POST request to the Azure OpenAI API
            response = requests.post(url, headers=headers, json=payload)

            if response.status_code != 200:
                print("Error:", response.status_code, response.text)
                return {"error": response.text}

            # Extract the full JSON response
            return response.json()

        except Exception as e:
            raise Exception(f"Error during request: {str(e)}")
