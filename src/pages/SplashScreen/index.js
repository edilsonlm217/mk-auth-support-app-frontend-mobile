import React from 'react';
import { View, Image } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import app_logo from '../../assets/mk-edge-logo.png';

export default function AuthScreen() {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#002F58', '#001C34']}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            padding: 20,
          }}>
          <Image
            source={app_logo}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 3,
              borderColor: '#D5D5D5',
              marginBottom: 45,
              marginTop: 10,
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
}
