import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import PomodoroTimer from './components/PomodoroTimer';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PomodoroTimer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;