import React, { useEffect, useState, useContext, useRef, useReducer } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
  Switch,
  Animated,
  Linking,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import Clipboard from '@react-native-community/clipboard';
import api from '../../services/api';
import CallIcon from 'react-native-vector-icons/Zocial';
import axios from 'axios';
import MapViewDirections from 'react-native-maps-directions';
import { parseISO, format } from 'date-fns';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBPMt-2IYwdXtEw37R8SV1_9RLAMSqqcEw';

import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';

import LocationService from '../../services/location';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { store } from '../../store/store';

import styles from './styles';
import { icons, fonts } from '../../styles/index';

export default function InstallationRequestDetails({ route, navigation }) {
  const [state, setState] = useState({});

  const [refreshing, setRefreshing] = useState(true);

  const [employeeRefreshing, setEmployeeRefreshing] = useState(false);

  // Estado para controlar visibilidade do datepicker
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [date] = useState(new Date());

  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [time] = useState(new Date());

  // Declaração do estado global da aplicação
  const globalState = useContext(store);

  // Estado que armazena a lista mais recente de técnicos disponíveis  
  const [employees, setEmployees] = useState([]);

  // Estado que controla a visibilidade do modal de alteração de técnico
  const [employeesModal, setEmployeesModal] = useState(false);

  const [newEmployee, setNewEmployee] = useState({});

  const modalHeight = (Dimensions.get('window').width * 80) / 100;

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const [isVisited, setIsVisited] = useState(true);
  const [isInstalled, setIsInstalled] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  // Estado que controla todo o calculo de rotas
  const [_state, dispatch] = useReducer(reducer, {
    dest_latitude: null,
    dest_longitude: null,
  });

  function reducer(state, action) {
    switch (action.type) {
      case 'traceroute':
        return {
          dest_latitude: action.payload.cto_latitude,
          dest_longitude: action.payload.cto_longitude,
        }
    }
  }

  const swipeAnim = useRef(new Animated.Value(0)).current;

  // Estes dados do cliente nunca tem seus valores alterados
  const client_latitude = route.params.latitude;
  const client_longitude = route.params.longitude;
  const client_name = route.params.nome;

  // Estados para lidar com iteração do usuário com o mapa
  const [latitude, setLatitude] = useState(client_latitude);
  const [longitude, setLongitude] = useState(client_longitude);
  const [latitudeDelta, setLatitudeDelta] = useState(0.003);
  const [longitudeDelta, setLongitudeDelta] = useState(0);

  // Estado contendo todas as CTOs existente dentro do raio de busca
  const [arrayCTOs, setArrayCTOs] = useState([]);

  useEffect(() => {
    async function getCTOs() {
      setRefreshing(true);
      const response = await api.get(`cto/${client_latitude}/${client_longitude}?tenant_id=${globalState.state.tenantID}`, {
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${globalState.state.userToken}`,
        },
      },
      );

      var queries_array = [];
      var array_cto = [];
      response.data.map(item => {
        const latitude = parseFloat(item.latitude);
        const longitude = parseFloat(item.longitude);

        array_cto.push(item);
        queries_array.push(axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${client_latitude},${client_longitude}&destinations=${latitude},${longitude}&mode=walking&key=${GOOGLE_MAPS_APIKEY}`));
      });

      await axios.all(queries_array).then(response => {
        response.forEach((element, index) => {
          array_cto[index].distance = element.data.rows[0].elements[0].distance.text;
          array_cto[index].distance_value = element.data.rows[0].elements[0].distance.value;
        });
      });

      // Ordenação do array com mais próximos primeiro
      array_cto.sort(function (a, b) {
        var keyA = a.distance_value,
          keyB = b.distance_value;

        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });

      setArrayCTOs(array_cto);
    }

    getCTOs();
  }, []);

  const swipeOut = () => {
    Animated.timing(swipeAnim, {
      toValue: 150,
      duration: 200
    }).start();
  };

  const swipeIn = () => {
    Animated.timing(swipeAnim, {
      toValue: 0,
      duration: 200
    }).start();
  };

  const request_type = 'Ativação';

  function FloatActionBar(option, number) {
    if (number === null) {
      return Alert.alert('Erro', 'Número não informado');
    }

    if (option === 'open') {
      swipeOut();
    } else {
      swipeIn();
    }
  }

  function openWhatsapp(number) {
    if (number === null) {
      return Alert.alert('Erro', 'Número não informado');
    }
    FloatActionBar('close');

    Linking.openURL(`https://api.whatsapp.com/send?phone=55${number}`);
  }

  function dialCall(number) {
    FloatActionBar('close');

    if (number === null) {
      return Alert.alert('Erro', 'Número não informado');
    }

    let phoneNumber;

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    }
    else {
      phoneNumber = `telprompt:${number}`;
    }

    Linking.openURL(phoneNumber);
  };

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

  useEffect(() => {

  }, [state]);

  async function handleNewDate(event, selectedDate) {
    if (event.type === 'set') {
      setIsDatePickerVisible(false);

      try {
        setIsLoading(true);
        const { id: request_id } = route.params;

        await api.post(`request/${request_id}?tenant_id=${globalState.state.tenantID}`,
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

        const response = await api.post(`request/${request_id}?tenant_id=${globalState.state.tenantID}`,
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
        console.log(e);
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
      const date = format(parseISO(state.fechamento), 'dd/MM/yyyy')
      const hora = format(parseISO(state.fechamento), 'hh:mm:ss')

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
    // Chamados de instalação não permitem abrir os detalhes do cliente
    // porque quando alguém solicita a ativação do serviço, ele ainda não é
    // de fato um cliente
    if (client_id) {
      navigation.navigate('ClientScreen', {
        client_id,
        client_name,
      });
    }
    else {
      const [firstName] = client_name.split(' ');
      ToastAndroid.show(`${firstName} ainda não é um cliente`, ToastAndroid.SHORT);
    }

  }

  async function closeRequest() {
    try {
      const { id: request_id } = route.params;

      const response = await api.post(`request/${request_id}?tenant_id=${globalState.state.tenantID}`,
        {
          action: "close_request",
          employee_id: globalState.state.employee_id,
          request_type: request_type,
          isVisited: isVisited,
          isInstalled: isInstalled,
          isAvailable: isAvailable,
        },
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      onRefresh();
      setIsDialogVisible(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível fechar chamado');
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
      setEmployeeRefreshing(false);
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

        const response = await api.post(`request/${request_id}?tenant_id=${globalState.state.tenantID}`,
          {
            action: "update_employee",
            employee_id: newEmployee.id,
            request_type: request_type,
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

  function getRegionForCoordinates(points) {
    // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;

    // init first point
    ((point) => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map((point) => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX);
    const deltaY = (maxY - minY);

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY
    };
  }

  function handleTraceRoute(dest_lat, dest_lgt) {
    if (dest_lat == null || dest_lgt == null) {
      Alert.alert('Erro', 'Caixa Hermetica sugerida não está no mapa');
    } else {
      const { latitudeDelta, longitudeDelta } = getRegionForCoordinates(arrayCTOs);

      dispatch({
        type: 'traceroute',
        payload: {
          cto_latitude: dest_lat,
          cto_longitude: dest_lgt,
        },
      });

      setLatitude((client_latitude + dest_lat) / 2);
      setLongitude((client_longitude + dest_lgt) / 2);
      setLatitudeDelta(latitudeDelta);
      setLongitudeDelta(longitudeDelta);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigateToClient(state.client_id, state.nome)} style={styles.section_header}>
        <Text style={styles.header_title}>{route.params.nome}</Text>
        <Text style={[styles.sub_text, { textAlign: 'center' }]}>
          {`${route.params.plano === 'nenhum'
            ? 'Nenhum'
            : route.params.plano} | ${route.params.ip === null ? 'Nenhum' : route.params.ip}`
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

            {state.instalado === 'sim' &&
              <View style={[styles.line_container, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View>
                  <Text style={styles.sub_text}>Visitado</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(state.login)}
                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                  >
                    <Text style={[styles.main_text_login_senha, { color: state.visitado === 'sim' ? 'green' : 'red' }]}>{state.visitado === 'sim' ? 'Sim' : 'Não'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.sub_text, { textAlign: 'right' }]}>Instalado</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(state.senha)}
                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                  >
                    <Text style={[styles.main_text_login_senha, { color: state.instalado === 'sim' ? 'green' : 'red' }]}>{state.instalado === 'sim' ? 'Sim' : 'Não'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }

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

            <TouchableOpacity onPress={() => dialCall(state.telefone)}>
              <View style={styles.clickable_line}>
                <View>
                  <Text style={styles.sub_text}>Telefone</Text>
                  <Text style={styles.main_text}>
                    {state.telefone ? state.telefone : 'Não informado'}
                  </Text>
                </View>
                {state.telefone &&
                  <View style={{ justifyContent: 'center' }}>
                    <CallIcon name="call" size={icons.tiny} color="#000" />
                  </View>
                }
              </View>
            </TouchableOpacity>

            <View>
              <TouchableOpacity onPress={() => FloatActionBar('open', state.celular)}>
                <View style={styles.clickable_line}>
                  <View>
                    <Text style={styles.sub_text}>Celular</Text>
                    <Text style={styles.main_text}>
                      {state.celular ? state.celular : 'Não informado'}
                    </Text>
                  </View>
                  {state.celular &&
                    <View style={{ justifyContent: 'center' }}>
                      <CallIcon name="call" size={icons.tiny} color="#000" />
                    </View>
                  }
                </View>
              </TouchableOpacity>
              <Animated.View style={[styles.swiped_options, { width: swipeAnim }]}>
                <TouchableOpacity
                  onPress={() => openWhatsapp(state.celular)}
                >
                  <Icon name="whatsapp" color="green" size={26} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dialCall(state.celular)}
                >
                  <CallIcon name="call" size={26} color="green" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => FloatActionBar('close')}
                  style={{ alignItems: 'center', borderRadius: 5, padding: 5 }}
                >
                  <Icon name="close" size={18} color="#000" />
                </TouchableOpacity>
              </Animated.View>
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

            {state && client_latitude !== null && client_longitude !== null &&
              <View>
                <View style={[styles.cto_line, { borderBottomWidth: 0 }]}>
                  <Text style={styles.sub_text}>Mapa de caixas</Text>
                </View>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={{ height: 400, width: '100%' }}
                  region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: client_latitude,
                      longitude: client_longitude,
                    }}
                    title={client_name}
                  />

                  {arrayCTOs.map(cto => (
                    <Marker
                      key={cto.id}
                      coordinate={{
                        latitude: parseFloat(cto.latitude),
                        longitude: parseFloat(cto.longitude),
                      }}
                      onPress={() => handleTraceRoute(parseFloat(cto.latitude), parseFloat(cto.longitude))}
                    >
                      <Icon name={"access-point-network"} size={icons.small} color="#FF0000" />
                      <Callout tooltip={true}>
                        <View style={{ width: 120, padding: 15, backgroundColor: '#FFF', opacity: 0.8, borderRadius: 10, alignItems: 'center' }}>
                          <Text style={{ fontWeight: "bold", fontSize: 12, color: '#000' }}>{cto.nome}</Text>
                          <Text style={{ color: '#000', fontSize: 10 }}>Distancia: {cto.distance}</Text>
                          <Text style={{ color: '#000', fontSize: 10 }}>Conectados: {cto.connection_amount}</Text>
                        </View>
                      </Callout>
                    </Marker>
                  ))}

                  {_state.dest_latitude !== null &&
                    <MapViewDirections
                      apikey={GOOGLE_MAPS_APIKEY}
                      strokeWidth={8}
                      strokeColor="hotpink"
                      mode="WALKING"
                      origin={{
                        latitude: client_latitude,
                        longitude: client_longitude,
                      }}
                      destination={{
                        latitude: _state.dest_latitude,
                        longitude: _state.dest_longitude,
                      }}
                    />
                  }
                </MapView>
              </View>
            }

            {state.instalado !== 'sim' &&
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

      {isDialogVisible &&
        <Modal
          onBackButtonPress={() => setIsDialogVisible(false)}
          onBackdropPress={() => setIsDialogVisible(false)}
          children={
            <View style={styles.modal_style}>
              <View style={{ height: 35, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Text style={styles.modal_header}>
                  Fechar chamado
                </Text>
                <TouchableOpacity
                  style={{ backgroundColor: '#337AB7', borderRadius: 5, height: '100%', justifyContent: 'center' }}
                  onPress={() => closeRequest()}
                >
                  <Text style={{ marginLeft: 10, marginRight: 10, color: '#FFF', fontFamily: 'Roboto-Bold' }}>Concluir</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 30 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <Text>Visitado</Text>
                  <Switch
                    value={isVisited}
                    trackColor={{ false: "#767577", true: "#337AB7" }}
                    thumbColor={true ? "#f4f3f4" : "#f4f3f4"}
                    onValueChange={() => setIsVisited(!isVisited)}
                  />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <Text>Instalado</Text>
                  <Switch
                    value={isInstalled}
                    trackColor={{ false: "#767577", true: "#337AB7" }}
                    thumbColor={true ? "#f4f3f4" : "#f4f3f4"}
                    onValueChange={() => setIsInstalled(!isInstalled)}
                  />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 }}>
                  <Text>Disponível</Text>
                  <Switch
                    value={isAvailable}
                    trackColor={{ false: "#767577", true: "#337AB7" }}
                    thumbColor={true ? "#f4f3f4" : "#f4f3f4"}
                    onValueChange={() => setIsAvailable(!isAvailable)}
                  />
                </View>
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
    </View >
  );
}
