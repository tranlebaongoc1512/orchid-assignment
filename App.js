import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppNavigation from './src/navigation';

export default function App() {
  return (
    <>
      <SafeAreaView style={styles.unsafe} />
      <View style={styles.container}>
        <AppNavigation />
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  unsafe: {
    flex: 0,
    backgroundColor: 'transparent'
  }
});
