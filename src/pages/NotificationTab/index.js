import React, { useContext, useEffect, useMemo } from 'react';
import socketio from 'socket.io-client';
import { useIsFocused } from '@react-navigation/native';

import NotificationScreen from '../NotificationScreen/index';

import { notification_store } from '../../store/notification';
import { store } from '../../store/store';

export default function NotificationTab() {
  const GlobalStore = useContext(store);
  const { server_ip, server_port, employee_id, oneSignalUserId } = GlobalStore.state;

  const NotificationStore = useContext(notification_store);
  const { addNewNotification, setAllAsViewed } = NotificationStore.methods;

  const isFocused = useIsFocused(false);

  const socket = useMemo(() =>
    socketio(`http://${server_ip}:${server_port}`, {
      query: {
        employee_id,
        oneSignalUserId: oneSignalUserId,
      }
    }), [employee_id]);

  useEffect(() => {
    console.log('socket is listening...');
    socket.on('notification', () => {
      addNewNotification();
    });
  }, [socket]);

  useEffect(() => {
    if (isFocused && NotificationStore.state.notification_count > 0) {
      console.log('marcando como vista');
      setAllAsViewed();
    }
  }, [isFocused]);

  return (
    <NotificationScreen isFocused={isFocused} />
  );
}