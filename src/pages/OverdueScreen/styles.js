import { StyleSheet } from 'react-native';

import { fonts } from '../../styles/index';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    width: '100%',
    flex: 1,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  sort_btn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 20,
  },

  group_label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#B5B5B5',
    marginLeft: 20,
    marginTop: 5,
  },
});

export default styles;
