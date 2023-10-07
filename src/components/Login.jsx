import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUserContext } from './UserContext';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const history = useNavigate();
  const { user, setUser } = useUserContext();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('INSERT_HTTP_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        // Store the JWT token in cookies
        Cookies.set('jwt_token', data.token);
        setUser(data.user._id);
        // Redirect to a protected route (e.g., dashboard)
        history.push('/dashboard');
      } else {
        // Handle authentication error
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
