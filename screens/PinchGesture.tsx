import {Dimensions, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('screen');
const imageUri =
  'https://plus.unsplash.com/premium_vector-1729871786513-96a8edc7914b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxpbGx1c3RyYXRpb25zLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D';

const PinchGesture = () => {
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const pinch = Gesture.Pinch()
    .onStart(e => {
      scale.value = startScale.value;
      focalX.value = e.focalX;
      focalY.value = e.focalY;
    })
    .onUpdate(e => {
      startScale.value = Math.max(e.scale * scale.value, 1);
    });
  // .onEnd(() => {
  //   startScale.value = 1;
  // });
  const AnimatedImage = Animated.createAnimatedComponent(Image);
  const rImageStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: focalX.value},
      {translateY: focalY.value},
      {translateX: -width / 2},
      {translateY: -height / 2},
      {scale: startScale.value},
      {translateX: -focalX.value},
      {translateY: -focalY.value},
      {translateX: width / 2},
      {translateY: height / 2},
    ],
  }));

  return (
    <GestureDetector gesture={pinch}>
      <AnimatedImage
        source={{uri: imageUri}}
        style={[styles.image, rImageStyle]}
      />
    </GestureDetector>
  );
};

export default PinchGesture;

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  container: {},
});
