const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h5 className="text-lg font-semibold">Confirm Action</h5>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800 focus:outline-none"
              onClick={onClose}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className="px-4 py-4">
            <p>{message}</p>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;
  