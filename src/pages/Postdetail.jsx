import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Post() {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { postId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const headers = new Headers({ 'Authorization': `Bearer ${user.token}` }); 

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/posts/user/myposts/${postId}`,
        {
          method: "GET",
          headers: headers,
        }
      );      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }
      console.log("response came!");
      console.log(response)
      const data = await response.json();
      
      setPost(data.post);
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

  //   TODO: Add "Add comment" button and request to server
  return (
    <div>
      <h1>Title: {post.title}</h1>
      <h2>Modified Date: {new Date(post.updatedAt).toLocaleDateString()}</h2>
      <p>Content:</p>
      <p>{post.content}</p>

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
