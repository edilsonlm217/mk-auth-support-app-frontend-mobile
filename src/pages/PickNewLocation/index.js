import React, { useState, useEffect, useContext } from 'react';
import MapView from 'react-native-maps';
import { View, PermissionsAndroid, StyleSheet, Alert, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { store } from '../../store/store';

import styles from './styles';

export default function PickNewLocation({ route, navigation }) {
  const globalState = useContext(store);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [latitudeDelta, setLatitudeDelta] = useState(0.001);
  const [longitudeDelta, setLongitudeDelta] = useState(0.001);

  useEffect(() => {
    async function getUserLocation() {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(geo_success => {      
          const current_longitude = geo_success.coords.longitude;
          const current_latitude = geo_success.coords.latitude;
          
          setLatitude(current_latitude);
          setLongitude(current_longitude);
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
    }

    getUserLocation();
  }, []);

  function handleRegionChange({ latitude, longitude, latitudeDelta, longitudeDelta}) {
    setLatitude(latitude);
    setLongitude(longitude);
    setLatitudeDelta(latitudeDelta);
    setLongitudeDelta(longitudeDelta);
  }

  async function updateClientCoordinates() {
    const client_id = route.params.data.id;

    try {
      const response = await axios.post(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/client/${client_id}`, {
          latitude: latitude,
          longitude: longitude,
        }, 
        {
          timeout: 2500,
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

  return  (
    <View style={styles.container}>
      <MapView
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}
        style={styles.map}
        provider="google"
        showsMyLocationButton={true}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        }}
      />
      <View style={styles.mapMarkerContainer}>
        <Icon style={{alignSelf: "center"}} name="location-on" size={40} color="#ad1f1f" />
      
        <View style={styles.bottom_option}>
          <Text style={styles.option_label}>MOVA O MAPA PARA AJUSTAR A LOCALIZAÇÃO</Text>

          <TouchableOpacity onPress={updateClientCoordinates} style={styles.confirm_btn}>
            <Text style={styles.btn_label} >CONFIRMAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
