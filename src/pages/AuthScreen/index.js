import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity,
  Alert, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Modal from 'react-native-modal';

import { store } from '../../store/store';

import lock from '../../assets/unlocked.png';

import styles from './styles';

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
    <LinearGradient
      colors={['#002f58', '#337ab7']}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <Image source={lock} style={styles.logo_style} />

        <Text style={styles.main_text} >Quase lá</Text>
        <HideWithKeyboard>
          <Text style={styles.sub_text} >
            Agora informe seu login e senha de técnico para carregar os seus chamados
          </Text>
        </HideWithKeyboard>
        
        <View>
          <View style={styles.input_container}>
            <View style={{width: '10%', alignItems: 'center'}}>
              <Icon name="account" size={28} color="#002f58" />
            </View>
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Login do técnico" 
              style={styles.text_input_style}
              onChangeText={login => setLogin(login)}
            />
          </View>

          <View style={[styles.input_container, {marginTop: 25}]}>
            <View style={{width: '10%', alignItems: 'center'}}>
              <Icon name="lock" size={28} color="#002f58" />
            </View>
            <TextInput 
              placeholder="Sua senha secreta" 
              style={styles.text_input_style}
              onChangeText={password => setPassword(password)}
              secureTextEntry={true}
            />
          </View>
        </View>
        <HideWithKeyboard>
          <Text style={[styles.sub_text, {marginTop: 40}]}>2/2</Text>
        </HideWithKeyboard>
      </View>

      <TouchableOpacity onPress={handleSignIn} style={styles.next_btn_style}>
        <Text style={styles.navigators_text_style}>Conectar</Text>
        <Icon name="chevron-right" size={30} color="#FFF" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePrevScreen} style={styles.prev_btn_style}>
        <Icon name="chevron-left" size={30} color="#FFF" />
        <Text style={styles.navigators_text_style}>Voltar</Text>
      </TouchableOpacity>

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

    </LinearGradient>
  );
}