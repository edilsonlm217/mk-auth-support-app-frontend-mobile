import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Dimensions, 
  Image, 
  TextInput, 
  TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import lock from '../../assets/unlocked.png';

export default function AuthScreen() {
  return (
    <LinearGradient
      colors={['#002f58', '#337ab7']}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <Image source={lock} style={styles.logo_style} />

        <Text style={styles.main_text} >Quase lá</Text>

        <Text style={styles.sub_text} >
          Agora informe seu login e senha de técnico para carregar os seus chamados
        </Text>
        
        <View>
          <View style={styles.input_container}>
            <Icon name="account" size={28} color="#002f58" />
            <TextInput 
              placeholder="Login do técnico" 
              style={styles.text_input_style}
            />
          </View>

          <View style={[styles.input_container, {marginTop: 25}]}>
            <Icon name="lock" size={28} color="#002f58" />
            <TextInput 
              placeholder="Sua senha secreta" 
              style={styles.text_input_style}
            />
          </View>
        </View>

        <Text style={[styles.sub_text, {marginTop: 40}]}>2/2</Text>
      </View>

      <TouchableOpacity style={styles.next_btn_style}>
        <Text style={styles.navigators_text_style}>Conectar</Text>
        <Icon name="chevron-right" size={30} color="#FFF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.prev_btn_style}>
        <Icon name="chevron-left" size={30} color="#FFF" />
        <Text style={styles.navigators_text_style}>Voltar</Text>
      </TouchableOpacity>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 70,
  },

  linearGradient: {
    height: Dimensions.get('window').height
  },

  logo_style: {
    alignSelf: "center",
    marginBottom: 30,
  },

  main_text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 30,
  },

  sub_text: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 30,
  },

  input_container: {
    backgroundColor: "#FFF",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    height: 60,
  },

  text_input_style: {
    marginLeft: 10,
    fontSize: 18,
  },

  next_btn_style: {
    position: "absolute",
    bottom: 40,
    right: 10,
    flexDirection: "row",
  },

  navigators_text_style: {
    fontSize: 22,
    color: "#FFF",
  },

  prev_btn_style: {
    position: "absolute",
    bottom: 40,
    left: 10,
    flexDirection: "row",
  },
});
