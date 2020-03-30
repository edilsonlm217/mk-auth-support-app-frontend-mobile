import React, {useState} from 'react';
import {View, Dimensions, FlatList, StyleSheet} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import FlatListCard from '../../components/FlatListCard/index';

export default function TabViewComponent(props) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Abertos' },
    { key: 'second', title: 'Fechados' },
  ]);

  function OpenRequestsRoute() {
    return (
      <View style={styles.section_container}>
          <FlatList
            data={props.state.open_requests}
            renderItem={({ item }) => <FlatListCard data={item}/>}
            keyExtractor={item => String(item.id)}
          />
      </View>
    );
  }

  function CloseRequestsRoute() {
    return (
      <View style={styles.section_container}>
          <FlatList
            data={props.state.close_requests}
            renderItem={({ item }) => <FlatListCard data={item}/>}
            keyExtractor={item => String(item.id)}
          />
      </View>
    );
  }

  const renderScene = SceneMap({
    first: OpenRequestsRoute,
    second: CloseRequestsRoute,
  });

  return (
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
  );
}

const styles = StyleSheet.create({
  section_container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  indicatorStyle: {
    backgroundColor: '#337AB7', 
    height: 4, 
    borderRadius: 8,
  },

  label_style: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },

  tabBar_style: {
    backgroundColor: '#FFF',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    height: 50,
  },
});
