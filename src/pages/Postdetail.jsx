import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Post() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const headers = new Headers({
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/posts/${postId}`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({ title, content, published: true }),
        }
      );
      if (!response.ok) throw new Error("Something went wrong");
      const updatedPost = await response.json();
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const headers = new Headers({
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    });

    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/posts/${postId}`,
          {
            method: "DELETE",
            headers: headers,
          }
        );
  
        if (!response.ok) throw new Error("Something went wrong");
        navigate("/posts");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    const headers = new Headers({ Authorization: `Bearer ${user.token}` });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/posts/${postId}`,
        {
          method: "GET",
          headers: headers,
        }
      );
      if (!response.ok) throw new Error("Something went wrong");

      const data = await response.json();

      setTitle(data.post.title);
      setContent(data.post.content);
      setIsPublished(data.post.published);
      setComments(data.comments);
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
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!title) return <p>Post not found</p>;

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <input
            type="text"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            defaultValue={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <label>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            Published?
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h1>{title}</h1>
          <p>{content}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </>
      )}
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.content} - {comment.authorName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Post;
