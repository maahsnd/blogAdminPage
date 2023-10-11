import React from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import { useUserContext } from './UserContext';

function Dashboard() {
  const { user, setUser } = useUserContext();
  const logOut = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/log-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setUser(null);
        return;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  if (user && user.authenticated) {
    return (
      <div>
        <h2>Welcome to the Dashboard, {user.user_name}</h2>
        <Link to="/posts">View All Posts</Link>
        <hr />
        <Link to="/posts/new">Create New Post</Link>
        <hr />
        <button onClick={logOut}>Log Out</button>
      </div>
    );
  } else {
    return <Login />;
  }
}

export default Dashboard;
