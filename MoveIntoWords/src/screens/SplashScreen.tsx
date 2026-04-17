import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, StatusBar, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/Theme';
import { AuthStackParamList } from '../types';

const MIW_LOGO = require('../../assets/miw-logo.png');

const FADE_IN_DURATION = 1200;
const HOLD_DURATION = 1500;

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_IN_DURATION,
      useNativeDriver: true,
    }).start(() => {
      const timer = setTimeout(
        () => navigation.navigate('Onboarding'),
        HOLD_DURATION,
      );
      return () => clearTimeout(timer);
    });
  }, [opacity, navigation]);

  const logoWidth = width * 0.65;
  const logoHeight = logoWidth * 0.46;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Animated.View style={{ opacity }}>
        <Image
          source={MIW_LOGO}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
