import React, {useState} from 'react';
import {View, Dimensions, ScrollView, TouchableOpacity, Text} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import Card from '../Card/index';

import styles from './styles';

export default function TabViewComponent(props) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Abertos' },
    { key: 'second', title: 'Fechados' },
  ]);

  function OpenRequestsRoute() {
    return (
      <View style={styles.section_container}>
          <ScrollView >
            { props.state.open_requests.map(item => (
              <Card key={item.id} item={item} navigation={props.navigation}/>
            ))} 
          </ScrollView>
      </View>
    );
  }

  function CloseRequestsRoute() {
    return (
      <View style={styles.section_container}>
        <ScrollView>
          { props.state.close_requests.map(item => (
            <Card key={item.id} item={item} navigation={props.navigation}/>
          ))} 
        </ScrollView>
      </View>
    );
  }

  const renderScene = SceneMap({
    first: OpenRequestsRoute,
    second: CloseRequestsRoute,
  });

  return (
    <>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: Dimensions.get('window').width}}
        renderTabBar={props =>
          <TabBar
            {...props}
            indicatorStyle={styles.indicatorStyle}
            labelStyle={styles.label_style}
            style={styles.tabBar_style}
          />
        }
      />
    </>
  );
}
