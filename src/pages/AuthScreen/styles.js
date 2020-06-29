import { StyleSheet } from 'react-native';

import general from '../../styles/general';

const styles = StyleSheet.create({
  ...general,
  
  modal_style: {
    width: 300,
    backgroundColor: "#FFF",
    alignSelf: "center",
    borderWidth: 0,
    borderRadius: 5,
    padding: 20,
    paddingTop: 10,
  },

});

export default styles;