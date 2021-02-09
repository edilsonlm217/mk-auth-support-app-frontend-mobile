import { StyleSheet } from 'react-native';

import general from '../../styles/general';
import { fonts } from '../../styles/index';

const styles = StyleSheet.create({
  ...general,

  modal_style: {
    width: 300,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    borderWidth: 0,
    borderRadius: 5,
    padding: 20,
    paddingTop: 10,
  },

  modal_text_style: {
    fontSize: fonts.regular,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default styles;
