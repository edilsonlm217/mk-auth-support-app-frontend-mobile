import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
  Platform,
  Linking,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CallIcon from 'react-native-vector-icons/Zocial';
import axios from 'axios';
import Modal from 'react-native-modal';
import { BarChart } from "react-native-chart-kit";

import LocationService from '../../services/location';

import { icons, fonts } from '../../styles/index';

export default function ClientDetails(props, { navigation }) {
  const client_id = props.data;
  const globalState = props.state;

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
    if (LocationService.isGPSEnable()) {
      setIsVisible(true);
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

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadAPI()} />
        }
      >
        <View>
          <View style={styles.clickable_line}>
            <View>
              <Text style={styles.sub_text}>Plano</Text>
              <Text style={[styles.main_text]}>
                {client.plano}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.clickable_line}>
            <View>
              <Text style={styles.sub_text}>Status de equipamento</Text>
              <Text style={[styles.main_text, {
                color: client.equipment_status === 'Online' ? 'green' : 'red'
              }]}>
                {client.equipment_status}
              </Text>
            </View>
          </View>
        </View>

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
                  color: client.bloqueado === 'sim' ? 'red' : 'green',
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
              <Text style={{ color: '#33B7AE', fontWeight: 'bold' }}>Média Diária</Text>
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

          <View style={styles.graph_container}>

            {Object.keys(client).length !== 0 &&
              <BarChart
                data={client.graph_obj}
                width={Dimensions.get("window").width * 85 / 100}
                height={200}
                withInnerLines={false}
                showValuesOnTopOfBars={true}
                withHorizontalLabels={true}
                chartConfig={{
                  backgroundGradientFrom: "#FFF",
                  backgroundGradientFromOpacity: 1,
                  backgroundGradientTo: "#FFF",
                  backgroundGradientToOpacity: 1,
                  barPercentage: 0.7,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                style={{
                  borderRadius: 16,
                  alignSelf: 'center',
                }}
                fromZero={true}
              />
            }
          </View>
        </View>
      </ScrollView>

      <Modal
        onBackButtonPress={handleModalClosing}
        onBackdropPress={handleModalClosing}
        children={
          <View style={styles.modal_style}>
            <Text style={styles.modal_header}>Selecione uma opção...</Text>
            <TouchableOpacity onPress={() => LocationService.navigateToCoordinate(client.coordenadas)} style={styles.modal_btn}>
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
    </>
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
  },

  icon_frame: {
    width: 36,
    height: 36,
    borderWidth: 1.5,
    padding: 5,
    marginRight: 15,

    borderRadius: 5,

    alignItems: 'center',
    justifyContent: 'center',
  },

  graph_container: {
    marginTop: 20,
    marginBottom: 20,

    backgroundColor: '#FFF',
    width: '98%',
    alignSelf: 'center',

    borderRadius: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 4,
  },
});
