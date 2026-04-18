import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput as RNTextInput,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radii, FontFamily } from '../constants/Theme';
import { AuthStackParamList } from '../types';
import AuthProgress from '../components/AuthProgress';
import BottomAction from '../components/BottomAction';
import { sendVerificationEmail } from '../services/firebase/auth';

const OTP_BOXES = [0, 1, 2, 3, 4, 5];

type Props = NativeStackScreenProps<AuthStackParamList, 'Verification'>;

const VerificationScreen: React.FC<Props> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const boxSize = (width - Spacing.xl * 2 - Spacing.xs * 5) / 6;

  const handleNext = async () => {
    await sendVerificationEmail();
    navigation.navigate('Disclaimer');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AuthProgress currentStep={2} totalSteps={3} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Enter The 6-Digit Code</Text>
          <Text style={styles.subtitle}>
            We sent a code to <Text style={styles.underline}>johndoe@xyz.com</Text>.{'\n'}
            It helps us confirm this is really you.
          </Text>
        </View>
        <View style={styles.codeContainer}>
          {OTP_BOXES.map((_, idx) => (
            <RNTextInput
              key={idx}
              style={[styles.codeBox, { width: boxSize, height: boxSize * 1.15 }]}
              maxLength={1}
              keyboardType="number-pad"
            />
          ))}
        </View>
        <Text style={styles.resendText}>Resend Code 0:09</Text>
      </View>
      <BottomAction onBack={() => navigation.goBack()} onNext={handleNext} />
    </SafeAreaView>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxl + Spacing.md },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: { fontFamily: FontFamily.serif, fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.textPrimary, textAlign: 'center' },
  underline: { textDecorationLine: 'underline' },
  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
  codeBox: { borderRadius: Radii.sm, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, textAlign: 'center', fontSize: 22, fontWeight: '600', color: Colors.textPrimary },
  resendText: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
});
