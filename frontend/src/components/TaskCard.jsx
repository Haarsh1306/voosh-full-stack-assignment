import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task, index, onDelete, onEdit, onView }) => {
  return (
    <Draggable draggableId={task.task_id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-green-100 shadow-md rounded-md p-4 mb-4"
        >
          <h3 className="text-2xl font-semibold">{task.title}</h3>
          <p className="text-gray-600 font-medium">{task.description}</p>
          <div className="mt-4 font-medium text-gray-600">
            Created at: {new Date(task.created_at).toLocaleString()}
          </div>
          <div className="mt-2 flex justify-end space-x-2">
            <button className="px-2 py-1 bg-red-500 text-white rounded-sm" onClick={() => onDelete(task.task_id)}>
              Delete
            </button>
            <button className="px-2 py-1 bg-blue-400 text-white rounded-sm" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button className="px-2 py-1 bg-blue-500 text-white rounded-sm" onClick={() => onView(task)}>
              View Details
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    task_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default TaskCard;
