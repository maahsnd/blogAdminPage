import React from 'react';
import Login from './Login';
import { useUserContext } from './UserContext';

function AllPosts() {
  const { user, setUser } = useUserContext();
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
        console.log(data);
        return data;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const editPublishStatus = async (e, post, publishStatusChange) => {
    e.preventDefault();

    publishStatusChange ? (post.published = true) : (post.published = false);
    try {
      await fetch(`http://localhost:3000/posts/${post._id}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(post)
      });
      if (response.ok) {
        console.log('post updated successfully');
        return;
      } else {
        // Handle authentication error
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (user.authenticated) {
    const posts = fetchPosts();
    return (
      <div>
        <h1>Posts</h1>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id}>
              <h3>
                <a href={'posts/' + post._id}>{post.title}</a>
              </h3>
              <h4>By: {post.user.user_name}</h4>
              <p>{post.formatted_date}</p>
              <p>{post.text}</p>
              {post.published ? (
                <button onClick={() => publishStatusChange(e, post, false)}>
                  Unpublish post
                </button>
              ) : (
                <button onClick={() => publishStatusChange(e, post, false)}>
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

export default Dashboard;
