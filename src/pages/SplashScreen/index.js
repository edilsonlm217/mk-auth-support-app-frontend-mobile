import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';

import mk_logo from '../../assets/dvida_2.png'

export default function SplashScreen() {
  const logoFadeIn = new Animated.Value(0);
  const TextFadeIn = new Animated.Value(0);

  Animated.timing(logoFadeIn, {
    toValue: 1,
    duration: 1000,
  }).start();

  Animated.timing(TextFadeIn, {
    toValue: 1,
    delay: 1000,
    duration: 1000,
  }).start();

  return (
    <View style={styles.container}>
      <Animated.View style={{opacity: logoFadeIn}}>
        <Image source={mk_logo}/>
      </Animated.View>
      <Animated.View style={{opacity: TextFadeIn}}>
        <Text style={styles.title} >Controle de Chamados</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 150,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#585858",
    marginTop: 20,
  },
});