import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

import { store } from '../../store/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../components/AppHeader/index';

export default function ClientsScreen({ navigation }) {
  const globalState = useContext(store);

  const [data, setData] = useState([]);

  async function loadAPI() {
    try {
      const response = await axios.get(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/clients`,
        {
          timeout: 4000,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      setData(response.data);

    } catch (error) {
      Alert.alert('Erro', 'Erro ao chamar a API');
    }
  }

  useEffect(() => {
    loadAPI();
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} label="Clientes" altura="21%" iconFor="search" />
      <View style={styles.screen_container}>
        <ScrollView>
          {data.map(item => (
            <>
              <Text key={item.group} style={styles.group_label} >{item.group}</Text>
              <View style={styles.card_style}>
                <View>
                  {item.children.map(client => (
                    <TouchableOpacity key={client.id} style={styles.client_btn}>
                      <Text numberOfLines={1} style={styles.client_name}>{client.nome}</Text>
                      <Icon name="chevron-right" size={20} color="#000" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#337AB7',
  },

  screen_container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: '#FFF',
  },

  card_style: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,

    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 10,
  },

  group_label: {
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 5
  },

  client_btn: {
    borderBottomWidth: 0.5,
    borderColor: '#bdbdbd',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    padding: 10,
    paddingLeft: 5,
    paddingRight: 0,
  },

  client_name: {
    fontSize: 14,
    width: '90%',
  },
});