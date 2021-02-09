import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import gear from '../../assets/gear.png';

import styles from './styles';
import { icons } from '../../styles/index';

export default function InitialConfig({ navigation }) {
  const [serverIP, setServerIP] = useState('');
  const [port, setPort] = useState('');

  async function handleNextPage() {
    if (serverIP !== '' && port !== '') {
      const isValidIP = ValidateIPaddress(serverIP);

      if (isValidIP) {
        navigation.navigate('AuthScreen', {
          server_ip: serverIP,
          server_port: port,
        });
      } else {
        Alert.alert('Erro', 'Este endereço IP não é válido');
      }
    } else {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
    }
  }

  function ValidateIPaddress(ipaddress) {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipaddress,
      )
    ) {
      return true;
    }

    return false;
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#002f58', '#337ab7']}
        style={styles.initial_config_linearGradient}>
        <View style={styles.initial_config_container}>
          <Image source={gear} style={styles.initial_config_logo_style} />

          <Text style={styles.initial_config_main_title}>
            Configuração inicial
          </Text>

          <HideWithKeyboard>
            <Text style={styles.initial_config_sub_title}>
              Para conectar com seu servidor MK-AUTH informe o endereço IP
              externo e porta para conexão
            </Text>
          </HideWithKeyboard>

          <View style={[styles.initial_config_input_container]}>
            <View style={styles.initial_config_icon_container}>
              <Icon name="laptop" size={icons.small} color="#002f58" />
            </View>
            <TextInput
              keyboardType="number-pad"
              placeholder="Endereço IP do servidor"
              style={styles.initial_config_text_input_style}
              onChangeText={ip => setServerIP(ip)}
            />
          </View>

          <View style={[styles.initial_config_input_container]}>
            <View style={styles.initial_config_icon_container}>
              <Icon
                name="transit-connection-variant"
                size={icons.small}
                color="#002f58"
              />
            </View>
            <TextInput
              keyboardType="number-pad"
              placeholder="Porta de conexão"
              style={styles.initial_config_text_input_style}
              onChangeText={port => setPort(port)}
            />
          </View>
        </View>
      </LinearGradient>
      <TouchableOpacity
        onPress={handleNextPage}
        style={styles.initial_config_next_btn_style}>
        <HideWithKeyboard style={{ flexDirection: 'row' }}>
          <Text style={styles.initial_config_navigators_text_style}>
            Próximo
          </Text>
          <Icon name="chevron-right" size={icons.small} color="#FFF" />
        </HideWithKeyboard>
      </TouchableOpacity>
    </View>
  );
}
