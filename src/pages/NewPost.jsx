import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const AddBlogPost = ({ onAddPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const headers = new Headers({
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/posts`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ title, content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add post");
      }

      const newPost = await response.json();
      onAddPost(newPost);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
    onAddPost({ title, content });
    setTitle("");
    setContent("");
  };

  return (
<div>
      <h2>Add New Blog Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Blog Post'}
        </button>
      </form>
    </div>  );
};
