// file: app/(tabs)/profile.tsx

import { COLORS } from '@/constants/theme';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>User Profile</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.lightWhite,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      color: COLORS.secondary,
    }
  });

export default ProfileScreen;