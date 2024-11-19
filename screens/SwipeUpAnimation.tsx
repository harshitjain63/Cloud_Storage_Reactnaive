/* eslint-disable react-native/no-inline-styles */
import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import ListView from '../components/flatlistanimation/ListView';
import Profile from '../components/flatlistanimation/Profile';
import Header from '../components/flatlistanimation/Header';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const data = [
  {
    id: '1',
    title: 'Jessie Boyer',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    date: 'Sat Jun 24 2023',
  },
  {
    id: '2',
    title: 'Alex Morgan',
    description: 'Another example text for the flat list component.',
    date: 'Sun Jul 16 2023',
  },
  {
    id: '3',
    title: 'Taylor Swift',
    description: 'React Native makes development flexible and dynamic.',
    date: 'Mon Aug 21 2023',
  },
  {
    id: '4',
    title: 'Chris Evans',
    description: 'Building modern apps has never been easier.',
    date: 'Tue Sep 12 2023',
  },
  {
    id: '5',
    title: 'Emma Watson',
    description: 'Adding animations to apps enhances user experience.',
    date: 'Wed Oct 04 2023',
  },
  {
    id: '6',
    title: 'Robert Downey',
    description: 'Component-based development improves reusability.',
    date: 'Thu Nov 02 2023',
  },
  {
    id: '7',
    title: 'Scarlett Johansson',
    description: 'Learn once, write anywhere with React Native.',
    date: 'Fri Dec 15 2023',
  },
  {
    id: '8',
    title: 'Tom Holland',
    description: 'Dynamic and responsive UI is key to mobile success.',
    date: 'Sat Jan 20 2024',
  },
  {
    id: '9',
    title: 'Zendaya Coleman',
    description: 'Effortless navigation with React Native libraries.',
    date: 'Sun Feb 18 2024',
  },
  {
    id: '10',
    title: 'Chris Hemsworth',
    description: 'FlatList simplifies rendering of large datasets.',
    date: 'Mon Mar 11 2024',
  },
];

const {width} = Dimensions.get('window');
const SIZE = width;

const SwipeUpAnimation = () => {
  const translationY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    console.log(event.contentOffset.y);
    translationY.value = event.contentOffset.y;
  });

  const renderItem = ({item}: {item: (typeof data)[0]}) => (
    <ListView
      title={item.title}
      description={item.description}
      date={item.date}
    />
  );
  const renderProfile = ({item}: {item: (typeof data)[0]}) => (
    <Profile translationY={translationY} title={item.title} />
  );

  const listStyle = useAnimatedStyle(() => {
    const scale = interpolate(translationY.value, [0, 100], [1, 0.5], 'clamp');
    const width = interpolate(
      translationY.value,
      [0, 100],
      [SIZE, 190],
      'clamp',
    );
    const trandlatex = interpolate(translationY.value, [0, 100], [0, 30]);
    const translatey = interpolate(
      translationY.value,
      [0, 100],
      [-25, -97],
      'clamp',
    );
    return {
      transform: [
        {
          translateY: translatey,
        },

        {
          scale: scale,
        },
        {
          translateX: trandlatex,
        },
      ],
      width,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const marginTop = interpolate(
      translationY.value,
      [0, 100],
      [98, 10],
      'clamp',
    );

    return {
      marginTop,
    };
  });

  return (
    <View style={styles.container}>
      <Header translationY={translationY} />
      <Animated.FlatList
        style={[
          {
            position: 'absolute',
            zIndex: 10,
            top: 90,
            width: 350,
          },
          listStyle,
        ]}
        horizontal
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderProfile}
      />
      <Animated.FlatList
        style={animatedStyle}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default SwipeUpAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
