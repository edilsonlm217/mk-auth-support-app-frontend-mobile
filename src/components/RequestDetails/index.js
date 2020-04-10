import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RequestDetails(props) {
  console.log(props);
  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Icon name="account" size={25} color="#000" />
        <View style={{marginLeft: 10}}>
          <Text style={styles.main_text}>{props.data.nome}</Text>
          <Text style={styles.sub_text}>Econômico ETH|PPPOE|192.168.0.2</Text>
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
        <Text style={styles.sub_text}>Login e Senha</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.main_text}>evandro.feitoza</Text>
          <Text style={styles.main_text}>12345678</Text>
        </View>
      </View>
      <View style={styles.btns_contaier}>
        <TouchableOpacity onPress={props.CloseModal} style={styles.secondary_btn}>
          <Text style={styles.secondary_btn_text}>Fechar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.main_btn}>
          <Text style={styles.main_btn_text}>Mais detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 0,
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
  },
  header_container: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  
  main_text: { 
    fontWeight: "bold",
    fontSize: 20,    
  },
  
  sub_text: { 
    fontSize: 16,
    color: '#989898',
  },
  line_container: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btns_contaier: {
    flexDirection: "row",
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: '#FFF'
  },
  secondary_btn: {
    backgroundColor: '#FFF',
    width: 160,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 6,
  },
  
  secondary_btn_text: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#337AB7',
  },
  
  main_btn: {
    backgroundColor: '#337AB7',
    width: 160,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 6,
  },

  main_btn_text: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#FFF',
  },
});
