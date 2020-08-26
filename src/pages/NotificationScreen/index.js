import React, { useEffect, useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, parseISO, isToday } from 'date-fns';
import { useIsFocused } from '@react-navigation/native';
import socketio from 'socket.io-client';
import axios from 'axios';

import AppHeader from '../../components/AppHeader/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';
import { notification_store } from '../../store/notification';

export default function NotificationScreen() {
  const GlobalStore = useContext(store);
  const NotificationStore = useContext(notification_store);

  const { setNotifications, setAllAsViewed } = NotificationStore.methods;

  const {
    new_notifications,
    today_notifications,
    previous_notifications
  } = NotificationStore.state;

  const { userToken, server_ip, server_port, employee_id } = GlobalStore.state;

  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused(false);

  let socket = null;
  socket = useMemo(() =>
    socketio(`http://${server_ip}:${server_port}`, {
      query: {
        employee_id,
      }
    }), [employee_id]);

  useEffect(() => {
    console.log('socket inicializado');
    socket.on('notification', notification => {
      console.warn(notification);
      const new_notifications_updated = [notification, ...new_notifications];

      let count_unread = 0;
      new_notifications_updated.map(item => {
        if (item.viewed === false) {
          count_unread++;
        }
      });

      setNotifications(
        count_unread,
        new_notifications_updated,
        today_notifications,
        previous_notifications
      );
    });
  }, [socket, new_notifications]);

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

    setNotifications(
      count_unread,
      new_notifications,
      today_notifications,
      previous_notifications
    );

    setRefreshing(false);
  }

  useEffect(() => {
    async function markAsViewedRoutine() {
      if (isFocused) {
        await markNotificationsAsRead();
        setAllAsViewed(
          new_notifications,
          today_notifications,
          previous_notifications
        );
      }
    }

    markAsViewedRoutine();
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

  const NotificationAge = (date) => {
    const parsedDate = parseISO(date);

    let duration = 0;
    duration = `${differenceInDays(new Date(), parsedDate)}d`;

    if (duration === '0d') {
      duration = `${differenceInHours(new Date(), parsedDate)}h`;
    }

    if (duration === '0h') {
      duration = `${differenceInMinutes(new Date(), parsedDate)}m`;
    }

    if (duration === '0m') {
      duration = `${differenceInSeconds(new Date(), parsedDate)}s`;
    }

    return duration;
  };

  async function onRefresh() {
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
            {`${notification.data.content}: há ${NotificationAge(notification.data.createdAt)}`}
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
            {new_notifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>Novas</Text>
                <>
                  {new_notifications.map((item, index) => {
                    return (
                      <NotificationComponent key={index} data={item} />
                    );
                  })}
                </>
              </>
            }

            {today_notifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>
                  Hoje
                </Text>
                <>
                  {today_notifications.map((item, index) => {
                    return (
                      <NotificationComponent key={index} data={item} />
                    );
                  })}
                </>
              </>
            }

            {previous_notifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>
                  Anteriores
                </Text>
                <>
                  {previous_notifications.map((item, index) => {
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
