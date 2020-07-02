import { StyleSheet } from 'react-native';
import { fonts } from '../../styles/index';

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 0,
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
  },
  header_container: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  
  main_text: { 
    fontWeight: "bold",
    fontSize: fonts.regular,    
  },
  
  sub_text: { 
    fontSize: fonts.small,
    color: '#989898',
  },
  line_container: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btns_contaier: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: '#FFF',
  },

  secondary_btn: {
    margin: 5,

    flexGrow: 1,
    backgroundColor: '#FFF',
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 6,
  },
  
  secondary_btn_text: {
    fontSize: fonts.regular,
    fontWeight: "bold",
    color: '#337AB7',
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
    minWidth: 150,
  },
  
  main_btn: {
    margin: 5,

    flexGrow: 1,
    backgroundColor: '#337AB7',
    minWidth: 130,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 6,
  },

  main_btn_text: {
    fontSize: fonts.regular,
    fontWeight: "bold",
    color: '#FFF',
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
    minWidth: 150,
  },
});

export default styles;