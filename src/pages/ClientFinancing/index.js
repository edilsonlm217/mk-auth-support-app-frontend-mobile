import React, { useState, useContext, useEffect, useReducer } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Accordion from 'react-native-collapsible/Accordion';
import { format, parseISO } from 'date-fns';
import api from '../../services/api';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts, icons } from '../../styles/index';
import { store } from '../../store/store';

export default function ClientFinancing(props) {
  const client_id = props.data;

  const globalState = useContext(store);

  const [PendingActiveSections, setPendingActiveSections] = useState([]);

  const [PaidActiveSections, setPaidActiveSections] = useState([]);

  const [state, setState] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [switcherState, dispatch] = useReducer(reducer, {
    isEnabled: false,
    date: null,
  });

  function reducer(state, action) {
    switch (action.type) {
      case 'turnOff':
        return {
          isEnabled: false,
          date: null,
        };

      case 'turnOn':
        setIsDatePickerVisible(false);

        return {
          isEnabled: true,
          date: action.payload.date,
        };
    }
  }

  async function loadAPI() {
    try {
      setRefreshing(true);
      const response = await api.get(
        `invoices/${client_id}?tenant_id=${globalState.state.tenantID}`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      setState(response.data);
      if (
        response.data.observacao === 'sim' &&
        switcherState.isEnabled === false
      ) {
        dispatch({
          type: 'turnOn',
          payload: {
            date: parseISO(response.data.rem_obs),
          },
        });
      }
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      Alert.alert('Erro', 'Não foi possível comunicar com a API');
    }
  }

  useEffect(() => {
    loadAPI();
  }, []);

  async function toggleSwitch() {
    const previousDate = switcherState.date;

    if (switcherState.isEnabled === true) {
      dispatch({
        type: 'turnOff',
      });

      try {
        const response_update = await api.post(
          `client/${client_id}?tenant_id=${globalState.state.tenantID}`,
          {
            observacao: 'nao',
            date: null,
          },
          {
            timeout: 10000,
            headers: {
              Authorization: `Bearer ${globalState.state.userToken}`,
            },
          },
        );
      } catch (error) {
        ToastAndroid.show('Não foi possível desabilitar', ToastAndroid.SHORT);
        dispatch({
          type: 'turnOn',
          payload: {
            date: previousDate,
          },
        });
      }
    } else {
      setIsDatePickerVisible(true);
    }
  }

  const _renderHeader = (section, isActive, index) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon
          name={index ? 'chevron-up-circle' : 'chevron-down-circle'}
          size={icons.large}
          color="#337AB7"
        />
        <View style={{ width: '50%', alignItems: 'center' }}>
          <Text
            numberOfLines={1}
            style={[
              styles.main_text,
              { fontSize: fonts.medium, textAlign: 'left', width: '50%' },
            ]}>
            Vencimento
          </Text>
        </View>
        {section.content.status === 'vencido' ? (
          <Text
            style={{
              color: index ? '#000' : 'red',
              fontFamily: 'Roboto-Light',
            }}>
            {section.title}
          </Text>
        ) : (
          <Text
            style={{
              color: index ? '#000' : '#337AB7',
              fontFamily: 'Roboto-Light',
            }}>
            {section.title}
          </Text>
        )}
      </View>
    );
  };

  const _renderContent = section => {
    return (
      <>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="chevron-down-circle" size={icons.large} color="#FFF" />
          <View style={{ width: '50%', alignItems: 'center' }}>
            <Text
              style={[
                styles.main_text,
                {
                  fontSize: fonts.medium,
                  textAlign: 'left',
                  width: '50%',
                },
              ]}>
              Título
            </Text>
          </View>
          <Text style={{ fontFamily: 'Roboto-Light' }}>
            {section.content.titulo}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="chevron-down-circle" size={icons.large} color="#FFF" />
          <View style={{ width: '50%', alignItems: 'center' }}>
            <Text
              style={[
                styles.main_text,
                {
                  fontSize: fonts.medium,
                  textAlign: 'left',
                  width: '50%',
                },
              ]}>
              Tipo
            </Text>
          </View>
          <Text style={{ fontFamily: 'Roboto-Light' }}>
            {section.content.tipo}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="chevron-down-circle" size={icons.large} color="#FFF" />
          <View style={{ width: '50%', alignItems: 'center' }}>
            <Text
              style={[
                styles.main_text,
                {
                  fontSize: fonts.medium,
                  textAlign: 'left',
                  width: '50%',
                },
              ]}>
              Valor
            </Text>
          </View>
          <Text style={{ fontFamily: 'Roboto-Light' }}>
            {section.content.valor}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="chevron-down-circle" size={icons.large} color="#FFF" />
          <View style={{ width: '50%', alignItems: 'center' }}>
            <Text
              style={[
                styles.main_text,
                {
                  fontSize: fonts.medium,
                  textAlign: 'left',
                  flex: 1,
                  width: '50%',
                },
              ]}>
              Descrição
            </Text>
          </View>
          <View style={{ flex: 1, marginBottom: 10 }}>
            <Text style={{ fontFamily: 'Roboto-Light' }}>
              {section.content.descricao}
            </Text>
          </View>
        </View>
        {section.content.paidAt && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="chevron-down-circle" size={icons.large} color="#FFF" />
            <View style={{ width: '50%', alignItems: 'center' }}>
              <Text
                style={[
                  styles.main_text,
                  {
                    fontSize: fonts.medium,
                    textAlign: 'left',
                    flex: 1,
                    width: '50%',
                  },
                ]}>
                Pago em
              </Text>
            </View>
            <View style={{ flex: 1, marginBottom: 10 }}>
              <Text style={{ fontFamily: 'Roboto-Light' }}>
                {section.content.paidAt}
              </Text>
            </View>
          </View>
        )}
      </>
    );
  };

  const _renderFooter = () => {
    return (
      <View
        style={{
          flex: 1,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: '#d9d9d9',
        }}
      />
    );
  };

  const _updateSections = (option, activeSections) => {
    if (option === 'pending') {
      setPendingActiveSections(activeSections);
    } else {
      setPaidActiveSections(activeSections);
    }
  };

  async function handleNewDate(event, selectedDate) {
    if (event.type === 'set') {
      dispatch({
        type: 'turnOn',
        payload: {
          date: selectedDate,
        },
      });

      try {
        const response_update = await api.post(
          `client/${client_id}?tenant_id=${globalState.state.tenantID}`,
          {
            observacao: 'sim',
            date: selectedDate,
          },
          {
            timeout: 10000,
            headers: {
              Authorization: `Bearer ${globalState.state.userToken}`,
            },
          },
        );
      } catch (error) {
        dispatch({
          type: 'turnOff',
        });
        ToastAndroid.show('Não foi possível habilitar', ToastAndroid.SHORT);
      }
    } else if (event.type === 'dismissed') {
      setIsDatePickerVisible(false);
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => loadAPI()} />
      }>
      <View style={styles.observation_section}>
        <View style={{ flex: 1 }}>
          <Text style={styles.main_text}>Em observação</Text>
          {switcherState.isEnabled ? (
            <Text style={styles.sub_text}>
              {`Até: ${format(switcherState.date, 'dd/MM/yyyy')}`}
            </Text>
          ) : (
            <Text style={styles.sub_text}>
              Habilitar o modo observação impedirá que o sistema bloqueie o
              cliente
            </Text>
          )}
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#337AB7' }}
          thumbColor={switcherState.isEnabled ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={switcherState.isEnabled}
        />
      </View>

      <View style={styles.invoices}>
        <Text style={[styles.main_text, { marginBottom: 10 }]}>
          Faturas em aberto
        </Text>

        {state !== null && (
          <>
            {state.invoices.pending_invoices.length === 0 ? (
              <Text>Nenhuma fatura pendente</Text>
            ) : (
              <Accordion
                expandMultiple={true}
                underlayColor="#FFF"
                sections={state.invoices.pending_invoices}
                activeSections={PendingActiveSections}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                renderFooter={_renderFooter}
                onChange={activeSections =>
                  _updateSections('pending', activeSections)
                }
              />
            )}
          </>
        )}
      </View>

      <View style={styles.invoices}>
        <Text style={[styles.main_text, { marginBottom: 10 }]}>
          Faturas pagas
        </Text>

        {state !== null && (
          <>
            {state.invoices.paid_invoices.length === 0 ? (
              <Text>Nenhuma fatura paga</Text>
            ) : (
              <Accordion
                expandMultiple={true}
                underlayColor="#FFF"
                sections={state.invoices.paid_invoices}
                activeSections={PaidActiveSections}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                renderFooter={_renderFooter}
                onChange={activeSections =>
                  _updateSections('paid', activeSections)
                }
              />
            )}
          </>
        )}
      </View>

      {isDatePickerVisible && (
        <DateTimePicker
          mode="datetime"
          display="calendar"
          value={new Date()}
          onChange={(event, selectedDate) => {
            handleNewDate(event, selectedDate);
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main_text: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
  },

  sub_text: {
    fontSize: fonts.small,
    color: '#989898',
  },

  observation_section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  invoices: {
    marginTop: 15,
  },
});
