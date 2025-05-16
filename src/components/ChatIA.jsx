import React, { useState } from 'react';
import axios from 'axios';
import './ChatIA.css';

export default function ChatIA() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage = { sender: 'user', text: trimmedInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/completions',
        {
          model: 'mistralai/mistral-7b-instruct',
          messages: newMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        },
        {
          headers: {
            Authorization: 'Bearer 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',
            'Content-Type': 'application/json',
          },
        }
      );

      const botReply = response.data.choices[0].message.content;
      setMessages([...newMessages, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error al obtener respuesta de la IA:', error);
      setMessages([
        ...newMessages,
        { sender: 'bot', text: '⚠️ No se pudo obtener una respuesta.' },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="iachat-container">
      <h2 className="text-center mb-3">Asistente Inteligente</h2>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-bubble bot">⏳ Pensando...</div>}
      </div>
      <div className="chat-input-area mt-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Pregúntale sobre fútbol..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          onClick={handleSendMessage}
          disabled={loading || input.trim() === ''}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
