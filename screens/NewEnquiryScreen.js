import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

export default function NewEnquiryScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      navigation.navigate('EnquiryStep1');
    }
  }, [isFocused]);

  return <View />;
}
