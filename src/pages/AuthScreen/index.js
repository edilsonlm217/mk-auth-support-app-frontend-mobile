import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert, ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Modal from 'react-native-modal';

import { store } from '../../store/store';

import app_logo from '../../assets/mk-edge-logo.png';

import { icons } from '../../styles/index';

export default function AuthScreen({ route }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const globalState = useContext(store);
  const { signIn } = globalState.methods;

  // Estado que controla a visibilidade do modal de confirmação da alteração de CTO
  const [isVisible, setIsVisible] = useState(false);

  async function handleSignIn() {
    if (login !== '' && password !== '') {
      setIsVisible(true);

      const isDone = await signIn({
        login,
        password,
        server_ip: route.params.server_ip,
        server_port: route.params.server_port,
      });

      if (isDone) {
        setIsVisible(false);
      }
    } else {
      Alert.alert('Erro', 'Por favor informe todos os campos');
    }

  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#002F58', '#001C34']}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          padding: 20,
        }}
        >
          <Image
            source={app_logo}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 3,
              borderColor: '#D5D5D5',
              marginBottom: 45,
              marginTop: 10,
            }}
          />

          <View style={{
            backgroundColor: '#EAEAEA',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 5,
            paddingLeft: 10,
            height: 45,
          }}
          >
            <Icon name="key" size={icons.tiny} color="#555555" />
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Chave de acesso"
              placeholderTextColor='#555555'
              style={{
                fontSize: 16,
                flex: 1,
                fontFamily: "Roboto-Light",
                paddingLeft: 15,
                padding: 0,
                height: '100%',
              }}
            />
          </View>

          <View style={{
            marginBottom: 5,
            marginTop: 5,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
          }}>
            <Text
              style={{
                fontFamily: "Roboto-Light",
                fontSize: 12,
                color: '#EAEAEA',
              }}
            >Nunca esquecer</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={true ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              value={true}
              style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
            />
          </View>

          <View style={{
            backgroundColor: '#EAEAEA',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 5,
            paddingLeft: 10,
            height: 45,
          }}
          >
            <Icon name="account" size={icons.tiny} color="#555555" />
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Login"
              placeholderTextColor='#555555'
              style={{
                fontSize: 16,
                flex: 1,
                fontFamily: "Roboto-Light",
                paddingLeft: 15,
                padding: 0,
                height: '100%',
              }}
            />
          </View>

          <View style={{
            backgroundColor: '#EAEAEA',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 5,
            paddingLeft: 10,
            height: 45,
            marginTop: 10,
          }}
          >
            <Icon name="lock" size={icons.tiny} color="#555555" />
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Sua senha secreta"
              placeholderTextColor='#555555'
              style={{
                fontSize: 16,
                flex: 1,
                fontFamily: "Roboto-Light",
                paddingLeft: 15,
                padding: 0,
                height: '100%',
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#4B60C7',
              borderRadius: 5,
              height: 45,
              marginTop: 80,
              width: '100%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 10,
                  fontFamily: "Roboto-Medium",
                  color: '#FFFFFF',
                  padding: 0,
                }}
              >Autenticar</Text>
              <Icon name="login" size={icons.tiny} color="#FFF" style={{ marginLeft: 10 }} />
            </View>
          </TouchableOpacity>

          <HideWithKeyboard>
            <TouchableOpacity style={{ flexDirection: 'row', marginTop: 50, }}>
              <Text style={{ color: '#FFF' }}>Sem chave de acesso?</Text>
              <Text style={{ fontFamily: 'Roboto-Bold', color: '#FFF' }}> Registrar.</Text>
            </TouchableOpacity>
          </HideWithKeyboard>

        </View>
      </LinearGradient>
    </View>
  );
}