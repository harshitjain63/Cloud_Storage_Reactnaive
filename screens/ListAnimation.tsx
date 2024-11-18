import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';

const List = [
  'Coffee',
  'Bread',
  'Cheese',
  'Learning by doing',
  'Procrastinate',
];

const ListAnimation = () => {
  const AnimatedImage = Animated.createAnimatedComponent(Image);
  const sharedValuesRef = useRef(List.map(() => useSharedValue(0)));
  const [toggledStates, setToggledStates] = useState(
    Array(List.length).fill(false),
  );
  const [textWidths, setTextWidths] = useState(Array(List.length).fill(0));

  const handleToggle = (index: number) => {
    const newToggledStates = [...toggledStates];
    newToggledStates[index] = !newToggledStates[index];
    setToggledStates(newToggledStates);

    // Animate the line's position
    sharedValuesRef.current[index].value = withTiming(
      newToggledStates[index] ? 35 : 0,
      {duration: 500},
    );
  };

  const handleTextLayout = (index: number, width: number) => {
    const newWidths = [...textWidths];
    newWidths[index] = width;
    setTextWidths(newWidths);
  };

  return (
    <View>
      {List.map((item, index) => {
        const translateX = sharedValuesRef.current[index];
        const tap = Gesture.Tap().onStart(() => {
          runOnJS(handleToggle)(index);
        });

        const rLineStyle = useAnimatedStyle(() => ({
          transform: [{translateX: translateX.value}],
          width: withTiming(toggledStates[index] ? textWidths[index] : 15, {
            duration: 300,
          }), // Animate width
        }));

        // Animate the scale when the item is toggled
        const rTextStyle = useAnimatedStyle(() => ({
          transform: [
            {
              scale: withTiming(toggledStates[index] ? 0.8 : 0, {
                duration: 300,
              }),
            },
          ],
        }));

        const rImageStyle = useAnimatedStyle(() => ({
          transform: [
            {
              scale: withSpring(toggledStates[index] ? 1 : 0, {
                duration: 300,
              }),
            },
          ],
        }));

        const lineColor = toggledStates[index] ? 'grey' : 'blue';
        const textColor = toggledStates[index] ? 'grey' : 'blue';

        return (
          <GestureDetector key={index} gesture={tap}>
            <Animated.View style={styles.container}>
              {/* Line with conditional color */}
              <Animated.View
                style={[styles.line, rLineStyle, {backgroundColor: lineColor}]}
              />

              {/* Checkmark with scaling animation */}
              {toggledStates[index] && (
                <Animated.Text
                  style={[styles.text, styles.textPosition, rTextStyle]}>
                  ✔️
                </Animated.Text>
              )}

              {/* Text with conditional color */}
              <Animated.Text
                style={[styles.text, {color: textColor}]}
                onLayout={event =>
                  handleTextLayout(index, event.nativeEvent.layout.width)
                }>
                {item}
              </Animated.Text>
              {toggledStates[index] && (
                <AnimatedImage
                  source={require('../assets/circle-loading.png')}
                  style={[styles.image, rImageStyle]}
                />
              )}
            </Animated.View>
          </GestureDetector>
        );
      })}
    </View>
  );
};

export default ListAnimation;

const styles = StyleSheet.create({
  line: {
    height: 2,
    position: 'absolute',
    marginLeft: 5,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 25,
  },
  textPosition: {
    position: 'absolute',
    marginLeft: 5,
  },
  container: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 15,
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    position: 'absolute',
    height: 40,
    width: 40,
  },
});
