/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

type ListViewProps = {
  title: string;
  translationY: Animated.SharedValue<number>;
};

const Profile = ({title, translationY}: ListViewProps) => {
  const textStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translationY.value, [0, 100], [1, 0], 'clamp');
    return {
      opacity,
    };
  });

  return (
    <Animated.View style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 3,
          borderRadius: 40,
          borderColor: 'black',
        }}>
        <Image
          source={require('../../assets/wasabi.png')}
          style={styles.image}
        />
      </View>
      <Animated.Text style={[styles.text, textStyle]}>
        {title.slice(0, 5)}
      </Animated.Text>
    </Animated.View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    height: 79,
    width: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 50,
    width: 50,

    resizeMode: 'contain',
  },
  text: {
    color: 'black',
    fontSize: 14,
    marginTop: 5,
  },
});
