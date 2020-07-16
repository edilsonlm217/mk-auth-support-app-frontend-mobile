import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../../components/AppHeader/index';
import { icons, fonts } from '../../styles/index';

export default function ClientDetails({ navigation }) {
  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} label="Detalhes" altura="21%" backButton={true} />
      <View style={styles.section_container}>

        <View>
          <View style={styles.clickable_line}>
            <View>
              <Text style={styles.sub_text}>Cliente</Text>
              <Text style={styles.main_text}>
                Edilson Rocha Lima
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.clickable_line}>
            <View>
              <Text style={styles.sub_text}>Telefone</Text>
              <Text style={styles.main_text}>
                99125-6878
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.clickable_line}>
            <View>
              <Text style={styles.sub_text}>Celular</Text>
              <Text style={styles.main_text}>
                98197-4189
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity>
          <View style={styles.clickable_line}>
            <View>
              <Text style={styles.sub_text}>Endereço</Text>
              <Text style={styles.main_text}>
                Rua Felix Valois, 15A - Ouro Verde
              </Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Icon name="navigation" size={icons.tiny} color="#000" />
            </View>
          </View>
        </TouchableOpacity>

      </View>
    </View>
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

  clickable_line: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: "space-between"
  },

});