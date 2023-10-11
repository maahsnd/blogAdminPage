import React, { useState, useEffect } from 'react';
import { useUserContext } from './UserContext';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function EditComment() {
  const { user } = useUserContext();
  const [comment, setComment] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(null);
  const { id } = useParams();

  const fetchComment = async () => {
    try {
      const response = await fetch(`http://localhost:3000/comments/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setComment(data);
        setLoading(false);
      } else {
        // Handle errors here, e.g., redirect to an error page
        setLoading(false);
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      setLoading(false);
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (user && user.authenticated) {
      fetchComment(); // Fetch comment when the component mounts
    }
  }, [user, loading]); // Include 'id' as a dependency to fetch when the ID changes

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('jwt_token');
      const response = await fetch(
        `http://localhost:3000/comments/${comment._id}/edit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(comment)
        }
      );
      if (response.ok) {
        // Handle successful update
        fetchComment(); // Fetch post again after updating
        setMessage('Comment updated');
      } else {
        setMessage('Errors' + res.errors);
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('jwt_token');
      const response = await fetch(
        `http://localhost:3000/comments/${comment._id}/delete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ postid: comment.post })
        }
      );
      if (response.ok) {
        // Handle successful update
        setMessage('Comment Deleted');
        setDeleted(true);
      } else {
        setMessage('Errors' + response.errors);
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComment({
      ...comment,
      [name]: value
    });
  };

  if (!user || !user.authenticated) {
    return (
      <div>
        {loading ? <p>Loading</p> : ''}
        <>
          <Link to="/log-in">Login</Link>
        </>
      </div>
    );
  }

  if (deleted) {
    return (
      <div>
        <Link to={`/posts`}>All Posts</Link>
        <h3>{message}</h3>
      </div>
    );
  }

  if (!comment) {
    return <p>Loading: {loading ? 'loading' : 'comment not found'}</p>;
  }

  return !comment ? (
    <p>You do not have permission to edit this comment.</p>
  ) : (
    <div>
      <h1>Edit comment:</h1>
      <form onSubmit={submitEdit}>
        <textarea
          name="text"
          value={comment.text}
          onChange={handleInputChange}
          required
        ></textarea>
        <button type="submit">Save Changes</button>
      </form>
      <hr />
      <form onSubmit={deleteComment}>
        <button type="submit">Delete Comment</button>
      </form>
      <hr />
      <h4>{message ? message : ''}</h4>
    </div>
  );
}
