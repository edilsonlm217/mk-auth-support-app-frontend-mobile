import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';

import styles from './styles';

export default function FlatListCard(props) {
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
              <Text>{`${props.data.endereco}, ${props.data.numero} - ${
                props.data.bairro
              }`}</Text>
              <Text>{`Serviço: ${props.data.assunto}`}</Text>
            </View>
          </CollapseHeader>
          <CollapseBody>
            <View style={styles.card_body}>
              <View>
                <Text style={styles.sub_text}>Relato do cliente:</Text>
                <Text style={styles.main_body_text}>
                  {props.data.mensagem !== null
                    ? props.data.mensagem
                    : 'Sem comentários'}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity>
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
