import { fonts } from '../styles/index';

const general = {
  initial_config_linearGradient: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },

  initial_config_container: {
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'column',
    width: '100%',
    maxWidth: 400,
  },

  initial_config_logo_style: {
    marginBottom: 30,
    width: 45,
    height: 45,
    alignSelf: 'center',
    resizeMode: 'contain',
  },

  initial_config_text_input_style: {
    fontSize: fonts.input,
    width: '90%',
  },

  initial_config_main_title: {
    fontSize: fonts.huge,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 30,
  },

  initial_config_sub_title: {
    fontSize: fonts.regular,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  initial_config_input_container: {
    backgroundColor: "#FFF",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20
  },

  initial_config_icon_container: {
    width: '10%', 
    alignItems: 'center',
  },

  initial_config_next_btn_style: {
    position: "absolute",
    bottom: 20,
    right: 10,
    flexDirection: "row",
  },

  initial_config_prev_btn_style: {
    position: "absolute",
    bottom: 20,
    left: 10,
    flexDirection: "row",
  },
  
  initial_config_navigators_text_style: {
    fontSize: fonts.regular,
    color: "#FFF",
  },
}

export default general;