import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AllPosts from './components/AllPosts';
import Post from './components/Post';
import EditComment from './components/EditComment';

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/comments/:id" element={<EditComment />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/posts" element={<AllPosts />} />
          {/*           <Route path="/new-post" element={<NewPost />} /> */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
