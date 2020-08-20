import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import AppHeader from '../../components/AppHeader/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';

export default function NotificationScreen() {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  async function loadAPI() {

  }

  useEffect(() => {

  }, []);

  const NotificationComponent = () => (
    <View style={styles.notification_container}>
      <View>
        <Icon name="bell-outline" size={20} color="#000" />
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.notification_main_text}>Novo Chamado</Text>
        <Text style={styles.notification_sub_text}>
          Chamado de Erick de Souza Vieira agora está assinalado para Lucas Campos: há 2h
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <AppHeader label="Notificações" altura="21%" />
      <View style={{ backgroundColor: '#337AB7' }}>
        <View style={styles.container}>
          <ScrollView style={{ flex: 1 }}>
            <Text style={styles.main_text}>Mais recentes</Text>
            {data.map((item, index) => (
              <NotificationComponent key={index} />
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
