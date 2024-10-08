import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../../utils/backendUrl";
import AuthForm from "../components/AuthForm";
import axios from "axios";
import { useState } from "react";
const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await axios.post(BACKEND_URL.auth.login, data);
      if (result.data.success) {
        localStorage.setItem("AUTH_TOKEN", result.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  };


  return <AuthForm type="login" onSubmit={onSubmit} Error={error} />;
};

export default Login;
