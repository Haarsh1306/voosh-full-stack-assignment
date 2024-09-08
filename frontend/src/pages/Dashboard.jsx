import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import axios from "axios";
import { toast } from "react-toastify";
import AppBar from "../components/AppBar";
import TaskModal from "../components/TaskModal";
import TaskCard from "../components/TaskCard";
import BACKEND_URL from "../../utils/backendUrl";
import ConfirmationModal from "../components/ConfirmationModal";
import ViewTaskDetails from "../components/ViewTaskDetails";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [columns, setColumns] = useState({
    pending: { title: "pending", items: [] },
    ongoing: { title: "ongoing", items: [] },
    done: { title: "done", items: [] },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredColumns, setFilteredColumns] = useState(columns);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewTaskDetailsModalOpen, setViewTaskDetailsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Recent");

  const actions = () => (
    <div>
      <button
        className="bg-red-500 text-white px-2 py-1 rounded-sm"
        onClick={onLogoutClick}
      >
        Logout
      </button>
    </div>
  );

  const onLogoutClick = () => {
    localStorage.removeItem("AUTH_TOKEN");
    navigate("/login");
  };

  const onAddClick = () => setModalOpen(true);
  const onCloseClick = () => setModalOpen(false);

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
        getTasks();
      }
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const onTaskUpdate = async (data) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL.tasks.update}/${selectedTask.task_id}`,
        data,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Task updated successfully");
        setSelectedTask(null);
        setModalOpen(false);
        getTasks();
      }
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const getTasks = async () => {
    try {
      const response = await axios.get(BACKEND_URL.tasks.get, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
        },
      });
      if (response.data.success) {
        const newColumns = {
          pending: { title: "pending", items: [] },
          ongoing: { title: "ongoing", items: [] },
          done: { title: "done", items: [] },
        };
        response.data.data.forEach((task) => {
          newColumns[task.status].items.push(task);
        });
        setColumns(newColumns);
        setFilteredColumns(newColumns);
        sortTasks(newColumns, sortOption);
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
      getTasks();
    }
  }, [navigate]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      const newColumns = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      };
      setColumns(newColumns);
      setFilteredColumns(newColumns);
      const taskId = result.draggableId;
      const newStatus = destination.droppableId;

      try {
        const response = await axios.put(
          `${BACKEND_URL.tasks.update}/${taskId}`,
          { status: newStatus },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
            },
          }
        );

        if (response.data.success) {
          toast.success("Task status updated successfully");
        }
      } catch (err) {
        toast.error("Failed to update task status");
        console.log(err.response.data);
      }
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      const newColumns = {
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      };
      setColumns(newColumns);
      setFilteredColumns(newColumns);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = Object.keys(columns).reduce((acc, columnId) => {
      const filteredItems = columns[columnId].items.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
      );
      acc[columnId] = { ...columns[columnId], items: filteredItems };
      return acc;
    }, {});

    setFilteredColumns(filtered);
    sortTasks(filtered, sortOption);
  };

  const deleteTaskConfirm = async () => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL.tasks.delete}/${taskToDelete}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Task deleted successfully");
        setTaskToDelete(null);
        setConfirmationModalOpen(false);
        getTasks();
      }
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const deleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setConfirmationModalOpen(true);
  };

  const editTask = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const viewTaskDetails = (task) => {
    setSelectedTask(task);
    setViewTaskDetailsModalOpen(true);
  };

  const sortTasks = (columnsToSort, option) => {
    const sortedColumns = Object.keys(columnsToSort).reduce((acc, columnId) => {
      let sortedItems = [...columnsToSort[columnId].items];
      if (option === "Recent") {
        sortedItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (option === "A-Z") {
        sortedItems.sort((a, b) => a.title.localeCompare(b.title));
      }
      acc[columnId] = { ...columnsToSort[columnId], items: sortedItems };
      return acc;
    }, {});

    setFilteredColumns(sortedColumns);
  };

  const handleSortChange = (event) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    sortTasks(filteredColumns, newSortOption);
  };

  return (
    <>
      {modalOpen && (
        <TaskModal
          type={selectedTask ? "update" : "create"}
          task={selectedTask}
          onSubmit={selectedTask ? onTaskUpdate : onTaskCreate}
          onClose={onCloseClick}
        />
      )}
      {confirmationModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this task?"
          isOpen={confirmationModalOpen}
          onClose={() => {
            setTaskToDelete(null);
            setConfirmationModalOpen(false);
          }}
          onConfirm={deleteTaskConfirm}
        />
      )}
      {viewTaskDetailsModalOpen && (
        <ViewTaskDetails
          task={selectedTask}
          onClose={() => {
            setSelectedTask(null);
            setViewTaskDetailsModalOpen(false);
          }}
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
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <span className="text-gray-700 font-medium">Sort By:</span>
              <select 
                className="border border-gray-300 rounded-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="Recent">Recent</option>
                <option value="A-Z">A-Z</option>
              </select>
            </div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
              {Object.entries(filteredColumns).map(([columnId, column]) => (
                <div key={columnId} className="flex-1 border-2">
                  <h2 className="text-lg font-semibold mb-4 bg-blue-500 text-white p-2 rounded-t-md">
                    {column.title}
                  </h2>
                  <Droppable droppableId={columnId}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="bg-gray-100 p-4 rounded-b-md min-h-[200px]"
                      >
                        {column.items.map((task, index) => (
                          <TaskCard
                            key={task.task_id}
                            task={task}
                            index={index}
                            onDelete={() => deleteTask(task.task_id)}
                            onEdit={() => {
                              editTask(task);
                            }}
                            onView={() => {
                              viewTaskDetails(task);
                            }}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </>
  );
};

export default Dashboard;