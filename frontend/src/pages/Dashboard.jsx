import { useNavigate } from "react-router-dom";
import AppBar from "../components/AppBar";
import { useEffect } from "react";
import axios from "axios";
import BACKEND_URL from "../../utils/backendUrl";

const Dashboard = () => {
  const navigate = useNavigate();
  const onLogoutClick = () => {
    localStorage.removeItem("AUTH_TOKEN");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("AUTH_TOKEN");
    console.log(token);
    const getMe = async () => {
      try {
        const result = await axios.get(BACKEND_URL.auth.me, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if(!result.data.success){
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };
    if (!token) {
      navigate("/login");
    } else {
      getMe();
    }
  });
  const actions = () => {
    return (
      <div>
        <button
          className={"bg-red-500 text-white px-2 py-1 rounded-sm"}
          onClick={onLogoutClick}
        >
          Logout
        </button>
      </div>
    );
  };
  return (
    <div>
      <AppBar actions={actions} />
    </div>
  );
};

export default Dashboard;
