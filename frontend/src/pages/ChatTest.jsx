// ChatTest.jsx
// This page provides a simple test interface for sending and receiving messages with the backend ChatGPT API.

import React, { useState } from 'react';

/**
 * ChatTest page component.
 * Allows users to test the chat API by sending messages and viewing responses.
 */
export default function ChatTest() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Sends the user's message to the backend and updates the chat log with the response.
   */
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    const updatedMessages = [...chatLog, userMessage];

    setChatLog(updatedMessages);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      setChatLog([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setChatLog([...updatedMessages, { role: 'assistant', content: 'Error talking to GPT.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>🔧 Chat API Test</h2>
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', minHeight: '200px' }}>
        {chatLog.map((msg, idx) => (
          <div key={idx} style={{ margin: '0.5rem 0', color: msg.role === 'user' ? 'blue' : 'green' }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: '80%', padding: '0.5rem' }}
      />
      <button onClick={sendMessage} disabled={loading} style={{ padding: '0.5rem', marginLeft: '1rem' }}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
