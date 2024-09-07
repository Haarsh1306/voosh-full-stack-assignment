import { useNavigate } from "react-router-dom";
import AppBar from "../components/AppBar";
import { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URL from "../../utils/backendUrl";
import { toast } from "react-toastify";
import TaskModal from "../components/TaskModal";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const actions = () => {
    return (
      <div>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded-sm"
          onClick={onLogoutClick}
        >
          Logout
        </button>
      </div>
    );
  };
  const onLogoutClick = () => {
    localStorage.removeItem("AUTH_TOKEN");
    navigate("/login");
  };

  const onAddClick = () => {
    setModalOpen(true);
  };
  const onCloseClick = () => {
    setModalOpen(false);
  };
  const onTaskCreate = async (data) => {
    try {
      const response = await axios.post(BACKEND_URL.tasks.create, data, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
        },
      });
      if (response.data.success) {
        toast.success("Task created successfully");
        setModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response.data);
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
        if (!result.data.success) {
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
  }, []);

  async function getTasks() {
    try {
      const response = await axios.get(BACKEND_URL.tasks.get, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
        },
      });
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (err) {
      toast.error(err.response.data);
    }
  }
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      {modalOpen && (
        <TaskModal
          type="create"
          onSubmit={onTaskCreate}
          onClose={onCloseClick}
        />
      )}
      <div className="w-full">
        <AppBar actions={actions} />
        <div className="flex flex-col space-y-4 mt-4 px-5">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-sm w-auto self-start hover:bg-blue-600 transition-colors"
            onClick={onAddClick}
          >
            Add Task
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 shadow-lg p-2 rounded-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <span className="text-gray-700 font-medium">Search:</span>
              <input
                type="text"
                placeholder="Search tasks..."
                className="border border-gray-300 rounded-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <span className="text-gray-700 font-medium">Sort By:</span>
              <select className="border border-gray-300 rounded-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Recent</option>
                <option>Priority</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
