import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import RequestDetail from '../../components/RequestDetails/index';

export default function Card(props) {
  const [isVisible, setIsVisible] = useState(false);

  function handleModalOpening() {
    setIsVisible(true);
  }

  function handleModalClosing() {
    setIsVisible(false);
  }

  return (
    <>
      <TouchableOpacity onPress={handleModalOpening}>
        <View style={styles.card}>
          <View style={styles.card_header_content_container}>
            <View style={styles.card_header}>
              <Text style={styles.client_name}>{props.item.nome}</Text>
              <Text style={styles.visit_time}>{props.item.visita}</Text>
            </View>
            <Text>{`${props.item.endereco}, ${props.item.numero} - ${props.item.bairro}`}</Text>
            <Text>{`Serviço: ${props.item.assunto}`}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        onBackdropPress={handleModalClosing}
        children={
          <RequestDetail 
            data={props.item} 
            navigation={props.navigation} 
            CloseModal={() => setIsVisible(false)} 
          />
        }
        isVisible={isVisible}
        style={{margin: 0}}
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
    marginBottom: 10,
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
    padding: 20,
  },

  card_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  client_name: {
    fontWeight: 'bold',
    fontSize: 20,
    maxWidth: 250,
    color: '#808080',
  },

  visit_time: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#808080',
  },
});
