import React, { useEffect, useState }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import openMap from 'react-native-open-maps';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Details({ route, navigation }) {
  const [state, setState] = useState({});
  
  useEffect(() => {
    const { data } = route.params;
    setState(data);
  }, []);

  function OpenCoordinate(coordinate) {
    const [latidude, longitude] = coordinate.split(',');
    
    openMap({
      latitude: Number(latidude),
      longitude: Number(longitude),
      provider: 'google',
    });
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Icon name="account" size={25} color="#000" />
        <View style={{marginLeft: 10}}>
          <Text style={styles.main_text}>{state.nome}</Text>
          <Text style={styles.sub_text}>{
              `${state.plano === 'nenhum' 
                ? 'Nenhum'
                : state.plano} | ${state.tipo ? state.tipo.toUpperCase() : state.tipo} | ${state.ip}`
              }</Text>
        </View>
      </View>
      <View style={styles.line_container}>
        <Text style={styles.sub_text}>Horário de visita</Text>
        <Text style={styles.main_text}>
          {state.visita}
        </Text>
      </View>
      <View style={styles.line_container}>
        <Text style={styles.sub_text}>Serviço</Text>
        <Text style={styles.main_text}>{state.assunto}</Text>
      </View>
      <View style={styles.line_container}>
        <Text style={styles.sub_text}>Relato do cliente</Text>
        <Text style={styles.main_text}>
          {
            state.mensagem
              ? state.mensagem
              : 'Sem comentários'
          }
        </Text>
      </View>
      <View style={styles.line_container}>
        <Text style={styles.sub_text}>Login e senha</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.main_text}>{state.login}</Text>
          <Text style={styles.main_text}>{state.senha}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => OpenCoordinate(state.coordenadas)}>
        <View style={styles.location_line}>
          <View>
            <Text style={styles.sub_text}>Endereço</Text>
            <Text style={styles.main_text}>{`${state.endereco}, ${state.numero} - ${state.bairro}`}</Text>
          </View>
          <View style={{justifyContent: 'center'}}>
            <Icon name="navigation" size={30} color="#000" />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.close_request_btn}>
          <Text style={styles.btn_label}>Fechar Chamado</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: '100%',
    height: '100%',
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
    maxWidth: '95%', 
  },
  
  sub_text: { 
    fontSize: 16,
    color: '#989898',
  },

  line_container_location: {
    flexDirection: 'row',
  },
  
  location_line: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: "space-between"
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

  close_request_btn: {
    width: 230,
    height: 60,
    backgroundColor: '#337AB7',
    alignSelf: 'center',
    position: "absolute",
    bottom: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btn_label: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
