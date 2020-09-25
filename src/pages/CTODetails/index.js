import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { fonts } from '../../styles/index';

export default function CTODetails() {
  const SectionHeader = ({ label }) => {
    return (
      <View style={styles.header_container}>
        <Text style={styles.header_text}>{label}</Text>
      </View>
    );
  };

  return (
    <View>
      <Text>CTO_Details screen</Text>
      <View style={{ marginTop: '21%' }}>

        <SectionHeader label="Informações da caixa" />

        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, padding: 10, backgroundColor: '#FFF', borderColor: '#004C8F' }}>
          <Text style={{ fontFamily: 'Roboto-Light' }}>Capacidade de conexão</Text>
          <Text style={{ fontFamily: 'Roboto-Medium', fontSize: fonts.regular, color: '#337AB7' }}>8</Text>
        </View>

        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, padding: 10, backgroundColor: '#FFF', borderColor: '#004C8F' }}>
          <Text style={{ fontFamily: 'Roboto-Light' }}>Tipo de caixa</Text>
          <Text style={{ fontFamily: 'Roboto-Medium', fontSize: fonts.regular, color: '#337AB7' }}>8</Text>
        </View>

        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, padding: 10, backgroundColor: '#FFF', borderColor: '#004C8F' }}>
          <Text style={{ fontFamily: 'Roboto-Light' }}>Número da caixa</Text>
          <Text style={{ fontFamily: 'Roboto-Medium', fontSize: fonts.regular, color: '#337AB7' }}>8</Text>
        </View>

        <SectionHeader label="Clientes conectados" />

        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, padding: 10, backgroundColor: '#FFF', borderColor: '#004C8F' }}>
        </View>

      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  header_container: {
    height: 60,
    justifyContent: 'center',
    marginLeft: 25
  },

  header_text: {
    fontFamily: 'Roboto-Medium',
    fontSize: fonts.regular,
  },
});