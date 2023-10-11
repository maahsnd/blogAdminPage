import React, { useState, useEffect } from 'react';
import Login from './Login';
import { useUserContext } from './UserContext';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import EditCommentBtn from './EditCommentBtn';

export default function Post() {
  const { user } = useUserContext();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
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
        setPost(data);
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
      fetchPost(); // Fetch post when the component mounts
    }
  }, [user, loading]); // Include 'id' as a dependency to fetch when the ID changes

  const submitEdit = async (e) => {
    e.preventDefault();
    console.log(post);
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
        // Handle successful update
        fetchPost(); // Fetch post again after updating
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value
    });
  };

  if (!user || !user.authenticated) {
    return (
      <div>
        {loading ? <p>Loading</p> : ''}
        <>
          <Link to="/log-in">Login</Link>
          <Link to="/posts">Posts</Link>{' '}
        </>
      </div>
    );
  }

  if (!post) {
    return <p>Loading: {loading}</p>;
  }

  return !post ? (
    <p>You do not have permission to edit this post.</p>
  ) : (
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
            onChange={(e) => setPost({ ...post, published: e.target.checked })}
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
            <EditCommentBtn id={comment._id} />
            <hr />
          </div>
        ))
      ) : (
        <p>No comments yet!</p>
      )}
      <hr />
    </div>
  );
}
