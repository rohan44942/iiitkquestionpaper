const UnexpectedError = ({ children }) => {
  return (
    <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg mt-4">
      <h2 className="text-xl font-semibold">Error</h2>
      <p>{children}</p>
    </div>
  );
};

export default UnexpectedError;
