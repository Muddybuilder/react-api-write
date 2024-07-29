import "./LoginForm.css";

const LoginForm = () => {
  return (
    <div id="login-form">
      <h1>Login</h1>
      <form>
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" name="email" />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default LoginForm;
