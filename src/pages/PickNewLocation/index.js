import React, { useState, useEffect, useContext } from 'react';
import MapView from 'react-native-maps';
import { View, PermissionsAndroid, ActivityIndicator, Alert, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import api from '../../services/api';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { store } from '../../store/store';

import styles from './styles';

export default function PickNewLocation({ route, navigation }) {
  const globalState = useContext(store);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [latitudeDelta, setLatitudeDelta] = useState(0.001);
  const [longitudeDelta, setLongitudeDelta] = useState(0.001);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function getUserLocation() {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setIsVisible(true);
        Geolocation.getCurrentPosition(geo_success => {
          const current_longitude = geo_success.coords.longitude;
          const current_latitude = geo_success.coords.latitude;

          setLatitude(current_latitude);
          setLongitude(current_longitude);
          setIsVisible(false);
        }, geo_error => {
          setIsVisible(false);
          Alert.alert('Erro', "Falha ao obter localização");
        }, {
          timeout: 10000,
          enableHighAccuracy: true,
        });
      } else {
        setIsVisible(false);
        Alert.alert('Erro', 'Não foi possível recuperar sua Localização');
      }
    }

    getUserLocation();
  }, []);

  function handleRegionChange({ latitude, longitude, latitudeDelta, longitudeDelta }) {
    setLatitude(latitude);
    setLongitude(longitude);
    setLatitudeDelta(latitudeDelta);
    setLongitudeDelta(longitudeDelta);
  }

  async function updateClientCoordinates() {
    const client_id = route.params.data.id;

    try {
      const response = await api.post(`client/${client_id}?tenant_id=${globalState.state.tenantID}`,
        {
          action: "update_client_location",
          latitude: latitude,
          longitude: longitude,
        },
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`
          },
        }
      );

      if (response.status === 200) {
        ToastAndroid.show("Alteração feita com sucesso!", ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar localização');
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}
        style={styles.map}
        provider="google"
        showsMyLocationButton={true}
        loadingEnabled={true}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        }}
      />
      <View style={styles.mapMarkerContainer}>
        <Icon style={{ alignSelf: "center" }} name="location-on" size={40} color="#ad1f1f" />

        <View style={styles.bottom_option}>
          <Text style={styles.option_label}>MOVA O MAPA PARA AJUSTAR A LOCALIZAÇÃO</Text>

          <View style={styles.confirm_btn_container}>
            <TouchableOpacity onPress={updateClientCoordinates} style={styles.confirm_btn}>
              <Text style={styles.btn_label} >Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        children={
          <View style={styles.modal_style}>
            <ActivityIndicator size="small" color="#0000ff" />
            <Text style={styles.modal_text_style}>
              Obtendo localização...
            </Text>
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
