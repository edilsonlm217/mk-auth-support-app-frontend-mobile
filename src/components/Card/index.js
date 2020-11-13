import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { store } from '../../store/store';
import { fonts } from '../../styles/index';

export default function Card(props) {
  const globalState = useContext(store);

  function calcBorderColor() {
    if (!props.item.prioridade) {
      return '#04EF72';
    }

    if (props.item.prioridade === 'normal') {
      return '#FFB301';
    }

    if (props.item.prioridade === 'baixa') {
      return '#04EF72';
    }

    if (props.item.prioridade === 'alta') {
      return '#FF0101';
    }
  }

  const borderColor = calcBorderColor();

  function UserAdress() {

    if (props.item.endereco === null) {
      return <Text>Sem endereço</Text>
    } else {
      const endereco = props.item.endereco;
      const numero = props.item.numero ? props.item.numero : 'S/N'
      const bairro = props.item.bairro

      return (
        <Text numberOfLines={1} style={{ fontSize: fonts.small }}>
          {`${endereco}, ${numero} - ${bairro}`}
        </Text>
      );
    }
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.card, { borderColor: borderColor }]}
        onPress={() => {
          if (props.item.assunto === 'Ativação') {
            props.navigation.navigate('InstallationRequestDetails', {
              id: props.item.id,
              nome: props.item.nome,
              tipo: props.item.tipo,
              ip: props.item.ip,
              plano: props.item.plano,
              assunto: props.item.assunto,
            });
          } else {
            props.navigation.navigate('Details', {
              id: props.item.id,
              nome: props.item.nome,
              tipo: props.item.tipo,
              ip: props.item.ip,
              plano: props.item.plano,
              assunto: props.item.assunto,
            });
          }
        }}
      >
        <View style={styles.card_header_content_container}>
          <View style={styles.card_header}>
            <Text numberOfLines={1} style={styles.client_name}>{props.item.nome}</Text>
            <Text style={styles.visit_time}>{props.item.visita}</Text>
          </View>
          <UserAdress />
          <Text style={{ fontSize: fonts.small }}>{`Assunto: ${props.item.assunto}`}</Text>
          {globalState.state.isAdmin &&
            <Text style={{ fontSize: fonts.small }}>
              {props.item.employee_name === null
                ? 'Técnico: Não assinalado'
                : `Técnico: ${props.item.employee_name}`
              }
            </Text>
          }
        </View>
      </TouchableOpacity>
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

    borderWidth: 1,
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
    flex: 1,
    paddingRight: 10,
    color: '#808080',
  },

  visit_time: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
    color: '#808080',
  },
});
