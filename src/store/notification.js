import React, { createContext, useReducer, useContext, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { differenceInMinutes, parseISO, isToday } from 'date-fns';
import socketio from 'socket.io-client';
import axios from 'axios';

const initialState = {
  notification_count: 0,
  new_notifications: [],
  today_notifications: [],
  previous_notifications: [],
};

const notification_store = createContext(initialState);
const { Provider } = notification_store;

const NotificationStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((prevState, action) => {
    switch (action.type) {
      case 'MarkAllAsViewed':
        return {
          ...prevState,
          notification_count: 0,
          new_notifications: action.payload.new_notifications,
        }

      case 'setNotification':
        return {
          ...prevState,
          notification_count: action.payload.notification_count,
          new_notifications: action.payload.new_notifications,
          today_notifications: action.payload.today_notifications,
          previous_notifications: action.payload.previous_notifications,
        }

      case 'addOnlyOne':
        const new_state = [
          action.payload.new_notification,
          ...prevState.notifications
        ];

        let count = 0;
        new_state.map(item => {
          if (item.read === false) {
            count++;
          }
        });

        return {
          ...prevState,
          notification_count: new_state,
        }

      default:
        throw new Error();
    };
  }, initialState);

  async function loadNotification() {
    const userToken = await AsyncStorage.getItem('@auth_token');
    const server_ip = await AsyncStorage.getItem('@server_ip');
    const server_port = await AsyncStorage.getItem('@server_port');
    const employee_id = await AsyncStorage.getItem('@employee_id');

    const response = await axios.get(
      `http://${server_ip}:${server_port}/notification/${employee_id}`,
      {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    let count = 0;
    const new_notifications = [];
    const today_notifications = [];
    const previous_notifications = [];

    response.data.notifications.map(item => {
      const notificationAge =
        differenceInMinutes(new Date(), parseISO(item.viewedAt));

      if (item.viewedAt === null || notificationAge <= 5) {
        new_notifications.push(item);
      } else {
        if (isToday(parseISO(item.viewedAt))) {
          today_notifications.push(item);
        } else {
          previous_notifications.push(item);
        }
      }

      if (item.viewed === false) {
        count += 1;
      }
    });

    dispatch({
      type: 'setNotification', payload: {
        notification_count: count,
        new_notifications,
        today_notifications,
        previous_notifications,
      }
    });
  }

  useEffect(() => {
    loadNotification();
  }, []);

  const methods = React.useMemo(
    () => ({
      setNotificationCount: data => {
      },
      addSingleNotification: data => {
        dispatch({
          type: 'addOnlyOne', payload: {
            new_notification: data,
          }
        });
      },
      reloadNotifications: async (setLoadingTrue, setLoadingFalse) => {
        setLoadingTrue();
        await loadNotification();
        setLoadingFalse();
      },
      markAllAsViewed: (now_time, newNotifications) => {
        let temp_state = newNotifications;

        temp_state.map(item => {
          if (item.viewed === false) {
            item.viewed = true;
            item.viewedAt = now_time;
          }
        });

        dispatch({
          type: 'MarkAllAsViewed', payload: {
            new_notifications: temp_state,
          }
        });
      }

    }), []);

  return <Provider value={{ state, methods }}>{children}</Provider>;
};

export { notification_store, NotificationStateProvider }