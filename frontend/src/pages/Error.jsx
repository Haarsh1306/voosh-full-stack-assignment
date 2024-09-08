const Error = ({ message }) => {
  return (
    <div className="bg-gray-700 h-screen flex justify-center items-center">
      <h1 className="text-gray-200 text-2xl">{message}</h1>
    </div>
  );
};
export default Error;
