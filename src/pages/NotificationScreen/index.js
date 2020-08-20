import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

import AppHeader from '../../components/AppHeader/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';

export default function NotificationScreen() {
  const globalState = useContext(store);

  const { server_ip, server_port, employee_id, userToken } = globalState.state;

  const [notifications, setNotifications] = useState([]);

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

    setNotifications(response.data.notificatios);
  }

  useEffect(() => {
    loadAPI();
  }, []);

  const NotificationComponent = (notification) => {
    return (
      <View style={styles.notification_container}>
        <View>
          <Icon name="bell-outline" size={20} color="#000" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.notification_main_text}>Novo Chamado</Text>
          <Text style={styles.notification_sub_text}>
            {notification.data.content}
          </Text>
        </View>
      </View>);
  };

  return (
    <>
      <AppHeader label="Notificações" altura="21%" />
      <View style={{ backgroundColor: '#337AB7' }}>
        <View style={styles.container}>
          <ScrollView style={{ flex: 1 }}>
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

  notification_container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#D9D9D9'
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
