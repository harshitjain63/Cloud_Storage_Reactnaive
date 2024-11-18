/* eslint-disable react-native/no-inline-styles */
import {Pressable, View} from 'react-native';
import React from 'react';
import {icons} from 'lucide-react-native';
import Animated, {
  FadeInRight,
  FadeOutRight,
  LayoutAnimationConfig,
  LinearTransition,
} from 'react-native-reanimated';
import {motify, MotiProps, MotiView} from 'moti';

type IconNames = keyof typeof icons;
type TabItems = {
  icon: IconNames;
  label: string;
};

type TabsProps = {
  data: TabItems[];
  selectedIndex: number;
  onchange: (index: number) => void;
  activeColor?: string;
  inactiveColor?: string;
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
};

type IconProp = {
  name: IconNames;
} & MotiProps;

function Icon({name, ...rest}: IconProp) {
  const IconComponent = motify(icons[name])();
  return <IconComponent size={16} {...rest} />;
}

const _spacing = 4;

const Tabs = ({
  data,
  selectedIndex,
  onchange,
  activeColor = 'white',
  inactiveColor = 'gray',
  activeBackgroundColor = '#111',
  inactiveBackgroundColor = '#ddd',
}: TabsProps) => {
  return (
    <View style={{flexDirection: 'row', gap: _spacing}}>
      {data.map((item, index) => {
        const isSelected = selectedIndex === index;
        return (
          <MotiView
            key={index}
            animate={{
              backgroundColor: isSelected
                ? activeBackgroundColor
                : inactiveBackgroundColor,
              overflow: 'hidden',
              borderRadius: 8,
            }}
            layout={LinearTransition.springify().damping(80).stiffness(200)}>
            <Pressable
              onPress={() => onchange(index)}
              style={{
                padding: _spacing * 3,
                justifyContent: 'center',
                alignItems: 'center',
                gap: _spacing,
                flexDirection: 'row',
              }}>
              <Icon
                name={item.icon}
                animate={{
                  color: isSelected ? activeColor : inactiveColor,
                }}
              />
              <LayoutAnimationConfig skipEntering>
                {isSelected && (
                  <Animated.Text
                    entering={FadeInRight.springify()
                      .damping(80)
                      .stiffness(200)}
                    exiting={FadeOutRight.springify()
                      .damping(80)
                      .stiffness(200)}
                    style={{
                      color: isSelected ? activeColor : inactiveColor,
                    }}>
                    {item.label}
                  </Animated.Text>
                )}
              </LayoutAnimationConfig>
            </Pressable>
          </MotiView>
        );
      })}
    </View>
  );
};

export default Tabs;
