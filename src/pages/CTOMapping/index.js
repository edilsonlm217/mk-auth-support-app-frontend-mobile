import React, { useState, useEffect, useContext, useReducer } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

  const [selectedBtn, setSelectedBtn] = useState('');

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

  function handleSelection(cto_name) {
    if (selectedBtn === cto_name) {
      setSelectedBtn('');
    } else {
      setSelectedBtn(cto_name);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.map_container}>
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
      <View style={styles.bottom_menu}>
        <Text style={styles.main_title}>Caixa Sugerida</Text>
        
        <TouchableOpacity style={styles.suggested_card}>
          <View style={styles.card_name}>
            <View style={styles.icon_container}>
              <Icon name={"access-point-network"} size={30} color="#000"/>
            </View>
            <Text style={styles.card_title}>CTO 256</Text>
          </View>
          <View style={styles.distance_container}>
            <Text style={styles.card_distance}>0.5km</Text>
            <Text style={styles.connection_amount}>7 conectados</Text>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.main_title}>Mais opções</Text>
        <ScrollView>
          <View style={styles.sub_cards_container}>
            {
              arrayCTOs.map(cto => (
                selectedBtn !== cto.nome 
                ?
                  <TouchableOpacity key={cto.nome} onPress={() => handleSelection(cto.nome)} style={styles.sub_cards}>
                    <View style={styles.main_line}>
                      <Text style={styles.sub_card_title}>{cto.nome}</Text>
                      <Text style={styles.sub_card_title}>{cto.distance}</Text>
                    </View>
                    <Text style={styles.sub_line}>{cto.connection_amount} Conectados</Text>
                  </TouchableOpacity>
                :
                  <TouchableOpacity key={cto.nome} onPress={() => handleSelection(cto.nome)} style={styles.sub_cards_selected}>
                    <View style={styles.main_line_selected}>
                      <Text style={styles.sub_card_title_selected}>{cto.nome}</Text>
                      <Icon name={"checkbox-marked-circle"} size={30} color="#FFF"/>
                    </View>
                  </TouchableOpacity>
                )
              )
            }
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map_container: {
    flex: 1,
  },
  
  map: {
    height: "100%",
  },

  bottom_menu: {
    minHeight: 230,
    maxHeight: 370,
    backgroundColor: '#FFF',
    padding: 15,
    borderTopWidth: 0.7,
    borderTopColor: "red",
  },

  main_title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  
  suggested_card: {
    borderWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 15,
    marginTop: 10,
    borderRadius: 20,
    borderColor: '#AFAFAF',
  },

  card_name: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon_container: {
    borderWidth: 0.5,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  distance_container: {
    alignItems: "flex-end",
  },

  card_title: {
    fontWeight: "bold",
    fontSize: 20,
  },

  sub_card_title: {
    fontWeight: "bold",
    fontSize: 18,
  },

  sub_card_title_selected: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#FFF",
  },

  card_distance: {
    fontWeight: "bold",
    fontSize: 20,
  },

  connection_amount: {
    color: '#AFAFAF',
  },

  sub_cards_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  sub_cards: {
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 20,
    borderColor: '#AFAFAF',
    minWidth: 180,
    marginTop: 15,
    height: 65,
  },

  sub_cards_selected: {
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 20,
    borderColor: '#AFAFAF',
    minWidth: 180,
    marginTop: 15,
    height: 65,
    backgroundColor: "#3842D2",
  },

  main_line: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  main_line_selected: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: '100%',
  },

  sub_line: {
    color: '#AFAFAF',
  },
});