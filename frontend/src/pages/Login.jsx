import AuthForm from "../components/AuthForm";

const Login = () => {
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <AuthForm type="login" onSubmit={onSubmit} />
  );
};

export default Login;
