import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ToastAndroid,
  ScrollView,
  Platform,
  Linking,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RefreshIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-community/clipboard';
import CallIcon from 'react-native-vector-icons/Zocial';
import { BarChart } from 'react-native-chart-kit';
import Dialog from 'react-native-dialog';
import Modal from 'react-native-modal';
import api from '../../services/api';

import LocationService from '../../services/location';

import { icons, fonts } from '../../styles/index';

export default function ClientDetails(props) {
  const globalState = props.state;
  const { server_ip, server_port, userToken } = globalState.state;

  const clientState = props.clientState;
  const { client } = clientState.state;
  const { setIsLoading, setClientData } = clientState.methods;

  const [isVisible, setIsVisible] = useState(false);

  const [isResetMacDialogVisible, setIsResetMacDialogVisible] = useState(false);

  const swipeAnim = useRef(new Animated.Value(0)).current;

  const swipeOut = () => {
    Animated.timing(swipeAnim, {
      toValue: 150,
      duration: 200,
    }).start();
  };

  const swipeIn = () => {
    Animated.timing(swipeAnim, {
      toValue: 0,
      duration: 200,
    }).start();
  };

  async function loadAPI() {
    try {
      setIsLoading();

      const response = await api.get(
        `client/${client.id}?tenant_id=${globalState.state.tenantID}`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      setClientData(response.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível comunicar com a API');
    }
  }

  function handleModalOpening() {
    if (LocationService.isGPSEnable()) {
      setIsVisible(true);
    }
  }

  function FloatActionBar(option, number) {
    if (number === null) {
      return Alert.alert('Erro', 'Número não informado');
    }

    if (option === 'open') {
      swipeOut();
    } else {
      swipeIn();
    }
  }

  function openWhatsapp(number) {
    if (number === null) {
      return Alert.alert('Erro', 'Número não informado');
    }
    FloatActionBar('close');

    Linking.openURL(`https://api.whatsapp.com/send?phone=55${number}`);
  }

  function dialCall(number) {
    FloatActionBar('close');

    if (number === null) {
      return Alert.alert('Erro', 'Número não informado');
    }

    let phoneNumber;

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }

    Linking.openURL(phoneNumber);
  }

  function copyToClipboard(text) {
    Clipboard.setString(text);
    ToastAndroid.show('Copiado para o clipboard', ToastAndroid.SHORT);
  }

  function getMACAddressStatus() {
    const { mac, automac } = clientState.state.client;

    if (mac === null && automac === 'sim') {
      return 'Carregando...';
    }

    if (mac === null && automac === 'nao') {
      return 'Não informado';
    }

    return mac;
  }

  async function handleMACRefreshing() {
    await api.post(
      `client/${client.id}?tenant_id=${globalState.state.tenantID}`,
      {
        automac: true,
        action: 'update_client',
      },
      {
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    setIsResetMacDialogVisible(false);
    ToastAndroid.show('Alteração solicitada', ToastAndroid.SHORT);
    loadAPI();
  }

  return (
    <>
      <ScrollView
        onScrollBeginDrag={() => FloatActionBar('close')}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={clientState.state.isLoading}
            onRefresh={() => loadAPI()}
          />
        }>
        {clientState.state.isLoading === false && (
          <>
            <View>
              <View style={styles.clickable_line}>
                <View>
                  <Text style={styles.sub_text}>Status de conexão</Text>
                  <Text
                    style={[
                      styles.main_text,
                      {
                        color:
                          clientState.state.client.equipment_status === 'Online'
                            ? 'green'
                            : 'red',
                      },
                    ]}>
                    {clientState.state.client.equipment_status}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.sub_text, { textAlign: 'right' }]}>
                    Status Financeiro
                  </Text>
                  <Text
                    style={[
                      styles.main_text,
                      {
                        color:
                          clientState.state.client.bloqueado === 'sim'
                            ? 'red'
                            : 'green',
                        textAlign: 'right',
                      },
                    ]}>
                    {clientState.state.client.finance_state}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View style={styles.clickable_line}>
                <View>
                  <Text style={styles.sub_text}>Usuário</Text>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(clientState.state.client.login)
                    }>
                    <Text style={styles.main_text_login_senha}>
                      {clientState.state.client.login}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={[styles.sub_text, { textAlign: 'right' }]}>
                    Senha
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(clientState.state.client.senha)
                    }>
                    <Text style={styles.main_text_login_senha}>
                      {clientState.state.client.senha}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.line_container}>
              <Text style={styles.sub_text}>Endereço IP</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(clientState.state.client.ip)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.main_text_login_senha}>
                  {clientState.state.client.ip
                    ? clientState.state.client.ip
                    : 'Não informado'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setIsResetMacDialogVisible(true)}>
              <View style={styles.clickable_line}>
                <View>
                  <Text style={styles.sub_text}>Endereço MAC</Text>
                  <Text style={styles.main_text}>{getMACAddressStatus()}</Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <RefreshIcon name="refresh" size={icons.tiny} color="#000" />
                </View>
              </View>
            </TouchableOpacity>

            <View>
              <View style={styles.clickable_line}>
                <View style={{ width: '100%' }}>
                  <Text style={styles.sub_text}>Plano</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[styles.main_text, { flex: 0, marginRight: 10 }]}>
                      {clientState.state.client.plano}
                    </Text>
                    {clientState.state.client.status_corte === 'down' && (
                      <View style={styles.down_badge}>
                        <Text style={{ fontFamily: 'Roboto-Light' }}>Down</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* <TouchableOpacity onPress={() => props.navigation.navigate('CTO_Details')}> */}
            <View style={styles.clickable_line}>
              <View>
                <Text style={styles.sub_text}>Caixa atual</Text>
                <Text style={styles.main_text_login_senha}>
                  {clientState.state.client.caixa_herm !== null
                    ? clientState.state.client.caixa_herm
                    : 'Nenhuma'}
                </Text>
              </View>
              {/* <View style={{ justifyContent: 'center' }}>
                  <Icon name="chevron-right" color="#000" size={26} />
                </View> */}
            </View>
            {/* </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => dialCall(clientState.state.client.fone)}>
              <View style={styles.clickable_line}>
                <View>
                  <Text style={styles.sub_text}>Telefone</Text>
                  <Text style={styles.main_text}>
                    {clientState.state.client.fone
                      ? clientState.state.client.fone
                      : 'Não informado'}
                  </Text>
                </View>
                {clientState.state.client.fone && (
                  <View style={{ justifyContent: 'center' }}>
                    <CallIcon name="call" size={icons.tiny} color="#000" />
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                onPress={() =>
                  FloatActionBar('open', clientState.state.client.celular)
                }>
                <View style={styles.clickable_line}>
                  <View>
                    <Text style={styles.sub_text}>Celular</Text>
                    <Text style={styles.main_text}>
                      {clientState.state.client.celular
                        ? clientState.state.client.celular
                        : 'Não informado'}
                    </Text>
                  </View>
                  {clientState.state.client.celular && (
                    <View style={{ justifyContent: 'center' }}>
                      <CallIcon name="call" size={icons.tiny} color="#000" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <Animated.View
                style={[styles.swiped_options, { width: swipeAnim }]}>
                <TouchableOpacity
                  onPress={() =>
                    openWhatsapp(clientState.state.client.celular)
                  }>
                  <Icon name="whatsapp" color="green" size={26} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dialCall(clientState.state.client.celular)}>
                  <CallIcon name="call" size={26} color="green" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => FloatActionBar('close')}
                  style={{ alignItems: 'center', borderRadius: 5, padding: 5 }}>
                  <Icon name="close" size={18} color="#000" />
                </TouchableOpacity>
              </Animated.View>
            </View>

            <TouchableOpacity
              onPress={() =>
                LocationService.navigateToCoordinate(
                  clientState.state.client.coordenadas,
                )
              }>
              <View style={styles.clickable_line}>
                <View>
                  <Text style={styles.sub_text}>Endereço</Text>
                  <Text style={[styles.main_text, { maxWidth: '90%' }]}>
                    {`${clientState.state.client.endereco_res}, ${
                      clientState.state.client.numero_res
                    } - ${clientState.state.client.bairro_res}`}
                  </Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Icon name="navigation" size={icons.tiny} color="#000" />
                </View>
              </View>
            </TouchableOpacity>

            <View>
              <View
                style={[
                  styles.clickable_line,
                  { borderBottomWidth: 0, marginBottom: 10 },
                ]}>
                <View>
                  <Text style={styles.sub_text}>Última conexão</Text>
                  <Text style={styles.main_text}>
                    {clientState.state.client.current_user_connection}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.consumption_section}>
              <View style={[styles.clickable_line]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.icon_frame, { borderColor: '#337AB7' }]}>
                    <MaterialIcon
                      name="data-usage"
                      size={icons.tiny}
                      color="#337AB7"
                    />
                  </View>
                  <Text style={{ color: '#337AB7', fontWeight: 'bold' }}>
                    Trafego Atual
                  </Text>
                </View>
                <Text
                  style={{ textAlignVertical: 'center', fontWeight: 'bold' }}>
                  {`${clientState.state.client.current_data_usage} Gb`}
                </Text>
              </View>

              <View style={[styles.clickable_line]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.icon_frame, { borderColor: '#33B7AE' }]}>
                    <Icon
                      name="clock-outline"
                      size={icons.tiny}
                      color="#33B7AE"
                    />
                  </View>
                  <Text style={{ color: '#33B7AE', fontWeight: 'bold' }}>
                    Média Diária
                  </Text>
                </View>
                <Text
                  style={{
                    textAlignVertical: 'center',
                    fontWeight: 'bold',
                  }}>{`${
                  clientState.state.client.consuption_average
                } Gb`}</Text>
              </View>

              <View style={[styles.clickable_line, { borderBottomWidth: 0 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.icon_frame, { borderColor: '#B78633' }]}>
                    <Icon
                      name="chart-line-variant"
                      size={icons.tiny}
                      color="#B78633"
                    />
                  </View>
                  <Text style={{ color: '#B78633', fontWeight: 'bold' }}>
                    Consumo Estimado
                  </Text>
                </View>
                <Text
                  style={{
                    textAlignVertical: 'center',
                    fontWeight: 'bold',
                  }}>{`${
                  clientState.state.client.expected_consuption
                } Gb`}</Text>
              </View>

              <View style={styles.graph_container}>
                {Object.keys(clientState.state.client).length !== 0 && (
                  <BarChart
                    data={clientState.state.client.graph_obj}
                    width={(Dimensions.get('window').width * 85) / 100}
                    height={200}
                    withInnerLines={false}
                    showValuesOnTopOfBars={true}
                    withHorizontalLabels={true}
                    chartConfig={{
                      backgroundGradientFrom: '#FFF',
                      backgroundGradientFromOpacity: 1,
                      backgroundGradientTo: '#FFF',
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
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View>
        <Dialog.Container visible={isResetMacDialogVisible}>
          <Dialog.Title>Redefinir MAC</Dialog.Title>
          <Dialog.Description>
            Deseja realmente redefinir o endereço MAC?
          </Dialog.Description>
          <Dialog.Button
            onPress={() => setIsResetMacDialogVisible(false)}
            label="Cancelar"
          />
          <Dialog.Button
            onPress={() => handleMACRefreshing()}
            label="Redefinir"
          />
        </Dialog.Container>
      </View>
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
    fontWeight: 'bold',
    fontSize: fonts.regular,
    flex: 1,
  },

  sub_text: {
    fontSize: fonts.small,
    color: '#989898',
  },

  main_text_login_senha: {
    fontWeight: 'bold',
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
    justifyContent: 'space-between',
  },

  modal_style: {
    width: '100%',
    maxWidth: 275,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    borderWidth: 0,
    borderRadius: 10,
    padding: 20,
    paddingTop: 10,
    marginLeft: 30,
    marginRight: 30,
  },

  modal_header: {
    fontWeight: 'bold',
    fontSize: fonts.medium,
    width: '100%',
    marginBottom: 10,
  },

  modal_btn: {
    width: '100%',
    height: 35,
    marginTop: 15,
    display: 'flex',
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
    textAlign: 'center',
  },

  header_title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: fonts.regular,
  },

  client_status: {
    fontSize: fonts.small,
    textAlign: 'center',
    marginRight: 5,
  },

  section_header: {
    margin: 10,
    marginTop: 0,
  },

  consumption_section: {},

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
    marginTop: 15,
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

  down_badge: {
    width: 55,
    backgroundColor: '#f5e642',
    borderRadius: 20,
    alignItems: 'center',
  },
  swiped_options: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 3,

    height: '100%',
    backgroundColor: '#f2f2f2',

    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
