import React from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TextInput, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import gear from '../../assets/gear.png'

export default function InitialConfig() {
  return (
    <LinearGradient
      colors={['#002f58', '#337ab7']}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <Image source={gear} style={styles.logo_style} />

        <Text style={styles.main_text} >Configuração inicial</Text>

        <Text style={styles.sub_text} >
          Para conectar com seu servidor MK-AUTH informe o endereço IP externo e porta para conexão
        </Text>
        
        <View>
          <View style={styles.input_container}>
            <Icon name="laptop" size={28} color="#002f58" />
            <TextInput 
              placeholder="Endereço IP do servidor" 
              style={styles.text_input_style}
            />
          </View>

          <View style={[styles.input_container, {marginTop: 25}]}>
            <Icon name="transit-connection-variant" size={28} color="#002f58" />
            <TextInput 
              placeholder="Porta de conexão" 
              style={styles.text_input_style}
            />
          </View>
        </View>

        <Text style={[styles.sub_text, {marginTop: 40}]}>1/2</Text>
      </View>

      <TouchableOpacity style={styles.next_btn_style}>
        <Text style={styles.navigators_text_style}>Próximo</Text>
        <Icon name="chevron-right" size={30} color="#FFF" />
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
});
