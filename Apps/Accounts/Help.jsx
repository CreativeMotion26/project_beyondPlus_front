import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Help = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Help Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default Help;
