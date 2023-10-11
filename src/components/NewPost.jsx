import React, { useState, useEffect } from 'react';
import Login from './Login';
import { useUserContext } from './UserContext';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

export default function AllPosts() {
  const { user } = useUserContext();
  const [post, setPost] = useState({ title: '', text: '', published: '' });
  const [message, setMessage] = useState(null);
  const [postCreated, setPostCreated] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value
    });
  };

  const handleCheck = (e) => {
    const value = e.target.checked;
    setPost({
      ...post,
      published: value
    });
  };

  const submitNewPost = async (e) => {
    e.preventDefault();
    const body = post;
    body.user = user._id;
    try {
      const token = Cookies.get('jwt_token');
      const response = await fetch('http://localhost:3000/posts/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      if (response.ok) {
        // Handle successful create
        setMessage('Post Created');
        setPostCreated(data.id);
      } else {
        setMessage(
          `Error in field ${data.errors[0].path}:${data.errors[0].msg} `
        );
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (user && user.authenticated && postCreated) {
    return (
      <div>
        <h3>{message}</h3>
        <Link to={`/posts/${postCreated}`}>View post</Link>
      </div>
    );
  }
  if (user && user.authenticated) {
    return (
      <div>
        <Link to="/">Dashboard</Link>
        <h1>Create New Post</h1>
        <form onSubmit={submitNewPost}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInputChange}
          />
          <label htmlFor="text">Text</label>
          <textarea
            name="text"
            value={post.text}
            onChange={handleInputChange}
            required
          ></textarea>
          <label htmlFor="published">Publish?</label>
          <input
            type="checkbox"
            name="published"
            id="published"
            value={post.published}
            onChange={handleCheck}
          />
          <button type="submit">Submit</button>
        </form>
        <h4>{message}</h4>
      </div>
    );
  } else {
    return <Login />;
  }
}
