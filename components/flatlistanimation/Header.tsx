import {StyleSheet, Text} from 'react-native';
import React from 'react';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

const Header = ({
  translationY,
}: {
  translationY: Animated.SharedValue<number>;
}) => {
  const rStyle = useAnimatedStyle(() => {
    const translatex = interpolate(translationY.value, [0, 100], [0, 10]);
    return {
      transform: [
        {
          translateX: translatex,
        },
      ],
    };
  });
  return (
    <Animated.View style={styles.container}>
      <Text style={styles.text}>👈</Text>
      <Animated.Text style={[styles.text, rStyle]}>Chats</Animated.Text>
      <Text style={styles.text}>⚙️</Text>
    </Animated.View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 50,

    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
