import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet, RefreshControl } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';

export default function ClientConnections(props) {
  const client_id = props.data;
  const globalState = props.state;

  const [refreshing, setRefreshing] = useState(false);

  const [connections, setConnections] = useState([]);

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

      let rows = [];
      response.data.forEach(connection => {
        const new_row = [
          `${connection.start_date} ${connection.start_time}`,
          `${connection.end_date === null ? 'ONLINE' : `${connection.end_date} ${connection.end_time}`}`,
          `${connection.duration} ${connection.upload.new_value.toFixed(2)}${connection.upload.unit}/${connection.download.new_value.toFixed(2)}${connection.download.unit}`,
        ];

        rows.push(new_row);
      });

      setConnections(rows);
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
    tableHead: ['DATA/HORA INICIAL', 'DATA/HORA FINAL', 'DURAÇÃO/TRÁFEGO'],
    tableData: connections,
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => loadAPI()} />
      }
    >
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
          <Row data={data.tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={data.tableData} textStyle={styles.text} />
        </Table>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});