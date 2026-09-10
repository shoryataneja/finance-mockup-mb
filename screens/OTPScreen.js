import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';

export default function OTPScreen({ route, navigation }) {
  const { phone } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputs = useRef([]);

  useEffect(() => {
    if (timer === 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) inputs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const isFilled = otp.every(d => d !== '');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP Code</Text>
        <Text style={styles.subtitle}>
          For your security, we've sent a one-time code to{'\n'}
          +91 {phone}. Enter it below to access your account.
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={r => (inputs.current[i] = r)}
              style={[styles.box, digit ? styles.boxFilled : null, i === 0 && !digit ? styles.boxActive : null]}
              value={digit}
              onChangeText={v => handleChange(v, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <Text style={styles.timerText}>
          {timer > 0 ? `You can resend in ${timer} seconds` : 'You can resend now'}
        </Text>
        <TouchableOpacity
          disabled={timer > 0}
          onPress={() => setTimer(30)}
        >
          <Text style={[styles.resend, timer > 0 && styles.resendDisabled]}>Resend Code</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, !isFilled && styles.btnDisabled]}
          disabled={!isFilled}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.btnText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  title: { fontSize: 26, fontWeight: '700', color: '#111', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 36 },
  otpRow: { flexDirection: 'row', gap: 14, marginBottom: 28 },
  box: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
  },
  boxFilled: { borderColor: '#1a3a6b' },
  boxActive: { borderColor: '#1a3a6b', borderWidth: 2 },
  timerText: { fontSize: 13, color: '#666', marginBottom: 6 },
  resend: { fontSize: 14, fontWeight: '600', color: '#1a3a6b' },
  resendDisabled: { color: '#aaa' },
  footer: { padding: 24 },
  btn: {
    backgroundColor: '#6b8ab8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 320,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
