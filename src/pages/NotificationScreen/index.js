import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, parseISO, isToday } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import AppHeader from '../../components/AppHeader/index';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';
import { notification_store } from '../../store/notification';

export default function NotificationScreen(props) {
  const [refreshing, setRefreshing] = useState(false);

  const GlobalStore = useContext(store);
  const { userToken, server_ip, server_port, employee_id } = GlobalStore.state;

  const NotificationStore = useContext(notification_store);
  const { setNotifications, setAsRead } = NotificationStore.methods;

  const [selectedNotificationID, setSelectedNotificationID] = useState(null);

  const navigation = useNavigation();

  async function fetchNotifications() {
    try {
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

      const temp_new_notifications = [];
      const temp_today_notifications = [];
      const temp_previous_notifications = [];

      let count_unread = 0;
      response.data.notifications.map(item => {
        const notificationAge =
          differenceInMinutes(new Date(), parseISO(item.viewedAt));

        if (item.viewedAt === null || notificationAge <= 5) {
          temp_new_notifications.push(item);
        } else {
          if (isToday(parseISO(item.viewedAt))) {
            temp_today_notifications.push(item);
          } else {
            temp_previous_notifications.push(item);
          }
        }

        if (item.viewed === false) {
          count_unread++;
        }
      });

      setNotifications(
        count_unread,
        temp_new_notifications,
        temp_today_notifications,
        temp_previous_notifications
      );

      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      Alert.alert('Erro', 'Falha ao chamar a API (fetchNotifications at NotificationScreen)');
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function markNotificationsAsRead(notification_id) {
    setAsRead(
      NotificationStore.state.new_notifications,
      NotificationStore.state.today_notifications,
      NotificationStore.state.previous_notifications,
      notification_id
    );

    try {
      await axios.put(
        `http://${server_ip}:${server_port}/notification`,
        {
          action: 'markAsRead',
          notification_id,
        },
        {
          timeout: 2500,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao marcar notificação como lida (notification_screen)');
    }
  }

  useEffect(() => {
    if (props.isFocused && selectedNotificationID !== null) {
      markNotificationsAsRead(selectedNotificationID);
      setSelectedNotificationID(null);
    }

  }, [props.isFocused]);

  async function handleNotificationPress(notification) {
    const { id, nome, tipo, ip, plano } = notification.data.request_data;

    setSelectedNotificationID(notification.data._id);
    navigation.navigate('Details', { id, nome, tipo, ip, plano });
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

  const NotificationComponent = (notification) => {
    return (
      <TouchableOpacity onPress={() => handleNotificationPress(notification)}
        style={notification.data.isRead
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
      </TouchableOpacity>
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
                onRefresh={() => { fetchNotifications() }}
              />
            }
          >
            {NotificationStore.state.new_notifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>Novas</Text>
                <>
                  {NotificationStore.state.new_notifications.map((item, index) => {
                    return (
                      <NotificationComponent key={index} data={item} />
                    );
                  })}
                </>
              </>
            }

            {NotificationStore.state.today_notifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>
                  Hoje
                </Text>
                <>
                  {NotificationStore.state.today_notifications.map((item, index) => {
                    return (
                      <NotificationComponent key={index} data={item} />
                    );
                  })}
                </>
              </>
            }

            {NotificationStore.state.previous_notifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>
                  Anteriores
                </Text>
                <>
                  {NotificationStore.state.previous_notifications.map((item, index) => {
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