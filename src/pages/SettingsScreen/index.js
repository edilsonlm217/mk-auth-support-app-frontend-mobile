import React, { useContext }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { store } from '../../store/store';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SettingsScreen() {
  const globalState = useContext(store);
  const { dispatch } = globalState;

  async function handleLogout() {
    try {
      const keys = ['@auth_token', '@employee_id', '@server_ip', '@server_port']
      await AsyncStorage.multiRemove(keys);
      dispatch({ type: 'logout' });
    } catch {
      Alert.alert('Falha ao deslogar. Tente novamente!')
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <View style={styles.line_container}>
          <Text style={styles.sub_text}>Endereço IP</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.main_text}>
              {globalState.state.server_ip}
            </Text>
            <Icon name="chevron-right" size={25} color="#000" />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.line_container}>
          <Text style={styles.sub_text}>Porta</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.main_text}>{globalState.state.server_port}</Text>
            <Icon name="chevron-right" size={25} color="#000" />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.close_request_btn}>
          <Text style={styles.btn_label}>Sair Do Sistema</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: '100%',
    height: '100%',
    padding: 20,
    paddingTop: 80,
  },
  header_container: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  
  main_text: { 
    fontWeight: "bold",
    fontSize: 20,
    maxWidth: '95%', 
  },
  
  sub_text: { 
    fontSize: 16,
    color: '#989898',
  },

  line_container_location: {
    flexDirection: 'row',
  },
  
  location_line: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: "space-between"
  },

  line_container: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btns_contaier: {
    flexDirection: "row",
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: '#FFF'
  },
  secondary_btn: {
    backgroundColor: '#FFF',
    width: 160,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 6,
  },
  
  secondary_btn_text: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#337AB7',
  },
  
  main_btn: {
    backgroundColor: '#337AB7',
    width: 160,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 6,
  },

  main_btn_text: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#FFF',
  },

  close_request_btn: {
    width: 230,
    height: 60,
    backgroundColor: '#db2007',
    alignSelf: 'center',
    position: "absolute",
    bottom: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btn_label: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
