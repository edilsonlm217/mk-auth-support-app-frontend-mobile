import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import RequestDetail from '../../components/RequestDetails/index';

import { fonts } from '../../styles/index';

export default function Card(props) {
  const [isVisible, setIsVisible] = useState(false);

  function handleModalOpening() {
    setIsVisible(true);
  }

  function handleModalClosing() {
    setIsVisible(false);
  }

  function UserAdress() {

    if (props.item.endereco === null) {
      return <Text>Sem endereço</Text>
    } else {
      const endereco = props.item.endereco;
      const numero = props.item.numero ? props.item.numero : 'S/N'
      const bairro = props.item.bairro

      return (
        <Text style={{ fontSize: fonts.small }}>{`${endereco}, ${numero} - ${bairro}`}</Text>
      );
    }
  }

  return (
    <>
      <TouchableOpacity onPress={handleModalOpening}>
        <View style={styles.card}>
          <View style={styles.card_header_content_container}>
            <View style={styles.card_header}>
              <Text numberOfLines={1} style={styles.client_name}>{props.item.nome}</Text>
              <Text style={styles.visit_time}>{props.item.visita}</Text>
            </View>
            <UserAdress />
            <Text style={{ fontSize: fonts.small }}>{`Serviço: ${props.item.assunto}`}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        onBackButtonPress={handleModalClosing}
        onBackdropPress={handleModalClosing}
        children={
          <RequestDetail
            data={props.item}
            navigation={props.navigation}
            CloseModal={() => setIsVisible(false)}
          />
        }
        isVisible={isVisible}
        style={{ margin: 0 }}
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 6,
    backgroundColor: '#FFF',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 10,
  },

  card_header_content_container: {
    padding: 15,
  },

  card_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  client_name: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
    maxWidth: 250,
    color: '#808080',
  },

  visit_time: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
    color: '#808080',
  },
});
