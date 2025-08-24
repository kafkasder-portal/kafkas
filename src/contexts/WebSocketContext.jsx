import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  // const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Mock WebSocket connection for development
    const mockSocket = {
      send: (message) => {
        console.log('Mock WebSocket message sent:', message);
      },
      close: () => {
        console.log('Mock WebSocket closed');
        setIsConnected(false);
      },
    };

    setSocket(mockSocket);
    setIsConnected(true);

    return () => {
      if (mockSocket) {
        mockSocket.close();
      }
    };
  }, []);

  const sendMessage = (message) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  };

  const value = {
    socket,
    isConnected,
    messages,
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
