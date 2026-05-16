import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password })
    });
    const data = await res.json();
    if (data.token) {
      setLoggedIn(true);
      setUsername(data.username);
      setMessage('');
    } else {
      setMessage(data.error);
    }
  };

  const handleRegister = async () => {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (data.message) setIsLogin(true);
  };

  if (loggedIn) {
    return (
      <div className="container">
        <div className="card">
          <h2>🎉 Welcome, {username}!</h2>
          <p>You are successfully logged in.</p>
          <p>BSE-8B DevOps Final Project ✅</p>
          <button onClick={() => setLoggedIn(false)}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>🚀 DevOps Project</h1>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        {message && <p className="message">{message}</p>}

        <button onClick={isLogin ? handleLogin : handleRegister}>
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p onClick={() => setIsLogin(!isLogin)} className="toggle">
          {isLogin ? 'No account? Register here' : 'Have account? Login here'}
        </p>
      </div>
    </div>
  );
}

export default App;