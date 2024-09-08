import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../../utils/backendUrl";
import AuthForm from "../components/AuthForm";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
const Signup = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      console.log(data);
      const result = await axios.post(BACKEND_URL.auth.register, data);
      if (result.data.success) {
        toast.success("Signup Successfull, Please Login");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response.data.error);
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
        navigate("/signup");
      }
    };
    getMe();
  }, []);
  return (
    <div>
      <AuthForm type="signup" onSubmit={onSubmit} Error={error} />
    </div>
  );
};

export default Signup;
