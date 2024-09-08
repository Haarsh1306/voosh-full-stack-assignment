const ViewTaskDetails = ({ task, onClose }) => {  
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-md shadow-md w-96">
            <h3 className="text-2xl font-semibold">{task.title}</h3>
            <p className=" text-gray-600 font-medium">{task.description}</p>
            <div className="mt-4 font-medium text-gray-600">
                Created at: {new Date(task.created_at).toLocaleString()}
            </div>
            <div className="mt-2 flex justify-end space-x-2">
                <button className="px-2 py-1 bg-blue-500 text-white rounded-sm" onClick={onClose}>Close</button>
            </div>
            </div>
        </div>
        );
  }

export default ViewTaskDetails;