import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(email, password)
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/auth/login`,
      {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    const data = await response.json();

    console.log(data);
    await login({token: data.token, username:data.userName});

    // Here you would usually send a request to your backend to authenticate the user
    // For the sake of this example, we're using a mock authentication
  };
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
