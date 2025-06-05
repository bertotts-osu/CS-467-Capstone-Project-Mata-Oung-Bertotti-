# api_utils.py
# Provides a utility client for interacting with the Azure OpenAI API from the backend.

import json
import requests


class AzureOpenAIClient:
    """
    Client for sending chat completion requests to Azure OpenAI API.
    """
    def __init__(self, endpoint, deployment_name, api_version, api_key):
        """
        Initialize the AzureOpenAIClient.
        :param endpoint: Azure OpenAI endpoint URL
        :param deployment_name: Name of the OpenAI deployment
        :param api_version: API version string
        :param api_key: Azure OpenAI API key
        """
        self.endpoint = endpoint
        self.deployment_name = deployment_name
        self.api_version = api_version
        self.api_key = api_key

    def send_request(self, messages, temperature=0.7, max_tokens=800, top_p=0.95,
                     frequency_penalty=0, presence_penalty=0, **kwargs):
        """
        Send a chat completion request to the Azure OpenAI API.
        :param messages: List of message dicts for the chat (role/content)
        :param temperature: Sampling temperature
        :param max_tokens: Maximum number of tokens in the response
        :param top_p: Nucleus sampling probability
        :param frequency_penalty: Frequency penalty
        :param presence_penalty: Presence penalty
        :param kwargs: Additional parameters for the API
        :return: JSON response from the API or error dict
        """
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
