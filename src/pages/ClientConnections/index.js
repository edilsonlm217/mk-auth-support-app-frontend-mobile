import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../services/api';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';

export default function ClientConnections(props) {
  const client_id = props.data;
  const globalState = props.state;

  const [refreshing, setRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(2);

  const [connections, setConnections] = useState([]);

  async function loadAPI() {
    try {
      setRefreshing(true);

      const response = await api.get(`connections/${client_id}?tenant_id=${globalState.state.tenantID}&page=1`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      setConnections(response.data);
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      Alert.alert('Erro', 'Não foi possível comunicar com a API');
    }
  }

  useEffect(() => {
    loadAPI();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.card_first_row}>
          <Text style={styles.sub_text}>Hora Inicial</Text>
          <Text style={styles.sub_text}>Hora Final</Text>
        </View>

        <View style={styles.card_second_row}>
          <View style={styles.date_container}>
            <Text >{item.start_date}</Text>
            <Text >{item.start_time}</Text>
          </View>

          <View style={{ borderWidth: StyleSheet.hairlineWidth }} />

          <View style={styles.date_container}>
            {item.end_date !== null
              ?
              <>
                <Text >{item.end_date}</Text>
                <Text >{item.end_time}</Text>
              </>
              :
              <>
                <Text
                  style={[
                    styles.main_text,
                    {
                      fontWeight: "normal",
                      color: 'green',
                      flex: 1,
                      textAlign: 'center'
                    }
                  ]}
                >
                  ONLINE
                </Text>
              </>
            }
          </View>
        </View>

        <View style={styles.card_third_row}>
          <View style={styles.usage_container}>
            <Icon style={{ marginRight: 5 }} name="clock-time-eight-outline" size={22} color="#337AB7" />
            <Text >{item.duration}</Text>
          </View>

          <View style={styles.usage_container}>
            <Icon style={{ marginRight: 5 }} name="cloud-upload-outline" size={22} color="#337AB7" />
            <Text >
              {`${item.upload.new_value.toFixed(2)}${item.upload.unit}`}
            </Text>
          </View>

          <View style={styles.usage_container}>
            <Icon style={{ marginRight: 5 }} name="cloud-download-outline" size={22} color="#337AB7" />
            <Text >
              {`${item.download.new_value.toFixed(2)}${item.download.unit}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  async function loadNextPages() {
    try {
      setRefreshing(true);

      const response = await api.get(`connections/${client_id}?tenant_id=${globalState.state.tenantID}&page=${currentPage}`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      setCurrentPage(currentPage + 1);
      setConnections([
        ...connections,
        ...response.data
      ]);

      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      Alert.alert('Erro', 'Não foi possível comunicar com a API');
    }
  }

  const renderFooter = () => {
    if (!refreshing) return null;
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#0000ff"
        />
      </View>
    );
  };

  return (
    <>
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Text style={[styles.main_text, { fontSize: 16, }]}>Conexão Atual</Text>
      </View>

      <FlatList
        data={connections}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={() => loadAPI()}
        onEndReachedThreshold={0.01}
        onEndReached={() => loadNextPages()}
        ListFooterComponent={renderFooter}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, paddingTop: 0, backgroundColor: '#fff' },
  head: { backgroundColor: '#f1f8ff' },
  text: { margin: 5, fontSize: 10, textAlign: 'center' },
  card: {
    backgroundColor: '#FFF',

    borderRadius: 10,
    margin: 5,
    marginBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,


    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  main_text: {
    fontWeight: 'bold',
    fontSize: fonts.medium,
  },

  sub_text: {
    fontSize: fonts.small,
    color: "#adadad",
  },

  card_first_row: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 5, paddingBottom: 0,
  },

  card_second_row: {
    padding: 5, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth
  },

  card_third_row: {
    paddingTop: 10, flexDirection: "row", justifyContent: 'space-around', marginBottom: 5
  },

  date_container: {
    flexDirection: 'row', width: '47%', justifyContent: 'space-between'
  },

  usage_container: {
    flexDirection: 'row'
  },

  loading: {
    alignSelf: 'center',
    marginVertical: 20,
  },
});