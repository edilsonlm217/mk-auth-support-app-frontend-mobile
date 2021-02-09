import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';

export default function ModalHome(props) {
  const options_array = [
    {
      icon: 'phone',
      label: 'Alterar número de telefone',
      navigate: () => props.navigationOptions[0](),
    },
    {
      icon: 'cellphone-android',
      label: 'Alterar número do celular',
      navigate: () => props.navigationOptions[1](),
    },
    {
      icon: 'home',
      label: 'Alterar endereço',
      navigate: () => props.navigationOptions[2](),
    },
    {
      icon: 'crosshairs-gps',
      label: 'Alterar localização do cliente',
      navigate: () => props.navigationOptions[3](),
    },
    {
      icon: 'access-point-network',
      label: 'Alterar caixa hermética',
      navigate: () => props.navigationOptions[4](),
    },
  ];

  const Option = params => {
    return (
      <TouchableOpacity onPress={params.navigate} style={styles.edit_option}>
        <Icon name={params.icon} size={20} color="#000" />
        <Text style={styles.label_style}>{params.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View>
        <Text style={[styles.main_text, { fontSize: 16, marginBottom: 10 }]}>
          Opções de Edição
        </Text>
      </View>

      {options_array.map((item, index) => (
        <Option
          key={index}
          icon={item.icon}
          label={item.label}
          navigate={item.navigate}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  main_text: {
    fontWeight: 'bold',
    fontSize: fonts.medium,
  },

  edit_option: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  label_style: {
    fontFamily: 'Roboto-Light',
    fontSize: fonts.medium,
    padding: 10,
    marginLeft: 10,
  },
});
