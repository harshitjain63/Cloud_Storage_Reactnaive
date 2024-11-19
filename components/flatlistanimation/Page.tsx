/* eslint-disable react-native/no-inline-styles */
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

type props = {
  item: string;
  index: number;
  translationX: Animated.SharedValue<number>;
};

const {height, width} = Dimensions.get('window');
const Size = width * 0.7;

const Page = ({item, index, translationX}: props) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translationX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP,
    );
    const borderRadius = interpolate(
      translationX.value,
      inputRange,
      [0, Size / 2, 0],
      Extrapolate.CLAMP,
    );
    return {
      borderRadius,
      transform: [{scale}],
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: 0,
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: `rgba(0,0,256,0.${index + 2})`},
      ]}>
      <Animated.View style={[styles.square, rStyle]} />
      <Animated.View style={[{position: 'absolute'}, rTextStyle]}>
        <Text style={styles.txt}>{item}</Text>
      </Animated.View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  square: {
    width: Size,
    height: Size,
    backgroundColor: 'blue',
    borderRadius: Size,
  },
});
