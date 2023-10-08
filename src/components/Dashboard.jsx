import React from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import { useUserContext } from './UserContext';

function Dashboard() {
  const { user, setUser } = useUserContext();
  if (user && user.authenticated) {
    return (
      <div>
        <h2>Welcome to the Dashboard</h2>
        <Link to="/posts">View All Posts</Link>
        <Link to="/new-post">Create New Post</Link>
      </div>
    );
  } else {
    return <Login />;
  }
}

export default Dashboard;
