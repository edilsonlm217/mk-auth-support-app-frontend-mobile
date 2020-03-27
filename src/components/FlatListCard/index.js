import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';

export default function FlatListCard(props) {
  return (
    <>
      <View style={styles.card}>
        <Collapse>
          <CollapseHeader>
            <View style={styles.card_header}>
              <View style={styles.profile_img}>
                <Text style={styles.profile_text}>MS</Text>
              </View>
              <View style={styles.client_section}>
                <Text style={styles.client_name}>{props.data.nome}</Text>
                <Text style={styles.sub_text}>
                  {props.data.endereco}
                </Text>
              </View>
            </View>
          </CollapseHeader>
          <CollapseBody>
            <View style={styles.card_body}>
              <View style={styles.service_info}>
                <Text style={styles.sub_text}>Serviço:</Text>
                <Text style={styles.main_body_text}>
                {
                  props.data.assunto !== null
                    ? props.data.assunto
                    : 'Sem comentários'
                }
                </Text>
              </View>
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
              <Text style={styles.location_btn}>Localização</Text>
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

  profile_text: {
    fontSize: 30,
    color: '#FFF',
  },

  client_section: {
    flex: 1,
    marginBottom: 20,
    marginTop: 20,
    marginRight: 20,
  },

  client_name: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  sub_text: {
    color: '#ABABAB',
  },

  card_body: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },

  service_info: {
    marginBottom: 15,
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
