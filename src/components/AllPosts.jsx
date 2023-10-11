import React, { useState, useEffect } from 'react';
import Login from './Login';
import { useUserContext } from './UserContext';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import EditCommentBtn from './EditCommentBtn';

export default function AllPosts() {
  const { user } = useUserContext();
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/posts/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data); // Update the posts state with fetched data
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (user && user.authenticated) {
      fetchPosts(); // Fetch posts when the component mounts
    }
  }, [user]);

  const editPublishStatus = async (e, post, publishStatusChange) => {
    e.preventDefault();

    publishStatusChange ? (post.published = true) : (post.published = false);
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
        fetchPosts(); // Fetch posts again after updating
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (user && user.authenticated) {
    const filteredPosts = posts.filter((post) => post.user._id == user._id);
    if (filteredPosts.length < 1) {
      return <p>You have no posts</p>;
    }

    return (
      <div>
        <h1>Posts</h1>
        {posts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post._id}>
              <h3>{post.title}</h3>
              <h4>By: {post.user.user_name}</h4>
              <p>{post.formatted_date}</p>
              <Link to={`${post._id}`}>View and edit post</Link>
              {post.published ? (
                <button onClick={(e) => editPublishStatus(e, post, false)}>
                  Unpublish post
                </button>
              ) : (
                <button onClick={(e) => editPublishStatus(e, post, true)}>
                  Publish post
                </button>
              )}

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
          ))
        ) : (
          <p>No posts yet!</p>
        )}
      </div>
    );
  } else {
    return <Login />;
  }
}
