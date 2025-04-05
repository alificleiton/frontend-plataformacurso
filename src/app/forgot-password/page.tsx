'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="container">
      <style>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #f0f2f5;
          padding: 20px;
        }
        .card {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }
        .title {
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: bold;
          color: #333;
        }
        .input-group {
          margin-bottom: 20px;
        }
        .input-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          color: #555;
        }
        .input-group input {
          width: 100%;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 16px;
        }
        .button {
          width: 100%;
          padding: 12px;
          border: none;
          background-color: #0070f3;
          color: white;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .button:hover {
          background-color: #0059c1;
        }
        .message {
          text-align: center;
          margin-top: 15px;
          color: green;
          font-size: 14px;
        }
      `}</style>

      <div className="card">
        <h1 className="title">Esqueceu a Senha?</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button">
            Enviar link de recuperação
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}