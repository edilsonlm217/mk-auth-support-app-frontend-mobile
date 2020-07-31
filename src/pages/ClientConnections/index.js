import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';

export default function ClientConnections(props) {
  const client_id = props.data;
  const globalState = props.state;

  const [refreshing, setRefreshing] = useState(false);

  const [connections, setConnections] = useState([]);

  const [dataTable, setDataTable] = useState([]);

  const [viewMode, setViewMode] = useState(true);

  async function loadAPI() {
    try {
      setRefreshing(true);

      const response = await axios.get(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/connections/${client_id}`,
        {
          timeout: 2500,
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

  const data = {
    tableHead: ['INÍCIO', 'FIM', 'DURAÇÃO', 'TRÁFEGO'],
    tableData: dataTable,
  }

  useEffect(() => {
    let rows = [];
    connections.map(connection => {
      const new_row = [
        `${connection.start_date} ${connection.start_time}`,
        `${connection.end_date === null ? 'ONLINE' : `${connection.end_date} ${connection.end_time}`}`,
        `${connection.duration}`,
        `${connection.upload.new_value.toFixed(2)}${connection.upload.unit}\n${connection.download.new_value.toFixed(2)}${connection.download.unit}`,
      ];

      rows.push(new_row);
    });

    setDataTable(rows);
  }, [connections]);


  async function switchViewMode() {
    loadAPI();
    setViewMode(!viewMode);
  }

  return (
    <>
      <TouchableOpacity onPress={() => switchViewMode()} style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[styles.main_text, { fontSize: 16, }]}>Conexão Atual</Text>
        <View style={{ alignSelf: "flex-start" }}>
          {viewMode
            ? <Icon name="table-column" size={20} color="#337AB7" />
            : <Icon name="table-large" size={20} color="#337AB7" />
          }
        </View>
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadAPI()} />
        }
      >
        {viewMode
          ?
          <View style={styles.container}>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row data={data.tableHead} flexArr={[2, 2, 0.8, 2]} style={styles.head} textStyle={styles.text} />
              <Rows data={data.tableData} flexArr={[2, 2, 0.8, 2]} textStyle={styles.text} />
            </Table>
          </View>
          :
          <View>
            <View style={styles.card}>
              <View style={styles.card_first_row}>
                <Text style={styles.sub_text}>Hora Inicial</Text>
                <Text style={styles.sub_text}>Hora Final</Text>
              </View>

              <View style={styles.card_second_row}>
                <View style={styles.date_container}>
                  <Text >{connections[0].start_date}</Text>
                  <Text >{connections[0].start_time}</Text>
                </View>

                <View style={{ borderWidth: StyleSheet.hairlineWidth }} />

                <View style={styles.date_container}>
                  {connections[0].end_date === null
                    ?
                    <Text
                      style={
                        [styles.main_text, {
                          fontWeight: "normal",
                          color: 'green',
                          flex: 1,
                          textAlign: 'center'
                        }]
                      }
                    >
                      ONLINE
                    </Text>
                    :
                    <>
                      <Text >{connections[0].end_date}</Text>
                      <Text >{connections[0].end_time}</Text>
                    </>
                  }
                </View>
              </View>

              <View style={styles.card_third_row}>
                <View style={styles.usage_container}>
                  <Icon style={{ marginRight: 5 }} name="clock-time-eight-outline" size={22} color="#337AB7" />
                  <Text >{connections[0].duration}</Text>
                </View>

                <View style={styles.usage_container}>
                  <Icon style={{ marginRight: 5 }} name="cloud-upload-outline" size={22} color="#337AB7" />
                  <Text >
                    {`${connections[0].upload.new_value.toFixed(2)}${connections[0].upload.unit}`}
                  </Text>
                </View>

                <View style={styles.usage_container}>
                  <Icon style={{ marginRight: 5 }} name="cloud-download-outline" size={22} color="#337AB7" />
                  <Text >
                    {`${connections[0].download.new_value.toFixed(2)}${connections[0].download.unit}`}
                  </Text>
                </View>
              </View>

            </View>

            <Text style={[styles.main_text, { marginBottom: 10, fontSize: 16 }]}>Últimas conexões</Text>

            {connections.map((connection, index) => {
              if (index !== 0) {
                return (
                  <View key={index} style={styles.card}>
                    <View style={styles.card_first_row}>
                      <Text style={styles.sub_text}>Hora Inicial</Text>
                      <Text style={styles.sub_text}>Hora Final</Text>
                    </View>

                    <View style={styles.card_second_row}>
                      <View style={styles.date_container}>
                        <Text >{connection.start_date}</Text>
                        <Text >{connection.start_time}</Text>
                      </View>

                      <View style={{ borderWidth: StyleSheet.hairlineWidth }} />

                      <View style={styles.date_container}>
                        <Text >{connection.end_date}</Text>
                        <Text >{connection.end_time}</Text>
                      </View>
                    </View>

                    <View style={styles.card_third_row}>
                      <View style={styles.usage_container}>
                        <Icon style={{ marginRight: 5 }} name="clock-time-eight-outline" size={22} color="#337AB7" />
                        <Text >{connection.duration}</Text>
                      </View>

                      <View style={styles.usage_container}>
                        <Icon style={{ marginRight: 5 }} name="cloud-upload-outline" size={22} color="#337AB7" />
                        <Text >
                          {`${connection.upload.new_value.toFixed(2)}${connection.upload.unit}`}
                        </Text>
                      </View>

                      <View style={styles.usage_container}>
                        <Icon style={{ marginRight: 5 }} name="cloud-download-outline" size={22} color="#337AB7" />
                        <Text >
                          {`${connection.download.new_value.toFixed(2)}${connection.download.unit}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
              }
            })}
          </View>
        }
      </ScrollView>
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
});