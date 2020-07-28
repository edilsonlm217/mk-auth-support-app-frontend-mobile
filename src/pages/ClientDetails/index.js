import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CallIcon from 'react-native-vector-icons/Zocial';
import Geolocation from '@react-native-community/geolocation';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import openMap from 'react-native-open-maps';
import AppHeader from '../../components/AppHeader/index';
import axios from 'axios';
import Modal from 'react-native-modal';

import { icons, fonts } from '../../styles/index';
import { store } from '../../store/store';

export default function ClientDetails({ navigation, route }) {
  const { client_id } = route.params;

  const globalState = useContext(store);

  const [client, setClient] = useState({});

  const [refreshing, setRefreshing] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  async function loadAPI() {
    try {
      setRefreshing(true);

      const response = await axios.get(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/client/${client_id}`,
        {
          timeout: 2500,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      setClient(response.data);
      setRefreshing(false);
    } catch {
      setRefreshing(false);
      Alert.alert('Erro', 'Não foi possível comunicar com a API');
    }
  }

  useEffect(() => { loadAPI() }, []);

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

  function dialCall(number) {
    if (number === null) {
      return Alert.alert('Errp', 'Número não informado');
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

  function handleNavigateNewLocationPicker() {
    setIsVisible(false);
    navigation.navigate('UpdateClienteLocation', {
      data: {
        id: client.client_id,
      }
    });
  }

  function handleModalClosing() {
    setIsVisible(false);
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

  return (
    <View style={styles.container}>
      <AppHeader
        navigation={navigation}
        label="Detalhes"
        altura="21%"
        backButton={true}
      />
      <View
        style={styles.section_container}
      >
        <View style={styles.section_header}>
          <Text style={styles.header_title}>{client.nome}</Text>
          <Text style={[styles.sub_text, { textAlign: 'center' }]}>{client.plano}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={[
                styles.client_status,
                {
                  color: client.equipment_status === 'Online' ? 'green' : 'red'
                }
              ]}
            >
              {client.equipment_status}
            </Text>
            <Icon
              name="circle"
              size={10}
              color={client.equipment_status === 'Online' ? 'green' : 'red'}
              style={{ marginTop: 2 }}
            />
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadAPI} />
          }
        >

          <TouchableOpacity onPress={() => dialCall(client.fone)}>
            <View style={styles.clickable_line}>
              <View>
                <Text style={styles.sub_text}>Telefone</Text>
                <Text style={styles.main_text}>
                  {client.fone ? client.fone : 'Não informado'}
                </Text>
              </View>
              {client.fone &&
                <View style={{ justifyContent: 'center' }}>
                  <CallIcon name="call" size={icons.tiny} color="#000" />
                </View>
              }
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => dialCall(client.celular)}>
            <View style={styles.clickable_line}>
              <View>
                <Text style={styles.sub_text}>Celular</Text>
                <Text style={styles.main_text}>
                  {client.celular ? client.celular : 'Não informado'}
                </Text>
              </View>
              {client.celular &&
                <View style={{ justifyContent: 'center' }}>
                  <CallIcon name="call" size={icons.tiny} color="#000" />
                </View>
              }
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleModalOpening}>
            <View style={styles.clickable_line}>
              <View>
                <Text style={styles.sub_text}>Endereço</Text>
                <Text style={styles.main_text}>
                  {`${client.endereco_res}, ${client.numero_res} - ${client.bairro_res}`}
                </Text>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Icon name="navigation" size={icons.tiny} color="#000" />
              </View>
            </View>
          </TouchableOpacity>

          <View>
            <View style={styles.clickable_line}>
              <View>
                <Text style={styles.sub_text}>Status Financeiro</Text>
                <Text
                  style={[styles.main_text, {
                    color: client.bloqueado === 'sim' ? 'red' : '',
                  }]}
                >
                  {client.bloqueado === 'sim' ? 'Bloqueado' : 'Liberado'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.line_container}>
            <Text style={styles.sub_text}>Login e senha</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.main_text_login_senha}>{client.login}</Text>
              <Text style={styles.main_text_login_senha}>{client.senha}</Text>
            </View>
          </View>

          <View>
            <View style={styles.clickable_line}>
              <View>
                <Text style={styles.sub_text}>Última conexão</Text>
                <Text style={styles.main_text} >
                  {client.current_user_connection}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.consumption_section}>

            <View style={[styles.clickable_line]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.icon_frame, { borderColor: '#337AB7' }]}>
                  <MaterialIcon name="data-usage" size={icons.tiny} color="#337AB7" />
                </View>
                <Text style={{ color: '#337AB7', fontWeight: 'bold' }}>Trafego Atual</Text>
              </View>
              <Text
                style={{ textAlignVertical: 'center', fontWeight: 'bold' }}
              >
                {`${client.current_data_usage} Gb`}
              </Text>
            </View>

            <View style={[styles.clickable_line]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.icon_frame, { borderColor: '#33B7AE' }]}>
                  <Icon name="clock-outline" size={icons.tiny} color="#33B7AE" />
                </View>
                <Text style={{ color: '#33B7AE', fontWeight: 'bold' }}>Média Diárial</Text>
              </View>
              <Text style={{ textAlignVertical: 'center', fontWeight: 'bold' }}>{`${client.consuption_average} Gb`}</Text>
            </View>

            <View style={[styles.clickable_line]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.icon_frame, { borderColor: '#B78633' }]}>
                  <Icon name="chart-line-variant" size={icons.tiny} color="#B78633" />
                </View>
                <Text style={{ color: '#B78633', fontWeight: 'bold' }}>Consumo Estimado</Text>
              </View>
              <Text style={{ textAlignVertical: 'center', fontWeight: 'bold' }}>{`${client.expected_consuption} Gb`}</Text>
            </View>

          </View>
        </ScrollView>
      </View>

      <Modal
        onBackButtonPress={handleModalClosing}
        onBackdropPress={handleModalClosing}
        children={
          <View style={styles.modal_style}>
            <Text style={styles.modal_header}>Selecione uma opção...</Text>
            <TouchableOpacity onPress={() => OpenCoordinate(client.coordenadas)} style={styles.modal_btn}>
              <Text style={styles.modal_btn_style}>Navegar até cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigateNewLocationPicker(client.coordenadas)} style={styles.modal_btn}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#337AB7',
  },

  section_container: {
    backgroundColor: '#FFF',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },

  main_text: {
    fontWeight: "bold",
    fontSize: fonts.regular,
    minWidth: '90%',
    maxWidth: '90%',
  },

  sub_text: {
    fontSize: fonts.small,
    color: '#989898',
  },

  main_text_login_senha: {
    fontWeight: "bold",
    fontSize: fonts.regular,
  },

  line_container: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  clickable_line: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: "space-between"
  },

  modal_style: {
    width: '100%',
    maxWidth: 275,
    backgroundColor: "#FFF",
    alignSelf: "center",
    borderWidth: 0,
    borderRadius: 10,
    padding: 20,
    paddingTop: 10,
    marginLeft: 30,
    marginRight: 30,
  },

  modal_header: {
    fontWeight: "bold",
    fontSize: fonts.medium,
    width: '100%',
    marginBottom: 10,
  },

  modal_btn: {
    width: '100%',
    height: 35,
    marginTop: 15,
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
    fontSize: fonts.medium,
    paddingLeft: 15,
    textAlign: "center",
  },

  header_title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: fonts.regular,
  },

  client_status: {
    fontSize: fonts.small,
    textAlign: 'center',
    marginRight: 5
  },

  section_header: {
    margin: 10,
    marginTop: 0,
  },

  consumption_section: {
    marginTop: 25,
  },

  icon_frame: {
    borderWidth: 1.5,
    padding: 5,
    marginRight: 15,

    borderRadius: 5,
  },
});
