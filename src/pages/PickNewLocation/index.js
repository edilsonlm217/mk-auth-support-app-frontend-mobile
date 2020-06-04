import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { View, PermissionsAndroid, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default function PickNewLocation() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

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
        });
      } else {
        Alert.alert('Não foi possível recuperar sua Localização');
      }
    }

    getUserLocation();
  }, []);

  function handleRegionChange({ latitude, longitude }) {
    console.log(latitude);
    console.log(longitude);
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
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
      />
      <View style={styles.mapMarkerContainer}>
        <Icon style={{alignSelf: "center"}} name="location-on" size={40} color="#ad1f1f" />
      
        <View style={styles.bottom_option}>
          <Text style={styles.option_label}>MOVA O MAPA PARA LOCALIZAR</Text>

          <TouchableOpacity style={styles.confirm_btn}>
            <Text style={styles.btn_label} >CONFIRMAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  mapMarkerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottom_option: {
    marginTop: 10,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FFF',
    height: 150,
    width: '100%',

    borderTopWidth: 1,
    borderTopColor: 'red',
  },
  
  option_label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
  },

  confirm_btn: {
    margin: 20,
    marginTop: 30,
    marginLeft: 110,
    marginRight: 110,
    alignItems: 'center',
    height: 50,
    backgroundColor: '#337AB7',
    borderRadius: 25,
  },

  btn_label: {
    color: '#FFF',
    fontWeight: 'bold',
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 15,
  }
});