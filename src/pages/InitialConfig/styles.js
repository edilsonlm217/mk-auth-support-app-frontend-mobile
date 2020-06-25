import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 70,
    flex: 1,
  },

  linearGradient: {
    height: Dimensions.get('window').height
  },

  logo_style: {
    alignSelf: "center",
    marginBottom: 30,
  },

  main_text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 30,
  },

  sub_text: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 30,
  },

  input_container: {
    backgroundColor: "#FFF",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },

  text_input_style: {
    fontSize: 18,
    width: '90%',
  },

  next_btn_style: {
    position: "absolute",
    bottom: 40,
    right: 10,
    flexDirection: "row",
  },

  navigators_text_style: {
    fontSize: 22,
    color: "#FFF",
  },
});


export default styles;