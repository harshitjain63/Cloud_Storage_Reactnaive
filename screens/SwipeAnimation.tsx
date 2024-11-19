import {StyleSheet, View} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Page from '../components/flatlistanimation/Page';

const Words = ['Hello', 'how', 'are', 'you', 'my', 'friend'];

const SwipeAnimation = () => {
  const translationX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(e => {
    translationX.value = e.contentOffset.x;
  });
  return (
    <Animated.ScrollView
      scrollEventThrottle={16}
      onScroll={scrollHandler}
      horizontal={true}
      style={styles.container}>
      {Words.map((item, index) => (
        <View key={index}>
          <Page item={item} index={index} translationX={translationX} />
        </View>
      ))}
    </Animated.ScrollView>
  );
};

export default SwipeAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
