import React, { useState, useEffect, useContext, useReducer } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ToastAndroid, RefreshControl } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import Modal from 'react-native-modal';
import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { store } from '../../store/store';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBPMt-2IYwdXtEw37R8SV1_9RLAMSqqcEw';

export default function CTOMapping({ route, navigation }) {
  // Estes dados do cliente nunca tem seus valores alterados
  const client_latitude = parseFloat(route.params.latidude);
  const client_longitude = parseFloat(route.params.longitude);
  const client_id = route.params.client_id;
  const client_name = route.params.client_name;
  
  // Estados para lidar com iteração do usuário com o mapa
  const [latitude, setLatitude] = useState(client_latitude);
  const [longitude, setLongitude] = useState(client_longitude);
  const [latitudeDelta, setLatitudeDelta] = useState(0.01);
  const [longitudeDelta, setLongitudeDelta] = useState(0);

  // Estado contendo todas as CTOs existente dentro do raio de busca
  const [arrayCTOs, setArrayCTOs] = useState([]);

  // Declaração do estado global da aplicação
  const globalState = useContext(store);

  // Estado que controla todo o calculo de rotas
  const [state, dispatch] = useReducer(reducer, {
    dest_latitude: null,
    dest_longitude: null,
  });

  // Estado que guarda os dados da CTO sugerida pelo administrador
  const [suggestedCTO, setSuggestedCTO] = useState(null);

  // Estado que guarda a informação de qual CTO o usuário selecionou
  const [selectedBtn, setSelectedBtn] = useState('');

  // Estado que controla a visibilidade do modal de confirmação da alteração de CTO
  const [isVisible, setIsVisible] = useState(false);

  // Estado para controlar o refresh controller
  const [refreshing, setRefreshing] = useState(false);

  function reducer(state, action) {
    switch (action.type) {
      case 'traceroute':
        return {
          dest_latitude: action.payload.cto_latitude,
          dest_longitude: action.payload.cto_longitude,
        }
    }
  }

  function handleRegionChange({ latitude, longitude, latitudeDelta, longitudeDelta}) {
    setLatitude(latitude);
    setLongitude(longitude);
    setLatitudeDelta(latitudeDelta);
    setLongitudeDelta(longitudeDelta);
  }

  function handleTraceRoute(dest_lat, dest_lgt) {
    if (dest_lat == null || dest_lgt == null) {
      Alert.alert('Erro', 'Caixa Hermetica sugerida não está no mapa');
    } else {
      dispatch({ 
        type: 'traceroute',
        payload: {
          cto_latitude: dest_lat,
          cto_longitude: dest_lgt,
        },
      });
    }
  }

  async function handleUpdateCTO() {
    const response_update = await axios.post(
      `http://${globalState.state.server_ip}:${globalState.state.server_port}/client/${client_id}`,
      {
        new_cto: selectedBtn,
      },
      {
        timeout: 2500,
        headers: {
          Authorization: `Bearer ${globalState.state.userToken}`,
        },
      },
    );
    
    if (response_update.status === 200) {
      ToastAndroid.show("CTO alterada com sucesso!", ToastAndroid.SHORT);
      setIsVisible(false);
      navigation.goBack();
    }
  }

  function handleModalClosing() {
    setSelectedBtn('');
    setIsVisible(false);
  }

  function handleSelection(cto) {
    if (selectedBtn === cto.nome && cto.nome !== suggestedCTO?.nome) {
      setIsVisible(true);
    } else {
      setSelectedBtn(cto.nome);
      handleTraceRoute(parseFloat(cto.latitude), parseFloat(cto.longitude))
    }
  }

  useEffect(() => {
    async function loadSuggestedCTOData() {
      const client = await axios.get(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/client/${client_id}`, {
          timeout: 2500,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );
      
      const { caixa_herm } = client.data;
      
      if (caixa_herm) {
        const current_client_cto = await axios.get(
          `http://${globalState.state.server_ip}:${globalState.state.server_port}/cto/${caixa_herm}`, {
            timeout: 2500,
            headers: {
              Authorization: `Bearer ${globalState.state.userToken}`,
            },
          },
        );
  
        const route_response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${client_latitude},${client_longitude}&destinations=${current_client_cto.data.latitude},${current_client_cto.data.longitude}&mode=walking&key=${GOOGLE_MAPS_APIKEY}`)
        
        current_client_cto.data.distance = route_response.data.rows[0].elements[0].distance.text;
        current_client_cto.data.distance_value = route_response.data.rows[0].elements[0].distance.value;
        
        setSuggestedCTO(current_client_cto.data);
      }
    }

    loadSuggestedCTOData();
  }, []);

  useEffect(() => {
    async function getCTOs() {
      setRefreshing(true);
      const response = await axios.get(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/cto/${client_latitude}/${client_longitude}`, {
          timeout: 2500,
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
      array_cto.sort(function(a, b) {
        var keyA = a.distance_value,
          keyB = b.distance_value;
  
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });

      setArrayCTOs(array_cto);
      setRefreshing(false);
    }

    getCTOs();
  }, [suggestedCTO]);
  
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
          { arrayCTOs.map((cto) => ( 
            cto.id !== suggestedCTO?.id &&
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
          ))}
          { suggestedCTO !== null &&
            <Marker
              key={suggestedCTO.id}
              coordinate={{
                latitude: parseFloat(suggestedCTO.latitude),
                longitude: parseFloat(suggestedCTO.longitude),
              }}
              onPress={() => handleTraceRoute(parseFloat(suggestedCTO.latitude), parseFloat(suggestedCTO.longitude))}
            >
              <Icon name={"access-point-network"} size={30} color="#3842D2"/>
              <Callout tooltip={true}>
                <View style={{width: 200, padding: 15, backgroundColor: '#000', borderRadius: 10, alignItems: 'center'}}>
                  <Text style={{fontWeight: "bold", fontSize: 30, color: '#FFF'}}>{suggestedCTO.nome}</Text>
                  <Text style={{color: '#FFF', fontSize: 20}}>Distancia: {suggestedCTO.distance}</Text>
                  <Text style={{color: '#FFF', fontSize: 20}}>Conectados: {suggestedCTO.connection_amount}</Text>
                </View>
              </Callout>
            </Marker>
          }
          { state.dest_latitude !== null && 
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
                latitude: state.dest_latitude,
                longitude: state.dest_longitude, 
              }}
            />
          }
        </MapView>
      </View>
      <View style={styles.bottom_menu}>
        { suggestedCTO !== null 
          ? 
            <>
              <Text style={styles.main_title}>Caixa Sugerida</Text>
              <TouchableOpacity 
                style={suggestedCTO?.nome === selectedBtn ? styles.suggested_card_selected : styles.suggested_card}
                onPress={() => handleSelection(suggestedCTO)} 
              >
                <View style={styles.card_name}>
                  <View style={styles.icon_container}>
                    <Icon name={"access-point-network"} size={30} color="#000"/>
                  </View>
                  <Text style={styles.card_title}>
                    {suggestedCTO && suggestedCTO.nome }
                  </Text>
                </View>
                <View style={styles.distance_container}>
                  <Text style={styles.card_distance}>
                    {suggestedCTO ? suggestedCTO.distance : ''}
                  </Text>
                  <Text style={styles.connection_amount}>
                    {suggestedCTO ? `${suggestedCTO.connection_amount} conectados` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
          </>
          : 
            <>
              <Text style={[styles.main_title, { marginBottom: 10, color: '#AFAFAF'}]}>
                Nenhuma caixa sugerida
              </Text>
            </>
        }
        
        <Text style={styles.main_title}>Mais opções</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} />
          }
        >
          <View style={styles.sub_cards_container}>
            {
              arrayCTOs.map(cto => (
                cto.nome === suggestedCTO?.nome ? <></> :
                selectedBtn !== cto.nome 
                ?
                  <TouchableOpacity 
                    key={cto.nome} 
                    onPress={() => handleSelection(cto)} 
                    style={styles.sub_cards}
                  >
                    <View style={styles.main_line}>
                      <Text style={styles.sub_card_title}>{cto.nome}</Text>
                      <Text style={styles.sub_card_title}>{cto.distance}</Text>
                    </View>
                    <Text style={styles.sub_line}>{cto.connection_amount} Conectados</Text>
                  </TouchableOpacity>
                :
                  <TouchableOpacity 
                    key={cto.nome} 
                    onPress={() => handleSelection(cto)} 
                    style={styles.sub_cards_selected}
                  >
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
      <Modal
        onBackButtonPress={handleModalClosing}
        onBackdropPress={handleModalClosing}
        children={
          <View style={styles.modal_style}>
            <Text style={{fontSize: 18, textAlign: "center", marginBottom: 10}}>
              Você está prestes a alterar a caixa hermética sugerida pelo administrador. Deseja continuar?
            </Text>
            <TouchableOpacity style={styles.modal_cancel_btn}>
              <Text onPress={handleModalClosing} style={styles.modal_btn_style}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdateCTO} style={styles.modal_confirm_btn}>
              <Text style={styles.modal_btn_style}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        }
        isVisible={isVisible}
        style={{margin: 0}}
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

  suggested_card_selected: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 15,
    marginTop: 10,
    borderRadius: 20,
    borderColor: '#3842D2',
    borderWidth: 1,
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

  modal_style: {
    width: 300,
    backgroundColor: "#FFF",
    alignSelf: "center",
    borderWidth: 0,
    borderRadius: 10,
    padding: 20,
    paddingTop: 10,
  },

  modal_header: {
    fontWeight: "bold",
    fontSize: 18,
    width: '100%',
    marginBottom: 5,
  },

  modal_confirm_btn: {
    width: '100%',
    height: 40,
    marginTop: 10,
    display: "flex",
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#3842D2',
    
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 4,
  },

  modal_cancel_btn: {
    width: '100%',
    height: 40,
    marginTop: 10,
    display: "flex",
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#000',
    
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
    fontSize: 18,
    textAlign: "center",
    color: '#FFF',
  },
});