import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../../utils/backendUrl";
import AuthForm from "../components/AuthForm";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
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
      console.log(error.response.data.error);
      setError(error.response.data.error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("AUTH_TOKEN");
    const getMe = async () => {
      try {
        const result = await axios.get(BACKEND_URL.auth.me, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (result.data.success) {
          navigate("/dashboard");
        }
      } catch {
        navigate("/login");
      }
    };
    getMe();
  }, [navigate]);

  return <AuthForm type="login" onSubmit={onSubmit} Error={error} />;
};

export default Login;
