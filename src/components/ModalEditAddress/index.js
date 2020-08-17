import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';

export default function ModalEditAddress(props) {
  return (
    <>
      <TouchableOpacity onPress={props.goBack} style={styles.header}>
        <Icon name='arrow-left' size={22} color='#000' />
        <Text style={[styles.main_text, { fontSize: 16, marginBottom: 10, marginLeft: 15 }]}>{props.label}</Text>
      </TouchableOpacity>


      <View style={{ marginBottom: 10 }}>
        <Text>Endereço</Text>
        <TextInput editable={true} style={styles.enable_text_input} />
      </View>

      <View style={{ marginBottom: 20, flexDirection: 'row' }}>
        <View style={{ flexDirection: 'column', width: '20%' }}>
          <Text textAlign="center" >Número</Text>
          <TextInput editable={true} style={styles.enable_text_input} />
        </View>

        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Text>Bairro</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput editable={true} style={styles.enable_text_input} />
            <TouchableOpacity style={[styles.save_btn_container]}>
              <Icon name='check' size={20} color='#FFF' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },

  main_text: {
    fontWeight: 'bold',
    fontSize: fonts.medium,
  },

  disabled_text_input: {
    borderWidth: StyleSheet.hairlineWidth,
    padding: 3,
    backgroundColor: '#F5F5F5',
    borderColor: '#707070',
    borderRadius: 5,
    marginTop: 3,
  },

  enable_text_input: {
    borderWidth: StyleSheet.hairlineWidth,
    padding: 3,
    borderColor: '#707070',
    borderRadius: 5,
    marginTop: 3,
    flex: 1,
    marginRight: 5,
  },

  save_btn_container: {
    width: 40,
    padding: 3,
    marginTop: 3,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#337AB7',
    borderColor: '#337AB7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },

  cancel_btn_container: {
    width: 40,
    padding: 3,
    marginTop: 3,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#F5F5F5',
    borderColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});