import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import { subHours } from 'date-fns';

import Dialog from 'react-native-dialog';
import UserAvatar from 'react-native-user-avatar';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';
import { store } from '../../store/store';
import no_message from '../../assets/no_messages.png';

export default function NotesScreen({ navigation, route }) {
  const globalState = useContext(store);
  const { tenantID: tenant_id, userToken } = globalState.state;

  const [refreshing, setRefreshing] = useState(false);
  const [notes, setNotes] = useState([]);

  const [visible, setVisible] = useState(false);
  const [, setLoading] = useState(false);

  const [newNote, setNewNote] = useState('');

  const scrollViewRef = useRef();

  async function fetchNotes() {
    setRefreshing(true);

    try {
      const { chamado } = route.params;

      const response = await api.get(
        `messages?tenant_id=${tenant_id}&chamado=${chamado}`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      setNotes(response.data);
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      Alert.alert('Erro', 'Não foi possível carregar notas');
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  const AddButton = () => (
    <TouchableOpacity onPress={() => setVisible(!visible)}>
      <Icon
        name="add-circle"
        size={25}
        color="#FFFFFF"
        style={{ marginRight: 20, marginTop: 5 }}
      />
    </TouchableOpacity>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: props => <AddButton {...props} />,
    });
  }, [navigation]);

  async function handleAddNote() {
    const timeZoneOffset = new Date().getTimezoneOffset() / 60;
    const now = subHours(new Date(), timeZoneOffset);

    setVisible(false);

    try {
      const { chamado } = route.params;

      const body = { msg: newNote, msg_data: now };
      const settings = {
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      await api.post(
        `messages?tenant_id=${tenant_id}&chamado=${chamado}`,
        body,
        settings,
      );

      fetchNotes();
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível adicionar nota');
    }

    setVisible(false);
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 25,
        paddingLeft: 15,
        paddingRight: 15,
        padding: 5,
        backgroundColor: '#FFF',
      }}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchNotes()}
          />
        }
        style={{ flex: 1 }}>
        {notes.length === 0 && refreshing === false && (
          <View style={{ alignSelf: 'center', marginTop: 200 }}>
            <Image source={no_message} style={{ width: 200, height: 150 }} />
            <Text style={{ alignSelf: 'center', marginTop: 10 }}>
              Não há Mensagens
            </Text>
          </View>
        )}

        {notes.map(note => (
          <View
            key={note.id}
            style={{
              backgroundColor: '#EBEBEB',
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <UserAvatar
                  style={{ width: 30, height: 30 }}
                  size={30}
                  name={note.atendente}
                />
                <Text style={{ fontFamily: 'Roboto-Bold', marginLeft: 5 }}>{` ${
                  note.atendente
                }`}</Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Roboto-Light',
                  fontSize: 12,
                  marginLeft: 10,
                }}>
                {note.msg_data}
              </Text>
            </View>
            <Text style={{ fontFamily: 'Roboto-Light', paddingLeft: 5 }}>
              {note.msg}
            </Text>
          </View>
        ))}
      </ScrollView>

      {visible && (
        <View style={styles.dialog_container}>
          <Dialog.Container visible={visible}>
            <Dialog.Title>Adicionar nota</Dialog.Title>
            <Dialog.Description>
              Deseja inserir uma nota? Você não poderá desfazer esta ação.
            </Dialog.Description>
            <Dialog.Input
              onChangeText={text => setNewNote(text)}
              placeholder="Sua mensagem aqui..."
            />
            <Dialog.Button label="Cancelar" onPress={() => setVisible(false)} />
            <Dialog.Button label="Adicionar" onPress={() => handleAddNote()} />
          </Dialog.Container>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dialog_container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
