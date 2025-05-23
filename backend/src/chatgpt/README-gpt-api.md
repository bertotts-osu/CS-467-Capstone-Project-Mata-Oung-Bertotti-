# 📘 CS467 Capstone – Azure OpenAI Integration (Branch: dev\_fmata)

This README documents the Azure OpenAI API integration for the CS467 Capstone Project, handled in the `dev_fmata` branch. This integration enables dynamic problem generation and GPT-based feedback via a backend route.

---

## 🔧 Setup

### 1. Create `.env` file in `/server`

Make sure your `.env` file includes the following variables:

```bash
AZURE_OPENAI_KEY=your_azure_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_DEPLOYMENT_NAME=CS467-gpt-4o
```

> 🔐 Do NOT commit this file. It is already listed in `.gitignore`.

---

## 🧠 What This Integration Does

* Connects to Azure-hosted ChatGPT-4o via HTTP request.
* Sends a user-selected problem type and difficulty as structured JSON.
* Constructs a system-level prompt to guide ChatGPT on how to generate a problem and respond appropriately.
* Returns the AI-generated problem to the frontend.
* Supports future hint + feedback interactions based on user code submissions.

---

## 📡 Route: `POST /api/chat`

### Example Request Body

```json
{
  "message": "Please generate a new problem using Binary Search at medium difficulty.",
  "history": [
    { "role": "user", "content": "Can I get another variant?" },
    { "role": "assistant", "content": "Sure, here's one using a sorted rotated array..." }
  ]
}
```

### Example Response

```json
{
  "reply": "You're given a sorted array that has been rotated. Write a function to find a target number..."
}
```

---

## 🧪 Testing

### Using Frontend:

* Start your backend and frontend servers.
* Use the existing frontend layout (already implemented) to type a query.
* The response will be generated by GPT-4o and appear below the input field.

### Optional: Test via `curl`

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Please generate a new problem using Binary Search.",
    "history": []
  }'
```

---

## ✅ Next Steps

* Expand system prompt to handle test case generation and style feedback.
* Support user hint requests via `/api/hint` route (TBD).
* Add internal error handling + response time logging.

---

## 👨‍💻 Maintainer

**Fernando (dev\_fmata)**
Azure API integration, Prompt Engineering, ChatGPT customization

---

Let me know if you'd like to add collaborator instructions or rename this README before merging.
