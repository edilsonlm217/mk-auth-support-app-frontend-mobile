import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Dialog from "react-native-dialog";
import api from '../../services/api';

import { store } from '../../store/store';
import AppHeader from '../../components/AppHeader/index';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonicIcon from 'react-native-vector-icons/Ionicons';

import styles from './styles';

export default function SettingsScreen({ navigation }) {
  const [isIPDialogVisible, setIsIPDialogVisible] = useState(false);
  const [serverIP, setServerIP] = useState(null);

  const [isPortDialogVisible, setIsPortDialogVisible] = useState(false);
  const [serverPort, setServerPort] = useState(null);

  // Estado para guardar o novo IP informado pelo usuário
  const [tempIP, setTempIP] = useState(null);

  // Estado para guardar a nova PORTA informado pelo usuário
  const [tempPort, setTempPort] = useState(null);

  const [isConfirmLogoutVisible, setIsConfirmLogoutVisible] = useState(false);

  const globalState = useContext(store);
  const { signOut, changeConfig } = globalState.methods;

  const [loggedUser, setLoggedUser] = useState({});

  async function loadAPI() {
    try {
      const response = await api.get(`employee/${globalState.state.employee_id}?tenant_id=${globalState.state.tenantID}`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      setLoggedUser(response.data);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  useEffect(() => {
    loadAPI();
  }, []);

  function handleSaving() {
    ToastAndroid.show("Alteração salva com sucesso!", ToastAndroid.SHORT);

    changeConfig({
      serverIP: serverIP === null ? globalState.state.server_ip : serverIP,
      serverPort: serverPort === null ? globalState.state.server_port : serverPort,
    });

    navigation.goBack();

  }

  function handleIPCancelBtn() {
    setIsIPDialogVisible(false);
    setTempIP(null);
  }

  function handlePortCancelBtn() {
    setIsPortDialogVisible(false);
    setTempPort(null);
  }

  function SaveButton() {
    if ((serverPort !== null && serverPort !== globalState.state.server_port) || (serverIP !== null && serverIP !== globalState.state.server_ip)) {
      return (
        <TouchableOpacity
          onPress={handleSaving}
          style={styles.close_request_btn}
        >
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
      Alert.alert('Erro', 'Falha ao deslogar. Tente novamente!');
    }
  }

  function ValidateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
      return (true)
    }

    return (false)
  }

  function confirmIPChange() {
    if (ValidateIPaddress(tempIP)) {
      setIsIPDialogVisible(false);
      setServerIP(tempIP);
    } else {
      Alert.alert('IP inválido', 'Este não é um endereço IP válido');
    }
  }

  function confirmPortChange() {
    setIsPortDialogVisible(false);
    setServerPort(tempPort);
  }

  return (
    <>
      <AppHeader navigation={navigation} label="Ajustes" altura="21%" />
      <View style={{ backgroundColor: '#337AB7' }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => setIsIPDialogVisible(true)}>
            <View style={styles.line_container}>
              <Text style={styles.sub_text}>Endereço IP</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.main_text}>
                  {serverPort === null ? globalState.state.server_port : serverPort}
                </Text>
                <Icon name="chevron-right" size={25} color="#000" />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsConfirmLogoutVisible(true)}>
            <View style={styles.line_container}>
              <Text style={styles.sub_text}>Usuário logado</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.main_text}>{loggedUser.nome}</Text>
                <IonicIcon name="exit-outline" size={25} color="red" />
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
            <Dialog.Input
              keyboardType="number-pad"
              onChangeText={ip => { setTempIP(ip) }}
              label='IP'
              wrapperStyle={{ borderBottomWidth: StyleSheet.hairlineWidth }}
            />
            <Dialog.Button onPress={handleIPCancelBtn} label="Cancelar" />
            <Dialog.Button onPress={() => confirmIPChange()} label="Confirmar" />
          </Dialog.Container>
        </View>

        <View>
          <Dialog.Container visible={isPortDialogVisible}>
            <Dialog.Title>Porta do Servidor</Dialog.Title>
            <Dialog.Description>
              Por favor informe a porta de acesso do IP informado
          </Dialog.Description>
            <Dialog.Input
              keyboardType="number-pad"
              onChangeText={port => { setTempPort(port) }}
              label='Porta'
              wrapperStyle={{ borderBottomWidth: StyleSheet.hairlineWidth }}
            />
            <Dialog.Button onPress={handlePortCancelBtn} label="Cancelar" />
            <Dialog.Button onPress={() => confirmPortChange()} label="Confirmar" />
          </Dialog.Container>
        </View>

        <View>
          <Dialog.Container visible={isConfirmLogoutVisible}>
            <Dialog.Title>Sair do sistema</Dialog.Title>
            <Dialog.Description>
              Você realmente deseja deslogar do sistema?
            </Dialog.Description>
            <Dialog.Button onPress={() => setIsConfirmLogoutVisible(false)} label="Cancelar" />
            <Dialog.Button onPress={() => handleLogout()} label="Deslogar" />
          </Dialog.Container>
        </View>
      </View>
    </>
  );
}
