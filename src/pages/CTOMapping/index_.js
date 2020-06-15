import React, { useState, useEffect, useContext, useReducer } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { store } from '../../store/store';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBPMt-2IYwdXtEw37R8SV1_9RLAMSqqcEw';

export default function CTOMapping({ route }) {
  const globalState = useContext(store);

  const client_latitude = parseFloat(route.params.latidude);
  const client_longitude = parseFloat(route.params.longitude);
  const client_name = route.params.client_name;
  
  const [arrayCTOs, setArrayCTOs] = useState([]);

  const [latitude, setLatitude] = useState(parseFloat(route.params.latidude));
  const [longitude, setLongitude] = useState(parseFloat(route.params.longitude));

  const [latitudeDelta, setLatitudeDelta] = useState(0.01);
  const [longitudeDelta, setLongitudeDelta] = useState(0);

  const [state, dispatch] = useReducer(reducer, {
    origin_latitude: client_latitude,
    origin_longitude: client_longitude,

    dest_latitude: null,
    dest_longitude: null,
  });

  function reducer(state, action) {
    switch (action.type) {
      case 'traceroute':
        return {
          ...state,
          dest_latitude: action.payload.cto_latitude,
          dest_longitude: action.payload.cto_longitude,
        }
    }
  }

  useEffect(() => {
    async function getCTOs() {
      const response = await axios.get(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/cto/${client_latitude}/${client_longitude}`
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
        });
      });

      setArrayCTOs(array_cto);
    }

    getCTOs();
  }, []);

  function handleTraceRoute(dest_lat, dest_lgt) {
    dispatch({ 
      type: 'traceroute',
      payload: {
        cto_latitude: dest_lat,
        cto_longitude: dest_lgt,
      },
    });
  }

  function handleRegionChange({ latitude, longitude, latitudeDelta, longitudeDelta}) {
    setLatitude(latitude);
    setLongitude(longitude);
    setLatitudeDelta(latitudeDelta);
    setLongitudeDelta(longitudeDelta);
  }

  return (
    <>
      <View style={styles.container}>
        <MapView
          onRegionChangeComplete={handleRegionChange}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
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
          {
            arrayCTOs.map((cto) => (
              <Marker
                key={cto.id}
                coordinate={{
                  latitude: parseFloat(cto.latitude),
                  longitude: parseFloat(cto.longitude),
                }}
                onPress={() => handleTraceRoute(parseFloat(cto.latitude), parseFloat(cto.longitude))}
              >
                <Icon name={"access-point-network"} size={30} color="#FF0000"/>
                <Callout tooltip={true}>
                  <View style={{width: 200, padding: 15, backgroundColor: '#000', borderRadius: 10, alignItems: 'center'}}>
                    <Text style={{fontWeight: "bold", fontSize: 30, color: '#FFF'}}>{cto.nome}</Text>
                    <Text style={{color: '#FFF', fontSize: 20}}>Distancia: {cto.distance}</Text>
                    <Text style={{color: '#FFF', fontSize: 20}}>Conectados: {cto.connection_amount}</Text>
                  </View>
                </Callout>
              </Marker>
            ))
          }
          { state.dest_latitude !== null 
            ? 
              (
                <MapViewDirections
                  origin={{
                    latitude: state.origin_latitude,
                    longitude: state.origin_longitude,
                  }}
                  destination={{
                    latitude: state.dest_latitude,
                    longitude: state.dest_longitude, 
                  }}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={8}
                  strokeColor="hotpink"
                  mode="WALKING"
                />
              ) 
            : <></>
          }
        </MapView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});