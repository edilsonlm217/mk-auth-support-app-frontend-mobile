import React, { useState, useEffect, useContext, useReducer } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
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
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/cto`
      );
      
      var queries_array = [];
      var array_cto = [];
      response.data.map(item => {
        const latitude = parseFloat(item.latitude);
        const longitude = parseFloat(item.longitude);

        const d = getDistanceFromLatLonInKm(
          latitude, 
          longitude, 
          client_latitude, 
          client_longitude
        );

        if (d <= 0.3) {
          array_cto.push(item);
          queries_array.push(axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${client_latitude},${client_longitude}&destinations=${latitude},${longitude}&mode=walking&key=${GOOGLE_MAPS_APIKEY}`));
        }
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

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  function handleTraceRoute(dest_lat, dest_lgt) {
    dispatch({ 
      type: 'traceroute',
      payload: {
        cto_latitude: dest_lat,
        cto_longitude: dest_lgt,
      },
    });
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
            description={`Distancia: ${cto.distance}`}
            onPress={() => handleTraceRoute(parseFloat(cto.latitude), parseFloat(cto.longitude))}
          >
            <Icon name={"access-point-network"} size={30} color="#FF0000"/>
          </Marker>
         ))
       }
       {
          state.dest_latitude !== null 
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