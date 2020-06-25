import React, { useEffect, useState, useContext }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Alert, ScrollView } from 'react-native';
import openMap from 'react-native-open-maps';
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { store } from '../../store/store';

export default function Details({ route, navigation }) {
  const [state, setState] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const [caixaHermetica, setCaixaHermetica] = useState(null);

  // Hook para verificar se a tela atual está focada
  const isFocused = useIsFocused(false);

  // Declaração do estado global da aplicação
  const globalState = useContext(store);
  
  useEffect(() => {
    const { data } = route.params;
    setState(data);
  }, []);

  useEffect(() => {
    checkForUpdate();
  }, [isFocused]);

  async function checkForUpdate() {
    if (isFocused) {
      const response = await axios.get(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/client/${route.params.data.client_id}`,
        {
          timeout: 2500,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      setCaixaHermetica(response.data.caixa_herm);
    }
  }
  
  async function OpenCoordinate(coordinate) {
    const [latidude, longitude] = coordinate.split(',');
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(geo_success => {      
          const current_longitude = geo_success.coords.longitude;
          const current_latitude = geo_success.coords.latitude;
    
          openMap({
            provider: 'google',
            start: `${current_latitude},${current_longitude}`,
            end: `${latidude},${longitude}`
          });
        });
      } else {
        Alert.alert('Erro', 'Não foi possível recuperar sua Localização');
      }
    } catch (err) {
      Alert.alert('Erro');
    }
  }
  
  function ClosingReason() {
    if (state.motivo_fechamento === null) {
      return (
        <View style={styles.line_container}>
          <View>
            <Text style={styles.sub_text}>Motivo de Fechamento</Text>
            <Text style={styles.main_text}>Não informado</Text>
          </View>
        </View>
      );
    } else {
      
      const [ , closing_reason] = state.motivo_fechamento.split(': ');
      const [date, hora] = state.fechamento.split(' ');
      const [yyyy, mm, dd] = date.split('-');

      return (
        <>
          <View style={styles.line_container}>
            <View>
              <Text style={styles.sub_text}>Motivo de Fechamento</Text>
              <Text style={styles.main_text}>{closing_reason}</Text>
            </View>
          </View>
          <View style={styles.line_container}>
            <View>
              <Text style={styles.sub_text}>Data de Fechamento</Text>
              <Text style={styles.main_text}>{dd}/{mm}/{yyyy} às {hora}</Text>
            </View>
          </View>
        </>
      );
    }
  }

  function handleNavigateCTOMap(coordinate) {
    if (coordinate) {
      const [latidude, longitude] = coordinate.split(',');
      
      navigation.navigate('CTOs', {
        latidude: latidude,
        longitude: longitude,
        client_name: state.nome,
        client_id: state.client_id,
      });
    } else {
      Alert.alert('Impossível localizar', 'Este cliente não possui coordenadas definidas');
    }
  }

  function handleNavigateNewLocationPicker() {
    setIsVisible(false);
    navigation.navigate('UpdateClienteLocation', {
      data: {
        id: state.client_id,
      }
    });
  }

  function handleModalOpening() {
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: "<h2 style='color: #0af13e'>Usar Localização ?</h2>Este app quer alterar as configurações do seu dispositivo:<br/><br/>Usar GPS, Wi-Fi e rede do celular para localização<br/><br/><a href='#'>Saiba mais</a>",
      ok: "SIM",
      cancel: "NÃO",
      enableHighAccuracy: true,
      showDialog: true, 
      openLocationServices: true, 
      preventOutSideTouch: false, 
      preventBackClick: false, 
      providerListener: false 
    }).then(function(success) {
        setIsVisible(true);
    }).catch((error) => {
        // console.log(error.message);
    });

  }

  function handleModalClosing() {
    setIsVisible(false);
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Icon name="account" size={25} color="#000" />
        <View style={{marginLeft: 10}}>
          <Text style={styles.main_text}>{state.nome}</Text>
          <Text style={styles.sub_text}>
            {`${state.plano === 'nenhum' 
              ? 'Nenhum'
              : state.plano} | ${state.tipo ? state.tipo.toUpperCase() : state.tipo} | ${state.ip}`
            }
          </Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
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
        <TouchableOpacity onPress={handleModalOpening}>
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
        {state.status === 'fechado'
          ?
            (<ClosingReason />)
          :
            <></>
        }
          
        <View>
          <TouchableOpacity onPress={() => handleNavigateCTOMap(state.coordenadas)}>
            <View style={styles.cto_line}>
              <View>
                <Text style={styles.sub_text}>Caixa Sugerida</Text>
                <Text style={styles.main_text}>{caixaHermetica !== null ? caixaHermetica : 'Nenhuma'}</Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Icon name="map-search" size={30} color="#000" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Modal
          onBackButtonPress={handleModalClosing}
          onBackdropPress={handleModalClosing}
          children={
            <View style={styles.modal_style}>
              <Text style={styles.modal_header}>Selecione uma opção...</Text>
              <TouchableOpacity onPress={() => OpenCoordinate(state.coordenadas)} style={styles.modal_btn}>
                <Text style={styles.modal_btn_style}>Navegar até cliente</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigateNewLocationPicker(state.coordenadas)} style={styles.modal_btn}>
                <Text style={styles.modal_btn_style}>Atualizar coordenadas</Text>
              </TouchableOpacity>
            </View>
          }
          isVisible={isVisible}
          style={{margin: 0}}
          animationInTiming={500}
          animationOutTiming={500}
          useNativeDriver={true}
        />
      </ScrollView>
      {state.status === 'aberto'
        ? 
          (<TouchableOpacity style={styles.close_request_btn}>
            <Text style={styles.btn_label}>Fechar Chamado</Text>
          </TouchableOpacity>)
        : <></>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: '100%',
    height: '100%',
    padding: 20,
    paddingTop: 80,
  },
  header_container: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  
  main_text: { 
    fontWeight: "bold",
    fontSize: 20,
    minWidth: '90%',
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

  cto_line: {
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

  modal_style: {
    width: 300,
    backgroundColor: "#FFF",
    alignSelf: "center",
    borderWidth: 0,
    borderRadius: 10,
    padding: 20,
    paddingTop: 10,
  },

  modal_header: {
    fontWeight: "bold",
    fontSize: 18,
    width: '100%',
    marginBottom: 5,
  },

  modal_btn: {
    width: '100%',
    height: 40,
    marginTop: 10,
    display: "flex",
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#FFF',
    
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 4,
  },

  modal_btn_style: {
    fontSize: 18,
    paddingLeft: 15,
    textAlign: "center",
    

  }
});
