import React, { useContext, useEffect, useRef } from 'react';
import { AppState } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer';

import NotificationScreen from '../NotificationScreen/index';

import { notification_store } from '../../store/notification';
import { socket } from '../Home/index';

export default function NotificationTab() {
  const NotificationStore = useContext(notification_store);
  const { addNewNotification, setAllAsViewed } = NotificationStore.methods;

  const isFocused = useIsFocused(false);

  const appState = useRef(AppState.currentState);

  var interval;

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
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

  function _handleAppStateChange(nextAppState) {
    if (
      appState.current.match(/inactive|background/) && nextAppState === "active"
    ) {
      BackgroundTimer.clearInterval(interval);
    } else {
      interval = BackgroundTimer.setInterval(() => {
        socket.emit('online')
      }, 5000)

      appState.current = nextAppState;
    }
  };

  return (
    <NotificationScreen isFocused={isFocused} />
  );
}