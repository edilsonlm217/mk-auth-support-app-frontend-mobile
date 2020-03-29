import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import openMap from 'react-native-open-maps';

import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';

export default function FlatListCard(props) {
  function OpenCoordinate(coordinate) {
    const [latidude, longitude] = coordinate.split(',');
    
    openMap({
      latitude: Number(latidude),
      longitude: Number(longitude),
      provider: 'google',
    });
  }

  return (
    <>
      <View style={styles.card}>
        <Collapse>
          <CollapseHeader>
            <View style={styles.card_header_content_container}>
              <View style={styles.card_header}>
                <Text style={styles.client_name}>{props.data.nome}</Text>
                <Text style={styles.visit_time}>{props.data.visita}</Text>
              </View>
              <Text>{`${props.data.endereco}, ${props.data.numero} - ${props.data.bairro}`}</Text>
              <Text>{`Serviço: ${props.data.assunto}`}</Text>
            </View>
          </CollapseHeader>
          <CollapseBody>
            <View style={styles.card_body}>
              <View>
                <Text style={styles.sub_text}>Relato do cliente:</Text>
                <Text style={styles.main_body_text}>
                  {
                    props.data.mensagem !== null
                      ? props.data.mensagem
                      : 'Sem comentários'
                  }
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity onPress={() => OpenCoordinate(props.data.coordenadas)}>
                <Text style={styles.location_btn}>Localização</Text>
              </TouchableOpacity>
              <Text style={styles.close_request_btn}>Fechar chamado</Text>
            </View>
          </CollapseBody>
        </Collapse>
      </View>
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

  profile_img: {
    alignSelf: 'center',
    backgroundColor: '#33B2B7',
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
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

  card_body: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },

  main_body_text: {
    fontWeight: 'bold',
  },

  location_btn: {
    height: 40,
    borderTopWidth: 0.5,
    borderTopColor: '#D8D8D8',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
  },

  close_request_btn: {
    height: 40,
    backgroundColor: '#337AB7',
    color: '#FFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    fontSize: 16,
  },
});
