/* eslint-disable react-native/no-inline-styles */
import {Dimensions, Image, ImageBackground, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const {width} = Dimensions.get('window');
const heartImageUri =
  'https://cdn-icons-png.flaticon.com/128/18275/18275775.png';
const imageUri =
  'https://images.unsplash.com/photo-1731224365250-0cf29169dd32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8';

const TapAnimationScreen = () => {
  const AnimatedImage = Animated.createAnimatedComponent(Image);
  const doubleTapRef = useRef();
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);
  const tap = Gesture.Tap()
    .onStart(() => {
      console.log('single tap');
    })
    .onEnd(() => {
      opacity.value = withSpring(0, undefined, isfinished => {
        if (isfinished) {
          opacity.value = withDelay(500, withTiming(1));
        }
      });
    });
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      console.log('double tap');
    })
    .onEnd(() => {
      scale.value = withSpring(1, undefined, isfinished => {
        if (isfinished) {
          scale.value = withDelay(500, withTiming(0));
        }
      });
    });

  const rImageStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));
  const rTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const combineGesture = Gesture.Exclusive(doubleTap, tap);
  return (
    <GestureDetector gesture={combineGesture}>
      <Animated.View style={{flex: 1}}>
        <ImageBackground source={{uri: imageUri}} style={styles.image}>
          <AnimatedImage
            source={{uri: heartImageUri}}
            style={[
              styles.image,
              {tintColor: 'white', resizeMode: 'center'},
              rImageStyle,
            ]}
          />
        </ImageBackground>
        <Animated.Text style={[styles.text, rTextStyle]}>
          🐢🐢🐢🐢🐢
        </Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default TapAnimationScreen;

const styles = StyleSheet.create({
  image: {
    height: width,
    width: width,
    marginTop: 40,
  },
  container: {},
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
});
