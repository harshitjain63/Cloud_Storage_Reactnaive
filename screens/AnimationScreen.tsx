import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import {Screen} from 'react-native-screens';

const {height, width} = Dimensions.get('screen');

const AnimationScreen = () => {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate(e => {
      translationX.value = prevTranslationX.value + e.translationX;
      translationY.value = prevTranslationY.value + e.translationY;
    })
    .onEnd(() => {
      const distance = Math.sqrt(
        translationX.value ** 2 + translationY.value ** 2,
      );
      if (distance < (width * 0.7) / 2 + 25) {
        translationX.value = withSpring(0);
        translationY.value = withSpring(0);
      }
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: translationX.value},
      {translateY: translationY.value},
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.border}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.square, animatedStyles]} />
        </GestureDetector>
      </View>
    </View>
  );
};

export default AnimationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 20,
  },
  border: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width / 2,
    borderColor: 'blue',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
