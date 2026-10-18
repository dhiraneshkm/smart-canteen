import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuth } from './AuthContext';
import { Order, QueueStatus } from '../types';

interface WebSocketContextType {
  connected: boolean;
  subscribeToOrders: (callback: (order: Order) => void) => () => void;
  subscribeToQueue: (callback: (status: QueueStatus) => void) => () => void;
  subscribeToUserOrders: (userId: number, callback: (order: Order) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const wsUrl = import.meta.env.VITE_WS_URL || `${protocol}//${host}:8080/ws`;

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.warn('STOMP protocol error:', frame.headers['message']);
      },
      onWebSocketError: () => {
        // Will automatically retry via reconnectDelay
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  const subscribeToOrders = (callback: (order: Order) => void) => {
    if (!clientRef.current) return () => {};
    const subscription = clientRef.current.subscribe('/topic/orders', (message) => {
      try {
        const order = JSON.parse(message.body) as Order;
        callback(order);
      } catch (err) {
        console.error('Error parsing order WS message', err);
      }
    });
    return () => subscription.unsubscribe();
  };

  const subscribeToQueue = (callback: (status: QueueStatus) => void) => {
    if (!clientRef.current) return () => {};
    const subscription = clientRef.current.subscribe('/topic/queue', (message) => {
      try {
        const status = JSON.parse(message.body) as QueueStatus;
        callback(status);
      } catch (err) {
        console.error('Error parsing queue WS message', err);
      }
    });
    return () => subscription.unsubscribe();
  };

  const subscribeToUserOrders = (userId: number, callback: (order: Order) => void) => {
    if (!clientRef.current) return () => {};
    const subscription = clientRef.current.subscribe(`/topic/orders/user/${userId}`, (message) => {
      try {
        const order = JSON.parse(message.body) as Order;
        callback(order);
      } catch (err) {
        console.error('Error parsing user order WS message', err);
      }
    });
    return () => subscription.unsubscribe();
  };

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        subscribeToOrders,
        subscribeToQueue,
        subscribeToUserOrders,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
