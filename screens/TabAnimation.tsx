/* eslint-disable react-native/no-inline-styles */
import {SafeAreaView, StyleSheet, View} from 'react-native'; // Correct import for View
import React, {useState} from 'react';
import Tabs from '../components/Tabs';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  LayoutAnimationConfig,
} from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';

const tabs = ['red', 'yellow', 'blue', 'green', 'gold'];

const TabAnimation = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <SafeAreaView
      style={{
        flex: 1,

        margin: 12,
        justifyContent: 'center',
      }}>
      <Tabs
        data={[
          {icon: 'LifeBuoy', label: 'buoy'},
          {icon: 'Fish', label: 'fresh fish'},
          {icon: 'Sailboat', label: 'sail'},
          {icon: 'Ship', label: 'ship it'},
          {icon: 'ShipWheel', label: 'Manage it'},
        ]}
        onchange={index => setSelectedIndex(index)}
        selectedIndex={selectedIndex}
      />
      <LayoutAnimationConfig skipEntering>
        <Animated.View
          key={`tab-content-${selectedIndex}`}
          entering={FadeInRight.springify().damping(80).stiffness(200)}
          exiting={FadeOutLeft.springify().damping(80).stiffness(200)}
          style={{
            backgroundColor: tabs[selectedIndex],
            flex: 1,
            marginTop: 5,
            borderRadius: 8,
          }}
        />
      </LayoutAnimationConfig>
    </SafeAreaView>
  );
};

export default TabAnimation;

const styles = StyleSheet.create({});
