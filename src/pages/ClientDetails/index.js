import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
  PermissionsAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import openMap from 'react-native-open-maps';
import AppHeader from '../../components/AppHeader/index';
import axios from 'axios';

import { icons, fonts } from '../../styles/index';
import { store } from '../../store/store';

export default function ClientDetails({ navigation, route }) {
  const { client_id } = route.params;

  const globalState = useContext(store);

  const [client, setClient] = useState({});
  const [refreshing, setRefreshing] = useState(false);


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
      OpenCoordinate(client.coordenadas);
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

  return (
    <View style={styles.container}>
      <AppHeader
        navigation={navigation}
        label="Detalhes"
        altura="21%"
        backButton={true}
      />
      <ScrollView
        style={styles.section_container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadAPI} />
        }

      >

        <View>
          <View style={styles.clickable_line}>
            <View>
              <Text style={styles.sub_text}>Cliente</Text>
              <Text style={styles.main_text}>
                {client.nome}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.clickable_line}>
            <View>
              <Text style={styles.sub_text}>Telefone</Text>
              <Text style={styles.main_text}>
                {client.fone ? client.fone : 'Não informado'}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.clickable_line}>
            <View>
              <Text style={styles.sub_text}>Celular</Text>
              <Text style={styles.main_text}>
                {client.celular ? client.celular : 'Não informado'}
              </Text>
            </View>
          </View>
        </View>

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

      </ScrollView>
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

  clickable_line: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: "space-between"
  },

});