import React, { useEffect, useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import socketio from 'socket.io-client';
import { useIsFocused } from '@react-navigation/native';


import AppHeader from '../../components/AppHeader/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';

export default function NotificationScreen() {
  const globalState = useContext(store);

  const { server_ip, server_port, employee_id, userToken } = globalState.state;

  const [notifications, setNotifications] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused(false);

  const { setNotificationCount } = globalState.methods;

  async function loadAPI() {
    const response = await axios.get(
      `http://${server_ip}:${server_port}/notification/${employee_id}`,
      {
        timeout: 2500,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    let count = 0;
    response.data.notificatios.map(notification => {
      if (!notification.read) {
        count += 1;
      }
    });

    setNotificationCount(count);
    setNotifications(response.data.notificatios);
  }

  useEffect(() => {
    loadAPI();
  }, []);

  const socket = useMemo(() =>
    socketio(`http://${server_ip}:${server_port}`, {
      query: {
        employee_id,
      }
    }), [employee_id]);

  useEffect(() => {
    socket.on('notification', notification => {
      const newState = [notification, ...notifications]
      setNotifications(newState);
      setNotificationCount(newState.length);
    });
  }, [socket, notifications]);

  useEffect(() => {
    async function markAsRead() {
      const mark_as_read = [];
      
      notifications.map(item => {
        if (item.read === false) {
          mark_as_read.push({ id: item._id });
        }
      });

      const response = await axios.put(
        `http://${server_ip}:${server_port}/notification`,
        {
          mark_as_read,
        },
        {
          timeout: 2500,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
    }

    if (isFocused) {
      markAsRead();
    }
  }, [isFocused]);

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
          <Text style={styles.notification_main_text}>{notification.data.header}</Text>
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
              <RefreshControl refreshing={refreshing} onRefresh={() => loadAPI()} />
            }
          >
            <Text style={styles.main_text}>Mais recentes</Text>
            {notifications.map((item, index) => (
              <NotificationComponent key={index} data={item} />
            ))}
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
