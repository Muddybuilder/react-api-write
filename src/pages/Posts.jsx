import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AddBlogPost } from "./NewPost";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);

  const addNewPost = (newPost) => {
    setShowAddForm(false);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const headers = new Headers({ Authorization: `Bearer ${user.token}` });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/posts`, {
        method: "GET",
        headers: headers,
      });
      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }
      console.log("response came!");
      console.log(response);
      const data = await response.json();
      console.log(data);
      setPosts(data);
      setIsLoading(false);
    } catch (error) {
      setError("Error fetching posts: " + error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Posts by {user.username}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>
              {" "}
              {post.title} - {new Date(post.updatedAt).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
      {showAddForm ? (
        <AddBlogPost onAddPost={addNewPost} />
      ) : (
        <button onClick={() => setShowAddForm(true)}>Add New Post</button>
      )}
    </div>
  );
}

export default Posts;
