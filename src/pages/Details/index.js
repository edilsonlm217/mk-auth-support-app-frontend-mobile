import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  ToastAndroid,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import { subHours, parseISO, format } from 'date-fns';
import { useIsFocused } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '../../services/api';
import { store } from '../../store/store';
import { icons, fonts } from '../../styles/index';
import LocationService from '../../services/location';

import styles from './styles';

export default function Details({ route, navigation }) {
  const [state, setState] = useState({});

  const [refreshing, setRefreshing] = useState(false);

  const [employeeRefreshing, setEmployeeRefreshing] = useState(false);

  // Estado para controlar visibilidade do datepicker
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [date] = useState(new Date());

  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const [closingNote, setClosingNote] = useState('');

  const request_type = 'Suporte';

  async function loadAPI() {
    setRefreshing(true);
    const { id: request_id } = route.params;

    try {
      const response = await api.get(`request/${request_id}/${request_type}?tenant_id=${globalState.state.tenantID}`,
        {
          timeout: 10000,
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

  function handleNavigationToNotes() {
    navigation.navigate('NotesScreen', {
      chamado: state.chamado
    });
  }

  const NotesButton = () => (
    <TouchableOpacity onPress={() => handleNavigationToNotes()}>
      <Icon
        name="message-text-outline"
        size={22}
        color="#FFFFFF"
        style={{ marginRight: 20, marginTop: 5 }}
      />
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <NotesButton
          {...props}
        />
      ),
    });
  }, [state]);

  async function handleNewDate(event, selectedDate) {
    if (event.type === 'set') {
      setIsDatePickerVisible(false);

      try {
        setIsLoading(true);
        const { id: request_id } = route.params;

        const response = await api.post(`request/${request_id}?tenant_id=${globalState.state.tenantID}`,
          {
            action: "update_visita_date",
            new_visita_date: selectedDate,
            request_type: request_type,
            madeBy: globalState.state.employee_id,
          },
          {
            timeout: 10000,
            headers: {
              Authorization: `Bearer ${globalState.state.userToken}`,
            },
          },
        );

        setIsLoading(false);
        ToastAndroid.show("Alteração salva com sucesso", ToastAndroid.SHORT);
        onRefresh();
      } catch {
        setIsLoading(false);
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
        setIsLoading(true);
        const { id: request_id } = route.params;

        await api.post(`request/${request_id}?tenant_id=${globalState.state.tenantID}`,
          {
            action: "update_visita_time",
            new_visita_time: new Date(time.valueOf() - time.getTimezoneOffset() * 60000),
            request_type: request_type,
            madeBy: globalState.state.employee_id,
          },
          {
            timeout: 10000,
            headers: {
              Authorization: `Bearer ${globalState.state.userToken}`,
            },
          },
        );

        setIsLoading(false);
        ToastAndroid.show("Alteração salva com sucesso", ToastAndroid.SHORT);

        onRefresh();
      } catch (e) {
        setIsLoading(false);
        Alert.alert('Erro', 'Não foi possível atualizar horário de visita');
      }
    } else if (event.type === 'dismissed') {
      setIsTimePickerVisible(false);
    }
  }

  async function onRefresh() {
    loadAPI();
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
      const fechamento = parseISO(state.fechamento);

      const date = format(fechamento, 'dd/MM/yyyy');
      const hora = format(fechamento, 'hh:mm:ss');

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
              <Text style={styles.main_text}>{date} às {hora}</Text>
            </View>
          </View>
        </>
      );
    }
  }

  function navigateToClient(client_id, client_name) {
    navigation.navigate('ClientScreen', {
      client_id,
      client_name,
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

  async function closeRequest() {
    if (!(closingNote === '')) {
      try {
        setIsLoading(true);
        const { id: request_id } = route.params;

        const timeZoneOffset = new Date().getTimezoneOffset() / 60;

        await api.post(`request/${request_id}?tenant_id=${globalState.state.tenantID}`,
          {
            action: "close_request",
            closingNote,
            closingDate: subHours(new Date(), timeZoneOffset),
            employee_id: globalState.state.employee_id,
            request_type: request_type,
            madeBy: globalState.state.employee_id,
          },
          {
            timeout: 10000,
            headers: {
              Authorization: `Bearer ${globalState.state.userToken}`,
            },
          },
        );

        setIsLoading(false);
        onRefresh();
        setIsDialogVisible(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        Alert.alert('Erro', 'Não foi possível fechar chamado');
      }
    } else {
      Alert.alert('Erro', 'É obrigatório informar o motivo do fechamento');
    }
  }

  function handleCloseRequest() {
    if (globalState.state.isAdmin) {
      setIsDialogVisible(true);
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
      const response = await api.get(`employees?tenant_id=${globalState.state.tenantID}`,
        {
          timeout: 10000,
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
        setIsLoading(true);
        const { id: request_id } = route.params;

        await api.post(`request/${request_id}?tenant_id=${globalState.state.tenantID}`,
          {
            action: "update_employee",
            employee_id: newEmployee.id,
            request_type: request_type,
            madeBy: globalState.state.employee_id,
          },
          {
            timeout: 10000,
            headers: {
              Authorization: `Bearer ${globalState.state.userToken}`,
            },
          },
        );

        setIsLoading(false);
        setEmployeesModal(false)
        onRefresh();
        ToastAndroid.show("Alteração salva com sucesso", ToastAndroid.SHORT);

      } catch {
        setIsLoading(false);
        ToastAndroid.show("Tente novamente", ToastAndroid.SHORT);
      }
    }
  }

  function copyToClipboard(text) {
    Clipboard.setString(text);
    ToastAndroid.show("Copiado para o clipboard", ToastAndroid.SHORT);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigateToClient(state.client_id, state.nome)} style={styles.section_header}>
        <Text style={styles.header_title}>{route.params.nome}</Text>
        <Text style={[styles.sub_text, { textAlign: 'center' }]}>
          {`${route.params.plano === 'nenhum'
            ? 'Nenhum'
            : route.params.plano} | ${route.params.tipo ? route.params.tipo.toUpperCase() : route.params.tipo} | ${route.params.ip === null ? 'Nenhum' : route.params.ip}`
          }
        </Text>
        {state.equipment_status &&
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={[
                styles.client_status,
                {
                  color: state.equipment_status === 'Online' ? 'green' : 'red'
                }
              ]}
            >
              {state.equipment_status}
            </Text>
            <Icon
              name="circle"
              size={10}
              color={state.equipment_status === 'Online' ? 'green' : 'red'}
              style={{ marginTop: 2 }}
            />
          </View>
        }
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
              <Text style={styles.sub_text}>Assunto</Text>
              <Text style={styles.main_text}>{state.assunto}</Text>
            </View>
            <View style={styles.line_container}>
              <Text style={styles.sub_text}>Equipamento</Text>
              <Text style={styles.main_text}>
                {state.equipamento !== "nenhum"
                  ? state.equipamento
                  : 'Nenhum'
                }
              </Text>
            </View>
            <View style={styles.line_container}>
              <Text style={styles.sub_text}>Mensagem</Text>
              <Text style={styles.main_text}>
                {state.mensagem
                  ? state.mensagem
                  : 'Sem comentários'
                }
              </Text>
            </View>

            <View style={[styles.line_container, { flexDirection: 'row', justifyContent: 'space-between' }]}>
              <View>
                <Text style={styles.sub_text}>Login</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(state.login)}
                  style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <Text style={styles.main_text_login_senha}>{state.login}</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={[styles.sub_text, { textAlign: 'right' }]}>Senha</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(state.senha)}
                  style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <Text style={styles.main_text_login_senha}>{state.senha}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => LocationService.navigateToCoordinate(state.coordenadas)}>
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
                  {state.caixa_hermetica !== null
                    ? (
                      <>
                        <View>
                          <Text style={styles.sub_text}>Caixa atual</Text>
                          <Text style={styles.main_text}>{state.caixa_hermetica !== null ? state.caixa_hermetica : 'Nenhuma'}</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                          <Icon name="map-search" size={icons.tiny} color="#000" />
                        </View>
                      </>
                    )
                    : (
                      <>
                        <View>
                          <Text style={styles.sub_text}>SSID</Text>
                          <Text style={styles.main_text}>{state.ssid !== null ? state.ssid : 'Nenhum'}</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                          <Icon name="map-search" size={icons.tiny} color="#000" />
                        </View>
                      </>
                    )
                  }
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

      {isDialogVisible &&
        <Modal
          onBackButtonPress={() => setIsDialogVisible(false)}
          onBackdropPress={() => setIsDialogVisible(false)}
          children={
            <View style={styles.modal_style}>
              <Text style={styles.modal_header}>
                Fechar chamado
              </Text>
              <Text style={{ marginTop: 10 }}>Nota de fechamento:</Text>
              <TextInput
                onChangeText={text => setClosingNote(text)}
                textAlignVertical="top"
                multiline={true}
                style={styles.text_input_style}

              />
              <View style={styles.modal_btn_container}>
                <TouchableOpacity onPress={() => setIsDialogVisible(false)}>
                  <Text>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => closeRequest()} style={{ marginLeft: 15 }}>
                  <Text style={{ color: '#337AB7', fontWeight: 'bold' }}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          isVisible={isDialogVisible}
          style={{ margin: 0 }}
          animationInTiming={500}
          animationOutTiming={500}
          useNativeDriver={true}
        />
      }

      {isLoading &&
        <Modal
          children={
            <View
              style={{
                width: 300,
                backgroundColor: "#FFF",
                alignSelf: "center",
                borderWidth: 0,
                borderRadius: 5,
                padding: 20,
                paddingTop: 10,
              }}>
              <ActivityIndicator size="small" color="#337AB7" />
              <Text
                style={{
                  fontSize: fonts.regular,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Carregando...
            </Text>
            </View>
          }
          isVisible={isLoading}
          style={{ margin: 0 }}
          animationInTiming={500}
          animationOutTiming={500}
          useNativeDriver={true}
        />
      }
    </View >
  );
}
