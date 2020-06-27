import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const device_pixel_ratio = PixelRatio.get();

const styles = StyleSheet.create({
  container: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: device_pixel_ratio <= 1 ? PixelRatio.getPixelSizeForLayoutSize(70) : 70,
    flex: 1,
  },

  linearGradient: {
    height: Dimensions.get('window').height
  },

  logo_style: {
    alignSelf: "center",
    marginBottom: 30,
    width: device_pixel_ratio <= 1 ? PixelRatio.getPixelSizeForLayoutSize(60) : 60,
    height: device_pixel_ratio <= 1 ? PixelRatio.getPixelSizeForLayoutSize(60) : 60,
  },

  main_text: {
    fontSize: device_pixel_ratio <= 1 ? PixelRatio.getPixelSizeForLayoutSize(28) : 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: device_pixel_ratio <= 1 ? PixelRatio.getPixelSizeForLayoutSize(30) : 30,
  },

  sub_text: {
    fontSize: device_pixel_ratio <= 1 ? PixelRatio.getPixelSizeForLayoutSize(18) : 18,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 30,
  },

  input_container: {
    backgroundColor: "#FFF",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    height: device_pixel_ratio <= 1 ? PixelRatio.getPixelSizeForLayoutSize(60) : 60,
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },

  text_input_style: {
    fontSize: device_pixel_ratio <= 1 ? PixelRatio.getPixelSizeForLayoutSize(18) : 18,
    width: '90%',
  },

  next_btn_style: {
    position: "absolute",
    bottom: 40,
    right: 10,
    flexDirection: "row",
  },

  navigators_text_style: {
    fontSize: device_pixel_ratio <= 1 ? PixelRatio.getPixelSizeForLayoutSize(22) : 22,
    color: "#FFF",
  },
});


export default styles;