import Reactotron from 'reactotron-react-native';
import appConfig from './app';

if (__DEV__) {
  const tron = Reactotron.configure({ host: appConfig.reactotronHost })
    .useReactNative()
    .connect();

  tron.clear();

  console.tron = tron;
}
