import React from 'react';

const PredictionChat: React.FC = () => {
  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h3 className="text-lg font-semibold mb-4">Discussion</h3>
      <div className="flex flex-col space-y-4 h-40 overflow-y-auto border border-gray-300 rounded-md p-4">
        {/* Message display area - Placeholder for messages */}
        <div className="text-gray-600 italic">No messages yet. Start the conversation!</div>
      </div>
      <div className="flex mt-4 space-x-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Send
        </button>
      </div>
    </div>
  );
};

export default PredictionChat;