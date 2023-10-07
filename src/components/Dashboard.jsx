import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <button>
        <Link to="/posts">View All Posts</Link>
      </button>
      <button>
        <Link to="/new-post">Create New Post</Link>
      </button>
    </div>
  );
}

export default Dashboard;
