import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Dimensions, 
  Image, 
  TextInput,
  Alert, 
  TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import gear from '../../assets/gear.png';

import styles from './styles';

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
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    }  
     
    return (false)  
  }

  return (
    <LinearGradient
      colors={['#002f58', '#337ab7']}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <Image source={gear} style={styles.logo_style} />

        <Text style={styles.main_text} >Configuração inicial</Text>

        <HideWithKeyboard>
          <Text style={styles.sub_text} >
            Para conectar com seu servidor MK-AUTH informe o endereço IP externo e porta para conexão
          </Text>
        </HideWithKeyboard>
        
        <View style={{width: '100%'}}>
          
          <View style={styles.input_container}>
            <View style={{width: '10%', alignItems: 'center'}}>
              <Icon name="laptop" size={28} color="#002f58" />
            </View>
            <TextInput
              keyboardType="number-pad"
              placeholder="Endereço IP do servidor" 
              style={styles.text_input_style}
              onChangeText={ip => setServerIP(ip)}
            />
          </View>

          <View style={[styles.input_container, {marginTop: 25}]}>
            <View style={{width: '10%', alignItems: 'center'}}>
              <Icon name="transit-connection-variant" size={28} color="#002f58" />
            </View>
            <TextInput
              keyboardType="number-pad" 
              placeholder="Porta de conexão" 
              style={styles.text_input_style}
              onChangeText={port => setPort(port)}
            />
          </View>
        </View>
        <HideWithKeyboard>
          <Text style={[styles.sub_text, {marginTop: 40}]}>1/2</Text>
        </HideWithKeyboard>
      </View>

      <TouchableOpacity onPress={handleNextPage} style={styles.next_btn_style}>
        <Text style={styles.navigators_text_style}>Próximo</Text>
        <Icon name="chevron-right" size={30} color="#FFF" />
      </TouchableOpacity>

    </LinearGradient>
  );
}
