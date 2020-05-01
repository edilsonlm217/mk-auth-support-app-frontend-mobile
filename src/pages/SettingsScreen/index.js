import React, { useContext, useState }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Dialog from "react-native-dialog";

import { store } from '../../store/store';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SettingsScreen({ navigation }) {
  const [isIPDialogVisible, setIsIPDialogVisible] = useState(false);
  const [serverIP, setServerIP] = useState(null);

  const [isPortDialogVisible, setIsPortDialogVisible] = useState(false);
  const [serverPort, setServerPort] = useState(null);

  const globalState = useContext(store);
  const { signOut } = globalState.methods;

  function handleSaving() {
    ToastAndroid.show("Alteração salva com sucesso!", ToastAndroid.SHORT);

    dispatch({ type: 'changeServerConfig', payload: {
      server_ip: serverIP !== null ? serverIP : globalState.state.server_ip,
      server_port: serverPort !== null ? serverPort : globalState.state.server_port,
    }});

    navigation.goBack();
    
  }

  function handleIPCancelBtn() {
    setIsIPDialogVisible(false);
    setServerIP(null);
  }

  function handlePortCancelBtn() {
    setIsPortDialogVisible(false);
    setServerPort(null);
  }

  function SaveButton() {
    if ((serverPort !== null && serverPort !== globalState.state.server_port) || (serverIP !== null && serverIP !== globalState.state.server_ip)) {
    
      return (
        <TouchableOpacity onPress={handleSaving} style={styles.close_request_btn}>
          <Text style={styles.btn_label}>Salvar Alterações</Text>
        </TouchableOpacity>
      );
    }
    
    return (
      <>
      </>
    );
  }

  async function handleLogout() {
    try {
      const keys = ['@auth_token', '@employee_id', '@server_ip', '@server_port'];
      await AsyncStorage.multiRemove(keys);
      
      signOut();
    } catch {
      Alert.alert('Falha ao deslogar. Tente novamente!');
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setIsIPDialogVisible(true)}>
          <View style={styles.line_container}>
            <Text style={styles.sub_text}>Endereço IP</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.main_text}>
                {serverIP === null ? globalState.state.server_ip : serverIP}
              </Text>
              <Icon name="chevron-right" size={25} color="#000" />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsPortDialogVisible(true)}>
          <View style={styles.line_container}>
            <Text style={styles.sub_text}>Porta</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.main_text}>{serverPort === null ? globalState.state.server_port : serverPort}</Text>
              <Icon name="chevron-right" size={25} color="#000" />
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleLogout}>
          <View style={styles.line_container}>
            <Text style={styles.sub_text}></Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.main_text}>Sair do Sistema</Text>
              <Icon name="chevron-right" size={25} color="#000" />
            </View>
          </View>
        </TouchableOpacity>

        <SaveButton />

      </View>

      <View>
        <Dialog.Container visible={isIPDialogVisible}>
          <Dialog.Title>Endereço IP</Dialog.Title>
          <Dialog.Description>
            Por favor informe o endereço IP de seu servidor
          </Dialog.Description>
          <Dialog.Input onChangeText={ip => {setServerIP(ip)}} label='IP' wrapperStyle={{borderBottomWidth: StyleSheet.hairlineWidth}}/>
          <Dialog.Button onPress={handleIPCancelBtn} label="Cancelar" />
          <Dialog.Button onPress={() => setIsIPDialogVisible(false)} label="Confirmar" />
        </Dialog.Container>
      </View>

      <View>
        <Dialog.Container visible={isPortDialogVisible}>
          <Dialog.Title>Porta do Servidor</Dialog.Title>
          <Dialog.Description>
            Por favor informe a porta de acesso do IP informado
          </Dialog.Description>
          <Dialog.Input onChangeText={port => {setServerPort(port)}} label='Porta' wrapperStyle={{borderBottomWidth: StyleSheet.hairlineWidth}}/>
          <Dialog.Button onPress={handlePortCancelBtn} label="Cancelar" />
          <Dialog.Button onPress={() => setIsPortDialogVisible(false)} label="Confirmar" />
        </Dialog.Container>
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
    backgroundColor: '#337AB7',
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
