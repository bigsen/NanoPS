import React from 'react';

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
      <strong className="font-bold">出错啦！</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};

export default ErrorAlert;