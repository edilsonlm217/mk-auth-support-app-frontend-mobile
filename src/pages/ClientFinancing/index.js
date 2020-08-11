import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts, icons } from '../../styles/index';

export default function ClientFinancing() {
  const [isEnabled, setIsEnabled] = useState(false);

  const [activeSections, setActiveSections] = useState([]);

  function toggleSwitch() {
    setIsEnabled(previousState => !previousState);
  }

  const SECTIONS = [
    {
      title: 'First',
      content: 'Lorem ipsum...',
    },
    {
      title: 'Second',
      content: 'Lorem ipsum...',
    },
  ];

  const _renderHeader = section => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="chevron-down-circle" size={icons.large} color="#337AB7" />
        <Text style={[styles.main_text, { fontSize: fonts.medium, width: '55%', textAlign: 'center' }]}>Vencimento</Text>
        <Text style={{ fontSize: fonts.medium }}>14/06/2020</Text>
      </View>
    );
  };

  const _renderContent = section => {
    return (
      <View>
        <Text>{section.content}</Text>
      </View>
    );
  };

  const _updateSections = activeSections => {
    setActiveSections(activeSections);
  };

  return (
    <View>
      <View style={styles.observation_section}>
        <View style={{ flex: 1 }}>
          <Text style={styles.main_text}>Em observação</Text>
          <Text style={styles.sub_text}>Habilitar o modo observasão impedirá que o sistema bloqueie o cliente</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <View style={styles.invoices}>
        <Text style={[styles.main_text, { marginBottom: 10 }]}>Faturas em aberto</Text>

        <Accordion
          underlayColor="#FFF"
          sections={SECTIONS}
          activeSections={activeSections}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
        />

      </View>

      <View style={styles.invoices}>
        <Text style={styles.main_text}>Faturas em aberto</Text>
        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
          <Icon name="chevron-down-circle" size={icons.large} color="#337AB7" />
          <Text style={[styles.main_text, { fontSize: fonts.medium, width: '55%', textAlign: 'center' }]}>Vencimento</Text>
          <Text>14/06/2020</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main_text: {
    fontWeight: "bold",
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
    marginTop: 10,
  },
});
