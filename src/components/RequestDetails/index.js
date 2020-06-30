import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './styles';

export default function RequestDetails(props) {
  function handleNavigate() {
    props.CloseModal();

    props.navigation.navigate('Details', {
      data: props.data,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Icon name="account" size={20} color="#000" />
        <View style={{marginLeft: 10}}>
          <Text style={styles.main_text}>{props.data.nome}</Text>
          <Text style={styles.sub_text}>
            <Text style={styles.sub_text}>
              {
              `${props.data.plano === 'nenhum' 
                ? 'Nenhum'
                : props.data.plano} | ${props.data.tipo.toUpperCase()} | ${props.data.ip}`
              }
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.line_container}>
        <Text style={styles.sub_text}>Serviço</Text>
        <Text style={styles.main_text}>{props.data.assunto}</Text>
      </View>
      <View style={styles.line_container}>
        <Text style={styles.sub_text}>Relato do cliente</Text>
        <Text style={styles.main_text}>
          {
            props.data.mensagem 
            ? props.data.mensagem 
            : 'Sem comentários'
          }
        </Text>
      </View>
      <View style={styles.line_container}>
        <Text style={styles.sub_text}>Login e senha</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.main_text}>{props.data.login}</Text>
          <Text style={styles.main_text}>{props.data.senha}</Text>
        </View>
      </View>
      <View style={styles.btns_contaier}>
        <TouchableOpacity onPress={props.CloseModal} style={styles.secondary_btn}>
          <Text style={styles.secondary_btn_text}>Fechar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.main_btn} onPress={handleNavigate}>
          <Text style={styles.main_btn_text}>Mais detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

