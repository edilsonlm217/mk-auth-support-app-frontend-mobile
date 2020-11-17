import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { store } from '../../store/store';

import app_logo from '../../assets/mk-edge-logo.png';

import { icons, fonts } from '../../styles/index';

export default function AuthScreen() {
  const globalState = useContext(store);
  const { signIn, saveTenantKey } = globalState.methods;

  const [key, setKey] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [isVisible, setIsVisible] = useState(false);
  const [restoreKey, setRestoreKey] = useState(true);

  const isFocused = useIsFocused(false);

  const LoginInput = useRef(null);
  const PasswordInput = useRef(null);

  useEffect(() => {
    if (isFocused === true) {
      const { restoreKey } = globalState.state;

      if (restoreKey) {
        const restored_key = globalState.state.tenantID;
        setKey(restored_key);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    setRestoreKey(globalState.state.restoreKey);
  }, [globalState.state.restoreKey]);

  async function savePreferences() {
    // Aqui será chamado um método da store para salvar as preferencias
    // do usuário na Storage e na GlobalStore 

    saveTenantKey(restoreKey);
  }

  async function handleSignIn() {
    if (login !== '' && password !== '' && key !== '') {
      setIsVisible(true);

      const isDone = await signIn({
        login,
        password,
        tenant_id: key,
        // remember_password: rememberPassword,
      });

      if (isDone) {
        savePreferences();
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
              style={{
                fontSize: 16,
                flex: 1,
                fontFamily: "Roboto-Light",
                paddingLeft: 15,
                padding: 0,
                height: '100%',
              }}
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={() => LoginInput.current.focus()}
              placeholder="Chave de acesso"
              value={key}
              autoCorrect={false}
              onChangeText={text => setKey(text)}
              autoCapitalize="none"
              placeholderTextColor='#555555'
            />
          </View>

          <View
            style={{
              marginBottom: 5,
              marginTop: 5,
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-end',
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto-Light",
                fontSize: 12,
                color: '#EAEAEA',
              }}
            >Nunca esquecer</Text>
            <Switch
              value={restoreKey}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={true ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setRestoreKey(!restoreKey)}
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
              style={{
                fontSize: 16,
                flex: 1,
                fontFamily: "Roboto-Light",
                paddingLeft: 15,
                padding: 0,
                height: '100%',
              }}
              blurOnSubmit={false}
              returnKeyType="next"
              ref={LoginInput}
              onSubmitEditing={() => PasswordInput.current.focus()}
              placeholder="Login"
              autoCorrect={false}
              onChangeText={text => setLogin(text)}
              autoCapitalize="none"
              placeholderTextColor='#555555'
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
              style={{
                fontSize: 16,
                flex: 1,
                fontFamily: "Roboto-Light",
                paddingLeft: 15,
                padding: 0,
                height: '100%',
              }}
              ref={PasswordInput}
              onSubmitEditing={() => handleSignIn()}
              secureTextEntry={true}
              autoCorrect={false}
              placeholder="Sua senha secreta"
              onChangeText={text => setPassword(text)}
              autoCapitalize="none"
              placeholderTextColor='#555555'
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
            <TouchableOpacity
              onPress={() => handleSignIn()}
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
            </TouchableOpacity>
          </TouchableOpacity>

          <HideWithKeyboard>
            <TouchableOpacity style={{ flexDirection: 'row', marginTop: 50, }}>
              <Text style={{ color: '#FFF' }}>Sem chave de acesso?</Text>
              <Text style={{ fontFamily: 'Roboto-Bold', color: '#FFF' }}> Registrar.</Text>
            </TouchableOpacity>
          </HideWithKeyboard>

        </View>

        <Modal
          children={
            <View
              style={{
                width: 300,
                backgroundColor: "#FFF",
                alignSelf: "center",
                borderWidth: 0,
                borderRadius: 5,
                padding: 20,
                paddingTop: 10,
              }}>
              <ActivityIndicator size="small" color="#0000ff" />
              <Text
                style={{
                  fontSize: fonts.regular,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Carregando...
            </Text>
            </View>
          }
          isVisible={isVisible}
          style={{ margin: 0 }}
          animationInTiming={500}
          animationOutTiming={500}
          useNativeDriver={true}
        />
      </LinearGradient>
    </View>
  );
}