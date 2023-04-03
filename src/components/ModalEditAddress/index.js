import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ToastAndroid,
  Alert,
} from 'react-native';
import api from '../../services/api';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';
import { clientStore } from '../../store/client';

export default function ModalEditAddress(props) {
  const globalState = useContext(store);
  const clientState = useContext(clientStore);

  const { setClientData } = clientState.methods;

  const [newAddress, setNewAddres] = useState(
    clientState.state.client.endereco_res,
  );
  const [newNo, setNewNo] = useState(clientState.state.client.numero_res);
  const [newNeighborhood, setNewNeighborhood] = useState(
    clientState.state.client.bairro_res,
  );

  async function handleNewAddress() {
    try {
      await api.post(
        `/client/${clientState.state.client.id}?tenant_id=${
          globalState.state.tenantID
        }`,
        {
          action: 'update_client',
          endereco_res: newAddress,
          numero_res: newNo,
          bairro_res: newNeighborhood,
        },
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      const newState = clientState.state.client;
      newState.endereco_res = newAddress;
      newState.numero_res = newNo;
      newState.bairro_res = newNeighborhood;

      setClientData(newState);
      props.goBack();
      ToastAndroid.show('Alterado com sucesso', ToastAndroid.SHORT);
    } catch (error) {
      if (error.response.data.code === 401) {
        Alert.alert('Permissão negada', error.response.data.message);
      } else {
        Alert.alert('Erro', 'Não foi possível salvar esta alteração');
      }
    }
  }

  return (
    <>
      <TouchableOpacity onPress={props.goBack} style={styles.header}>
        <Icon name="arrow-left" size={22} color="#000" />
        <Text
          style={[
            styles.main_text,
            { fontSize: 16, marginBottom: 10, marginLeft: 15 },
          ]}>
          {props.label}
        </Text>
      </TouchableOpacity>

      <View style={{ marginBottom: 10 }}>
        <Text>Endereço</Text>
        <TextInput
          onChangeText={text => setNewAddres(text)}
          value={newAddress}
          editable={true}
          style={styles.enable_text_input}
        />
      </View>

      <View style={{ marginBottom: 20, flexDirection: 'row' }}>
        <View style={{ flexDirection: 'column', width: '20%' }}>
          <Text textAlign="center">Número</Text>
          <TextInput
            onChangeText={text => setNewNo(text)}
            value={newNo}
            editable={true}
            style={styles.enable_text_input}
          />
        </View>

        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Text>Bairro</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              onChangeText={text => setNewNeighborhood(text)}
              value={newNeighborhood}
              editable={true}
              style={styles.enable_text_input}
            />
            <TouchableOpacity
              onPress={() => handleNewAddress()}
              style={[styles.save_btn_container]}>
              <Icon name="check" size={20} color="#FFF" />
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
