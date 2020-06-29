import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert, ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Modal from 'react-native-modal';

import { store } from '../../store/store';

import lock from '../../assets/unlocked.png';

import styles from './styles';
import { icons } from '../../styles/index';

export default function AuthScreen({ route, navigation }) {
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

  function handlePrevScreen() {
    navigation.goBack();
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#002f58', '#337ab7']}
        style={styles.initial_config_linearGradient}
      >
        <View style={styles.initial_config_container}>
          <Image source={lock} style={styles.initial_config_logo_style} />

          <Text style={styles.initial_config_main_title} >Quase lá</Text>

          <HideWithKeyboard>
            <Text style={styles.initial_config_sub_title} >
              Agora informe seu login e senha de técnico para carregar os seus chamados
          </Text>
          </HideWithKeyboard>

          <View style={[styles.initial_config_input_container]}>
            <View style={styles.initial_config_icon_container}>
              <Icon name="account" size={icons.small} color="#002f58" />
            </View>
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Login do técnico"
              style={styles.text_input_style}
              onChangeText={login => setLogin(login)}
            />
          </View>

          <View style={[styles.initial_config_input_container]}>
            <View style={styles.initial_config_icon_container}>
              <Icon name="lock" size={icons.small} color="#002f58" />
            </View>
            <TextInput
              placeholder="Sua senha secreta"
              style={styles.text_input_style}
              onChangeText={password => setPassword(password)}
              secureTextEntry={true}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handlePrevScreen} style={styles.initial_config_prev_btn_style}>
          <Icon name="chevron-left" size={icons.small} color="#FFF" />
          <Text style={styles.initial_config_navigators_text_style}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignIn} style={styles.initial_config_next_btn_style}>
          <Text style={styles.initial_config_navigators_text_style}>Conectar</Text>
          <Icon name="chevron-right" size={icons.small} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>

      <Modal
        children={
          <View style={styles.modal_style}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{fontSize: 18, textAlign: "center", marginBottom: 10}}>
              Carregando...
            </Text>
          </View>
        }
        isVisible={isVisible}
        style={{margin: 0}}
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={true}
      />
    </View>
  );
}