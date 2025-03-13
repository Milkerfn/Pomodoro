import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Sound from 'react-native-sound';
import KeepAwake from 'react-native-keep-awake';

// Habilitar o modo de depuração para a biblioteca de som
Sound.setCategory('Playback');

const PomodoroTimer = () => {
  const [workTime, setWorkTime] = useState(25 * 60); // 25 minutes
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [customWorkTime, setCustomWorkTime] = useState('25');
  const [customBreakTime, setCustomBreakTime] = useState('5');

  useEffect(() => {
    let timer;
    if (isRunning) {
      KeepAwake.activate();
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            playSound(isWork ? 'end' : 'start');
            setIsWork(!isWork);
            return isWork ? breakTime : workTime;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      KeepAwake.deactivate();
      if (timeLeft !== 0) {
        clearInterval(timer);
      }
    }
    return () => {
      clearInterval(timer);
      KeepAwake.deactivate();
    };
  }, [isRunning, timeLeft, isWork, workTime, breakTime]);

  useEffect(() => {
    setTimeLeft(isWork ? workTime : breakTime);
    if (isRunning) {
      playSound('start');
    }
  }, [isWork, workTime, breakTime, isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSetCustomTimes = () => {
    const workMinutes = parseInt(customWorkTime, 10);
    const breakMinutes = parseInt(customBreakTime, 10);
    if (!isNaN(workMinutes) && workMinutes > 0) {
      setWorkTime(workMinutes * 60);
    }
    if (!isNaN(breakMinutes) && breakMinutes > 0) {
      setBreakTime(breakMinutes * 60);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsWork(true);
    setTimeLeft(workTime);
  };

  const handleSwitch = () => {
    setIsWork(!isWork);
    setTimeLeft(!isWork ? workTime : breakTime);
    playSound('start');
  };

  const playSound = (type) => {
    console.log(`Attempting to play sound: ${type}`);
    const sound = new Sound(type === 'start' ? 'start.mp3' : 'end.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      console.log('Sound loaded successfully');
      sound.play((success) => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.log('Sound playback failed');
        }
        sound.release();
      });
    });
  };

  const strokeDashoffset = (1 - timeLeft / (isWork ? workTime : breakTime)) * 283;

  return (
    <View style={styles.container}>
      <Svg height="300" width="300" viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="45" stroke="black" strokeWidth="2.5" fill="none" />
        <Circle
          cx="50"
          cy="50"
          r="45"
          stroke={isWork ? 'red' : 'green'}
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="283"
          strokeDashoffset={strokeDashoffset}
        />
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </Svg>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => { setIsRunning(!isRunning); if (!isRunning) playSound('start'); }} style={styles.button}>
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset} style={styles.button}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSwitch} style={styles.button}>
          <Text style={styles.buttonText}>Switch</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.adjustContainer}>
        <Text>Work Time (minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={customWorkTime}
          onChangeText={setCustomWorkTime}
        />
        <Text>Break Time (minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={customBreakTime}
          onChangeText={setCustomBreakTime}
        />
        <Button title="Set Times" onPress={handleSetCustomTimes} />
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
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: 100,
    textAlign: 'center',
  },
});

export default PomodoroTimer;