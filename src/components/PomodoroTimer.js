import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const PomodoroTimer = () => {
  const [workTime, setWorkTime] = useState(25 * 60); // 25 minutes
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [timeLeft, setTimeLeft] = useState(workTime);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            setIsWork(!isWork);
            return isWork ? breakTime : workTime;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && timeLeft !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isWork, workTime, breakTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Svg height="300" width="300" viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="45" stroke="black" strokeWidth="2.5" fill="none" />
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </Svg>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setIsRunning(!isRunning)} style={styles.button}>
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.adjustContainer}>
        <Button title="+" onPress={() => setWorkTime(workTime + 60)} />
        <Button title="-" onPress={() => setWorkTime(workTime - 60)} />
      </View>
      <View style={styles.adjustContainer}>
        <Button title="+" onPress={() => setBreakTime(breakTime + 60)} />
        <Button title="-" onPress={() => setBreakTime(breakTime - 60)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    textAlign: 'center',
    marginTop: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  adjustContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default PomodoroTimer;