import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { store } from '../../store/store';

export default function CTOMapping({ route }) {
  const [arrayCTOs, setArrayCTOs] = useState([]);

  const globalState = useContext(store);
  const GOOGLE_MAPS_APIKEY = 'AIzaSyBPMt-2IYwdXtEw37R8SV1_9RLAMSqqcEw';
  
  const client_latitude = parseFloat(route.params.latidude);
  const client_longitude = parseFloat(route.params.longitude);
  const client_name = route.params.client_name;

  useEffect(() => {
    async function getCTOs() {
      const response = await axios.get(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/cto`
      );

      setArrayCTOs(response.data);
    }

    getCTOs();
  }, []);

  function handleTraceRoute() {

  }

  return  (
    <View style={styles.container}>
      <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       region={{
         latitude: client_latitude,
         longitude: client_longitude,
         latitudeDelta: 0.01,
         longitudeDelta: 0,
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
            title={cto.nome}
            description={'Distancia: 600 metros'}
            onPress={() => handleTraceRoute}
          >
            <Icon name={"access-point-network"} size={30} color="#FF0000"/>
          </Marker>
         ))
       }
       {/* <MapViewDirections
        origin={origin}
        destination={destination}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={8}
        strokeColor="hotpink"
        waypoints={[{
          latitude: -3.078859,
          longitude: -59.970789,
        }]}
      /> */}
     </MapView>
     <View
      style={{position: "absolute", bottom: 50}}
    >
      <Text>Hello World</Text>
    </View>
    </View>
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