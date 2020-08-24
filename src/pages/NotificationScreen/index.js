import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';
import { notification_store } from '../../store/notification';

export default function NotificationScreen() {
  const NotificationState = useContext(notification_store);
  const GlobalState = useContext(store);

  const [newNotifications, setNewNotifications] = useState(
    NotificationState.state.new_notifications
  );

  const [todayNotifications, setTodayNotifications] = useState(
    NotificationState.state.today_notifications
  );

  const [previousNotifications, setPreviousNotifications] = useState(
    NotificationState.state.previous_notifications
  );

  const { markAllAsViewed, reloadNotifications } = NotificationState.methods;

  const { server_ip, server_port, userToken } = GlobalState.state;

  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused(false);

  async function markAsViewed() {
    const now_time = new Date();
    await axios.put(
      `http://${server_ip}:${server_port}/notification`,
      {
        viewedAt: now_time,
      },
      {
        timeout: 2500,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    markAllAsViewed(now_time);
  }

  useEffect(() => {
    if (isFocused) {
      markAsViewed();
    }
  }, [isFocused]);

  useEffect(() => {
    setNewNotifications(NotificationState.state.new_notifications);
    setTodayNotifications(NotificationState.state.today_notifications);
    setPreviousNotifications(NotificationState.state.previous_notifications);
  }, [NotificationState.state]);

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
                onRefresh={
                  () => reloadNotifications(
                    () => { setRefreshing(true) },
                    () => { setRefreshing(false) }
                  )
                }
              />
            }
          >
            {newNotifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>Novas</Text>
                <>
                  {newNotifications.map((item, index) => {
                    return (
                      <NotificationComponent key={index} data={item} />
                    );
                  })}
                </>
              </>
            }

            {todayNotifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>
                  Hoje
                </Text>
                <>
                  {todayNotifications.map((item, index) => {
                    return (
                      <NotificationComponent key={index} data={item} />
                    );
                  })}
                </>
              </>
            }

            {previousNotifications.length !== 0 &&
              <>
                <Text style={[styles.main_text, { marginTop: 10 }]}>
                  Anteriores
                </Text>
                <>
                  {previousNotifications.map((item, index) => {
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
