import React, { useState, useEffect } from 'react';
import Login from './Login';
import { useUserContext } from './UserContext';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Post() {
  const { user } = useUserContext();
  const [post, setPost] = useState([]);
  const { id } = useParams();

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPost(data); // Update the post state with fetched data
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (user && user.authenticated) {
      fetchPost(); // Fetch post when the component mounts
    }
  }, [user]);

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('jwt_token');
      const response = await fetch(
        `http://localhost:3000/posts/${post._id}/edit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(post)
        }
      );
      if (response.ok) {
        fetchPost(); // Fetch posts again after updating
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value
    });
  };

  if (user && user.authenticated && post.user == user._id) {
    return (
      <div>
        <h1>Edit post:</h1>
        <form onSubmit={submitEdit}>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="text"
            value={post.text}
            onChange={handleInputChange}
            required
          ></textarea>
          <label>
            Published:
            <input
              type="checkbox"
              name="published"
              checked={post.published}
              onChange={(e) =>
                setPost({ ...post, published: e.target.checked })
              }
            />
          </label>
          <button type="submit">Save Changes</button>
        </form>
        <hr />
        <h4>Comments</h4>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div key={comment._id}>
              <h5>{comment.user.user_name}</h5>
              <p>{comment.text}</p>
              <p>-- {comment.date}</p>

              <hr />
            </div>
          ))
        ) : (
          <p>No comments yet!</p>
        )}
        <hr />
      </div>
    );
  } else {
    return (
      <>
        <Link to="/log-in">Login</Link>
        <Link to="/posts">Posts</Link>
      </>
    );
  }
}
