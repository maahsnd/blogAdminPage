import React, { useState, useEffect } from 'react';
import Login from './Login';
import { useUserContext } from './UserContext';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

export default function AllPosts() {
  const { user } = useUserContext();
  const [post, setPost] = useState({ user: user._id });

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

  const submitNewPost = (e) => {
    e.preventDefault();
    console.log(post);
  };

  if (user && user.authenticated) {
    return (
      <div>
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
      </div>
    );
  } else {
    return <Login />;
  }
}
