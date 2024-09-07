import { RiCalendarTodoFill } from "react-icons/ri";
// eslint-disable-next-line react/prop-types
const AppBar = ({actions}) => {
    return (
        <div className="bg-blue-500 px-5 py-2 flex justify-between items-center">
            <RiCalendarTodoFill className="text-white text-3xl text-whiten "/>
            {actions && actions()} 
        </div>
    );
};

export default AppBar;