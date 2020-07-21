import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  ScrollView,
  RefreshControl,
  ToastAndroid,
  Dimensions,
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

  const [employeeRefreshing, setEmployeeRefreshing] = useState(false);

  // Estado para controlar visibilidade do datepicker
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [date] = useState(new Date());

  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const [time] = useState(new Date());

  // Hook para verificar se a tela atual está focada
  const isFocused = useIsFocused(false);

  // Declaração do estado global da aplicação
  const globalState = useContext(store);

  // Estado que armazena a lista mais recente de técnicos disponíveis  
  const [employees, setEmployees] = useState([]);

  // Estado que controla a visibilidade do modal de alteração de técnico
  const [employeesModal, setEmployeesModal] = useState(false);

  const [newEmployee, setNewEmployee] = useState({});

  const modalHeight = (Dimensions.get('window').width * 80) / 100;

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

        ToastAndroid.show("Alteração salva com sucesso", ToastAndroid.SHORT);

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

        ToastAndroid.show("Alteração salva com sucesso", ToastAndroid.SHORT);

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
            <Text style={styles.sub_text}>Motivo de fechamento</Text>
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
              <Text style={styles.sub_text}>Motivo de fechamento</Text>
              <Text style={styles.main_text}>{closing_reason}</Text>
            </View>
          </View>
          <View style={styles.line_container}>
            <View>
              <Text style={styles.sub_text}>Data de fechamento</Text>
              <Text style={styles.main_text}>{dd}/{mm}/{yyyy} às {hora}</Text>
            </View>
          </View>
        </>
      );
    }
  }

  function navigateToClient(client_id) {
    navigation.navigate('ClientDetails', {
      client_id,
    });
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

  async function handleCloseRequest() {
    if (globalState.state.isAdmin) {
      try {
        const { id: request_id } = route.params;

        const response = await axios.post(
          `http://${globalState.state.server_ip}:${globalState.state.server_port}/request/${request_id}`,
          {
            action: "close_request",
          },
          {
            timeout: 2500,
            headers: {
              Authorization: `Bearer ${globalState.state.userToken}`,
            },
          },
        );

        onRefresh();
      } catch (error) {
        console.log(error);
        Alert.alert('Erro', 'Não foi possível fechar chamado');
      }

    } else {
      Alert.alert('Acesso negado', 'Você não possui permissão para fechar chamados!');
    }
  }

  function RadioButton(props) {
    return (
      <View style={[{
        height: 15,
        width: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
      }, props.style]}>
        {
          props.selected ?
            <View style={{
              height: 11,
              width: 11,
              borderRadius: 6,
              backgroundColor: '#000',
            }} />
            : null
        }
      </View>
    );
  }

  async function getEmployees() {
    try {
      setEmployeeRefreshing(true);
      const response = await axios.get(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/employees`,
        {
          timeout: 2500,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      setEmployees(response.data);
      setEmployeeRefreshing(false);
    } catch {
      setRefreshing(false);
      ToastAndroid.show("Tente novamente", ToastAndroid.SHORT);
    }
  }

  async function openChangeEmployeeModal() {
    setEmployeesModal(true);
    getEmployees();
  }

  async function handleChangeEmployee() {
    if (Object.keys(newEmployee).length === 0) {
      ToastAndroid.show("Selecione um técnico antes de confirmar", ToastAndroid.SHORT);
    } else {
      try {
        const { id: request_id } = route.params;

        const response = await axios.post(
          `http://${globalState.state.server_ip}:${globalState.state.server_port}/request/${request_id}`,
          {
            action: "update_employee",
            employee_id: newEmployee.id,
          },
          {
            timeout: 2500,
            headers: {
              Authorization: `Bearer ${globalState.state.userToken}`,
            },
          },
        );

        setEmployeesModal(false)
        onRefresh();
        ToastAndroid.show("Alteração salva com sucesso", ToastAndroid.SHORT);

      } catch {
        ToastAndroid.show("Tente novamente", ToastAndroid.SHORT);
      }
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigateToClient(state.client_id)} style={styles.header_container}>
        <View>
          <Icon name="account" size={icons.tiny} color="#000" />
        </View>
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={styles.main_text}>{route.params.nome}</Text>
          <Text style={styles.sub_text}>
            {`${route.params.plano === 'nenhum'
              ? 'Nenhum'
              : route.params.plano} | ${route.params.tipo ? route.params.tipo.toUpperCase() : route.params.tipo} | ${route.params.ip === null ? 'Nenhum' : route.params.ip}`
            }
          </Text>
        </View>
        <View style={{ alignSelf: "center" }}>
          <Icon name="chevron-right" size={icons.tiny} color="#000" />
        </View>
      </TouchableOpacity>
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
                      <Text style={styles.sub_text}>Data de visita</Text>
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
                      <Text style={styles.sub_text}>Data de visita</Text>
                      <Text style={styles.main_text}>
                        {state.data_visita}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            }

            {globalState.state.isAdmin &&
              <TouchableOpacity onPress={() => openChangeEmployeeModal()}>
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
              <Text style={styles.sub_text}>Mensagem</Text>
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
                    <Text style={styles.sub_text}>Caixa atual</Text>
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

      {isDatePickerVisible &&
        <DateTimePicker
          mode="datetime"
          display="calendar"
          value={date}
          onChange={(event, selectedDate) => { handleNewDate(event, selectedDate) }}
        />
      }
      {isTimePickerVisible &&
        <DateTimePicker
          mode="time"
          value={time}
          onChange={(event, date) => { handleNewTime(event, date) }}
        />
      }

      <Modal
        onBackButtonPress={() => setEmployeesModal(false)}
        onBackdropPress={() => setEmployeesModal(false)}
        children={
          <View style={styles.modal_for_employees}>

            <View style={styles.mfe_current_employee_section}>
              <Text style={styles.mfe_main_text}>Técnico Atual</Text>
              <Text>{state.employee_name}</Text>
            </View>

            <View style={styles.mfe_employees_section}>
              <Text style={styles.mfe_main_text}>
                Selecione um novo técnico...
              </Text>
              <ScrollView
                showsVerticalScrollIndicator={true}
                refreshControl={
                  <RefreshControl refreshing={employeeRefreshing} onRefresh={() => getEmployees()} />
                }
                style={{ minHeight: 100, maxHeight: modalHeight }}
              >
                {employeeRefreshing === false && employees.map(employee => {
                  if (employee.nome !== state.employee_name) {
                    return (
                      < TouchableOpacity onPress={() => setNewEmployee(employee)} key={employee.id} style={{ flexDirection: 'row', alignItems: 'center', height: 30 }}>
                        {(employee.id === newEmployee.id)
                          ? <RadioButton selected />
                          : <RadioButton />
                        }
                        <Text style={{ marginLeft: 10, alignSelf: 'center' }}>{employee.nome}</Text>
                      </TouchableOpacity>
                    );
                  }
                })}
              </ScrollView>
            </View>

            <TouchableOpacity onPress={() => handleChangeEmployee()} style={styles.mfe_confirm_btn}>
              <Text style={styles.mfe_confirm_btn_label}>Confirmar</Text>
            </TouchableOpacity>

          </View>
        }
        isVisible={employeesModal}
        style={{ margin: 0 }}
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={true}
      />
    </View>
  );
}
