import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo1.jpg"; // Adjust the path
import '../pages/styles/login.css'; // Adjust path based on your structure

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3001/api/login', { username, password });
      if (response.status === 200) {
        // Successfully logged in
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/petList'); // Redirect to the pet list page after successful login
      }
    } catch (err) {
      setError('Login failed. Please check your username and password.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="login-logo" /> {/* Add the image */}
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="login-button">Login</button> {/* Login button */}
      </form>
      <button onClick={() => navigate('/register')} className="register-button">
        Register
      </button>
    </div>
  );
};

export default Login;
