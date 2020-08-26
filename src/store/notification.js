import React, { createContext, useReducer, useContext, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { differenceInMinutes, parseISO, isToday } from 'date-fns';
import axios from 'axios';

const initialState = {
  notification_count: 0,
  new_notifications: [],
  today_notifications: [],
  previous_notifications: [],
  isLoading: false,
};

const notification_store = createContext(initialState);
const { Provider } = notification_store;

const NotificationStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((prevState, action) => {
    switch (action.type) {
      case 'setNotifications':
        return {
          notification_count: action.payload.notification_count,
          new_notifications: action.payload.new_notifications,
          today_notifications: action.payload.today_notifications,
          previous_notifications: action.payload.previous_notifications,
        }

      case 'setAllAsViewed':
        return {
          notification_count: action.payload.notification_count,
          new_notifications: action.payload.new_notifications,
          today_notifications: action.payload.today_notifications,
          previous_notifications: action.payload.previous_notifications,
        }

      case 'setAllAsRead':
        return {
          ...prevState,
          new_notifications: action.payload.new_notifications,
          today_notifications: action.payload.today_notifications,
          previous_notifications: action.payload.previous_notifications,
        }

      default:
        throw new Error();
    };
  }, initialState);

  async function fetchNotifications() {
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

    const new_notifications = [];
    const today_notifications = [];
    const previous_notifications = [];

    let count_unread = 0;
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
        count_unread++;
      }
    });

    dispatch({
      type: 'setNotifications', payload: {
        notification_count: count_unread,
        new_notifications,
        today_notifications,
        previous_notifications
      }
    });
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  const methods = React.useMemo(
    () => ({
      setNotifications: (
        notification_count,
        new_notifications,
        today_notifications,
        previous_notifications
      ) => {
        dispatch({
          type: 'setNotifications', payload: {
            notification_count,
            new_notifications,
            today_notifications,
            previous_notifications
          }
        });
      },
      setAllAsViewed: (
        new_notifications,
        today_notifications,
        previous_notifications
      ) => {
        const new_notifications_updated = [];

        new_notifications.map(item => {
          item.viewed = true;
          new_notifications_updated.push(item);
        });

        let count_unread = 0;
        new_notifications_updated.map(item => {
          if (item.viewed === false) {
            count_unread++;
          }
        });

        dispatch({
          type: 'setAllAsViewed', payload: {
            notification_count: count_unread,
            new_notifications,
            today_notifications,
            previous_notifications,
          }
        });
      },
      setAsRead: (
        new_notifications,
        today_notifications,
        previous_notifications,
        notification_id
      ) => {
        console.log('dá store');
        console.log(notification_id);
        const new_notifications_updated = [];
        const today_notifications_updated = [];
        const previous_notifications_updated = [];

        new_notifications.map(item => {
          if (item._id === notification_id) {
            item.isRead = true;

            new_notifications_updated.push(item);
          }
        });

        today_notifications.map(item => {
          if (item._id === notification_id) {
            item.isRead = true;

            today_notifications_updated.push(item);
          }
        });

        previous_notifications.map(item => {
          if (item._id === notification_id) {
            item.isRead = true;

            previous_notifications_updated.push(item);
          }
        });

        dispatch({
          type: 'setAllAsRead', payload: {
            new_notifications,
            today_notifications,
            previous_notifications,
          }
        });

      }
    }), []);

  return <Provider value={{ state, methods }}>{children}</Provider>;
};

export { notification_store, NotificationStateProvider }