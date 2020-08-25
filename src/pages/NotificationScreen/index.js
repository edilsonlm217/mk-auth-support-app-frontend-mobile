import React, { useEffect, useContext, useState, useReducer } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { differenceInMinutes, parseISO, isToday } from 'date-fns';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

import AppHeader from '../../components/AppHeader/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';

const initialState = {
  new_notifications: [],
  today_notifications: [],
  previous_notifications: [],
};

export default function NotificationScreen() {
  const GlobalStore = useContext(store);
  const { userToken, server_ip, server_port, employee_id } = GlobalStore.state;

  const [refreshing, setRefreshing] = useState(false);

  const [state, dispatch] = useReducer((prevState, action) => {
    switch (action.type) {
      case 'setNotification':
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

  const isFocused = useIsFocused(false);

  async function fetchNotifications() {
    setRefreshing(true);
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
    });

    dispatch({
      type: 'setNotification', payload: {
        new_notifications,
        today_notifications,
        previous_notifications,
      }
    });

    setRefreshing(false);
  }

  useEffect(() => {
    if (isFocused) {
      fetchNotifications();
    } else {
      markNotificationsAsRead();
    }
  }, [isFocused]);

  async function markNotificationsAsRead() {
    const response = await axios.put(
      `http://${server_ip}:${server_port}/notification`,
      {
        viewedAt: new Date(),
        employee_id: employee_id,
      },
      {
        timeout: 2500,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
  }

  async function onRefresh() {
    await markNotificationsAsRead();
    fetchNotifications();
  }

  const NotificationComponent = (notification) => {
    return (
      <View
        style={notification.data.read
          ? styles.notification_container_read
          : styles.notification_container_unread
        }
      >
        <View>
          <Icon name="bell-outline" size={20} color="#000" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.notification_main_text}>
            {notification.data.header}
          </Text>
          <Text style={styles.notification_sub_text}>
            {notification.data.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <AppHeader label="Notificações" altura="21%" />
      <View style={{ backgroundColor: '#337AB7' }}>
        <View style={styles.container}>
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => { onRefresh() }}
              />
            }
          >
            {state.new_notifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>Novas</Text>
                <>
                  {state.new_notifications.map((item, index) => {
                    return (
                      <NotificationComponent key={index} data={item} />
                    );
                  })}
                </>
              </>
            }

            {state.today_notifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>
                  Hoje
                </Text>
                <>
                  {state.today_notifications.map((item, index) => {
                    return (
                      <NotificationComponent key={index} data={item} />
                    );
                  })}
                </>
              </>
            }

            {state.previous_notifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>
                  Anteriores
                </Text>
                <>
                  {state.previous_notifications.map((item, index) => {
                    return (
                      <NotificationComponent key={index} data={item} />
                    );
                  })}
                </>
              </>
            }
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: '100%',
    height: '100%',
    padding: 20,
    paddingLeft: 0,
    paddingRight: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  main_text: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
    marginBottom: 10,
    marginLeft: 20,
  },

  notification_container_read: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#D9D9D9',
  },

  notification_container_unread: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#D9D9D9',
    backgroundColor: '#F0F0F0',
  },

  notification_main_text: {
    fontSize: fonts.medium,
    fontFamily: 'Roboto-Bold',
  },

  notification_sub_text: {
    fontFamily: 'Roboto-Light',
    fontSize: 12
  },
});
