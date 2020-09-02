import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { differenceInMinutes, parseISO, isToday } from 'date-fns';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import { store } from '../store/store';

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
  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action) {
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
          notification_count: 0,
          new_notifications: state.new_notifications,
          today_notifications: state.today_notifications,
          previous_notifications: state.previous_notifications,
        }

      case 'setAllAsRead':
        return {
          ...state,
          new_notifications: action.payload.new_notifications,
          today_notifications: action.payload.today_notifications,
          previous_notifications: action.payload.previous_notifications,
        }

      default:
        throw new Error();
    };
  }

  const GlobalStore = useContext(store);

  async function markAsViewed() {
    dispatch({
      type: 'setAllAsViewed'
    });

    try {
      const userToken = await AsyncStorage.getItem('@auth_token');
      const server_ip = await AsyncStorage.getItem('@server_ip');
      const server_port = await AsyncStorage.getItem('@server_port');
      const employee_id = await AsyncStorage.getItem('@employee_id');

      await axios.put(
        `http://${server_ip}:${server_port}/notification`,
        {
          action: 'markAsViewed',
          viewed_at: new Date(),
          employee_id: employee_id,
        },
        {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao marcar notificações como lidas');
      console.warn(error);
    }
  }

  async function fetchNotifications() {
    try {
      const userToken = await AsyncStorage.getItem('@auth_token');
      const server_ip = await AsyncStorage.getItem('@server_ip');
      const server_port = await AsyncStorage.getItem('@server_port');
      const employee_id = await AsyncStorage.getItem('@employee_id');

      if (employee_id) {
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
            differenceInMinutes(new Date(), parseISO(item.viewed_at));

          if (item.viewed_at === null || notificationAge <= 5) {
            new_notifications.push(item);
          } else {
            if (isToday(parseISO(item.viewed_at))) {
              today_notifications.push(item);
            } else {
              previous_notifications.push(item);
            }
          }

          if (item.is_viewed === false) {
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
    } catch (error) {
      Alert.alert('Erro', 'Falha ao chamadar a API (notification_store)');
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, [GlobalStore.state.employee_id]);

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
      addNewNotification: () => {
        fetchNotifications();
      },
      setAllAsViewed: () => {
        markAsViewed();
      },
      setAsRead: (
        new_notifications,
        today_notifications,
        previous_notifications,
        notification_id
      ) => {
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