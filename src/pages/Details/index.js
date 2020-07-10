import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  ScrollView,
  RefreshControl,
  ToastAndroid
} from 'react-native';
import openMap from 'react-native-open-maps';
import Geolocation from '@react-native-community/geolocation';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { store } from '../../store/store';

import styles from './styles';
import { icons } from '../../styles/index';

export default function Details({ route, navigation }) {
  const [state, setState] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  // Estado para controlar visibilidade do datepicker
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  // Hook para verificar se a tela atual está focada
  const isFocused = useIsFocused(false);

  // Declaração do estado global da aplicação
  const globalState = useContext(store);

  async function loadAPI() {
    setRefreshing(true);
    const { id: request_id } = route.params;

    try {
      const response = await axios.get(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/request/${request_id}`,
        {
          timeout: 3000,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      setState(response.data);
      setRefreshing(false);
    } catch {
      ToastAndroid.show("Não foi possível atualizar", ToastAndroid.SHORT);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAPI();
  }, []);

  useEffect(() => {
    loadAPI();
  }, [isFocused]);

  async function handleNewDate(event, selectedDate) {
    if (event.type === 'set') {
      setIsDatePickerVisible(false);

      try {
        const { id: request_id } = route.params;

        const response = await axios.post(
          `http://${globalState.state.server_ip}:${globalState.state.server_port}/request/${request_id}`,
          {
            action: "update_visita_date",
            new_visita_date: selectedDate,
          },
          {
            timeout: 2500,
            headers: {
              Authorization: `Bearer ${globalState.state.userToken}`,
            },
          },
        );

        onRefresh();
      } catch {
        Alert.alert('Erro', 'Não foi possível atualizar horário de visita');
      }
    } else if (event.type === 'dismissed') {
      setIsDatePickerVisible(false);
    }
  }

  async function handleNewTime(event, time) {
    if (event.type === 'set') {
      setIsTimePickerVisible(false);

      try {
        const { id: request_id } = route.params;

        const response = await axios.post(
          `http://${globalState.state.server_ip}:${globalState.state.server_port}/request/${request_id}`,
          {
            action: "update_visita_time",
            new_visita_time: time,
          },
          {
            timeout: 2500,
            headers: {
              Authorization: `Bearer ${globalState.state.userToken}`,
            },
          },
        );

        onRefresh();
      } catch {
        Alert.alert('Erro', 'Não foi possível atualizar horário de visita');
      }
    } else if (event.type === 'dismissed') {
      setIsTimePickerVisible(false);
    }
  }

  async function onRefresh() {
    loadAPI();
  }

  async function OpenCoordinate(coordinate) {
    const [latidude, longitude] = coordinate.split(',');

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const { } = Geolocation.getCurrentPosition(geo_success => {
          const current_longitude = geo_success.coords.longitude;
          const current_latitude = geo_success.coords.latitude;

          openMap({
            provider: 'google',
            start: `${current_latitude},${current_longitude}`,
            end: `${latidude},${longitude}`
          });
        }, geo_error => {
          console.log(geo_error)
          Alert.alert('Erro', 'Não é possível navegar até o cliente');
        }, {
          timeout: 5000,
          enableHighAccuracy: true,
        });
      } else {
        Alert.alert('Erro', 'Não foi possível recuperar sua Localização');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Erro', 'Não é possível navegar até o cliente');
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

      const [, closing_reason] = state.motivo_fechamento.split(': ');
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
    }).then(function (success) {
      setIsVisible(true);
    }).catch((error) => {
      // console.log(error.message);
    });

  }

  function handleModalClosing() {
    setIsVisible(false);
  }

  function handleCloseRequest() {
    Alert.alert('Acesso negado', 'Você não possui permissão para fechar chamados!');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Icon name="account" size={icons.tiny} color="#000" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.main_text}>{route.params.nome}</Text>
          <Text style={styles.sub_text}>
            {`${route.params.plano === 'nenhum'
              ? 'Nenhum'
              : route.params.plano} | ${route.params.tipo ? route.params.tipo.toUpperCase() : route.params.tipo} | ${route.params.ip}`
            }
          </Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {refreshing !== true &&
          <>
            {globalState.state.isAdmin 
            ?
              <>
                <TouchableOpacity onPress={() => setIsTimePickerVisible(true)}>
                  <View style={styles.cto_line}>
                    <View>
                      <Text style={styles.sub_text}>Horário de visita</Text>
                      <Text style={styles.main_text}>
                        {state.visita}
                      </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                      <Icon name="clock-outline" size={icons.tiny} color="#000" />
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
                  <View style={styles.cto_line}>
                    <View>
                      <Text style={styles.sub_text}>Dia da visita</Text>
                      <Text style={styles.main_text}>
                        {state.data_visita}
                      </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                      <Icon name="calendar" size={icons.tiny} color="#000" />
                    </View>
                  </View>
                </TouchableOpacity>
              </>
              :
              <>
                <View>
                  <View style={styles.cto_line}>
                    <View>
                      <Text style={styles.sub_text}>Horário de visita</Text>
                      <Text style={styles.main_text}>
                        {state.visita}
                      </Text>
                    </View>
                  </View>
                </View>

                <View>
                  <View style={styles.cto_line}>
                    <View>
                      <Text style={styles.sub_text}>Dia da visita</Text>
                      <Text style={styles.main_text}>
                        {state.data_visita}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            }

            {globalState.state.isAdmin &&
              <TouchableOpacity onPress={() => handleNavigateCTOMap(state.coordenadas)}>
                <View style={styles.cto_line}>
                  <View>
                    <Text style={styles.sub_text}>Técnico responsável</Text>
                    <Text style={styles.main_text}>
                      {state.employee_name === null
                        ? 'Não assinalado'
                        : state.employee_name
                      }
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <Icon name="account-edit" size={icons.tiny} color="#000" />
                  </View>
                </View>
              </TouchableOpacity>
            }
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.main_text_login_senha}>{state.login}</Text>
                <Text style={styles.main_text_login_senha}>{state.senha}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleModalOpening}>
              <View style={styles.location_line}>
                <View>
                  <Text style={styles.sub_text}>Endereço</Text>
                  <Text style={styles.main_text}>{`${state.endereco}, ${state.numero} - ${state.bairro}`}</Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Icon name="navigation" size={icons.tiny} color="#000" />
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
                    <Text style={styles.sub_text}>Caixa Atual</Text>
                    <Text style={styles.main_text}>{state.caixa_hermetica !== null ? state.caixa_hermetica : 'Nenhuma'}</Text>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <Icon name="map-search" size={icons.tiny} color="#000" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {state.status === 'aberto' &&
              <TouchableOpacity onPress={handleCloseRequest} style={styles.close_request_btn}>
                <Text style={styles.btn_label}>Fechar Chamado</Text>
              </TouchableOpacity>
            }
          </>
        }

      </ScrollView>

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
        style={{ margin: 0 }}
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={true}
      />

      {
        isDatePickerVisible &&
        <DateTimePicker
          mode="datetime"
          display="calendar"
          value={date}
          onChange={(event, selectedDate) => { handleNewDate(event, selectedDate) }}
        />
      }
      {
        isTimePickerVisible &&
        <DateTimePicker
          mode="time"
          value={time}
          onChange={(event, date) => { handleNewTime(event, date) }}
        />
      }
    </View>
  );
}
