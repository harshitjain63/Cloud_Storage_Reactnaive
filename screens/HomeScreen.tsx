import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  StyleSheet,
  Button,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Service = {
  name: string;
  icon: any;
  route: 'FileManager' | 'AwsFileManager' | 'AzureFileManager';
};
// Move services array outside the component
const services: Service[] = [
  {
    name: 'Wasabi',
    icon: require('../assets/wasabi.png'),
    route: 'FileManager',
  },
  {
    name: 'AWS S3',
    icon: require('../assets/file.png'),
    route: 'AwsFileManager',
  },
  {
    name: 'Azure',
    icon: require('../assets/azure.png'),
    route: 'AzureFileManager',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [rotations] = useState(() => services.map(() => new Animated.Value(0)));

  const rotateGear = (index: number) => {
    Animated.timing(rotations[index], {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      rotations[index].setValue(0);
    });
  };

  return (
    <View style={styles.container}>
      {services.map((service, index) => {
        const rotationStyle = {
          transform: [
            {
              rotate: rotations[index].interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        };

        return (
          <View key={index} style={styles.serviceContainer}>
            <Image source={service.icon} style={styles.icon} />
            <View style={styles.serviceTextContainer}>
              <Text style={styles.serviceName}>{service.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                rotateGear(index);
                navigation.navigate('Configuration', {service: service.name});
              }}>
              <Animated.Text style={[styles.gearIcon, rotationStyle]}>
                ⚙️
              </Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fileManagerButton}
              onPress={() =>
                navigation.navigate(service.route, {service: service.name})
              }>
              <Text style={styles.fileManagerButtonText}>File Manager</Text>
            </TouchableOpacity>
          </View>
        );
      })}
      <Button
        title="Animation screen"
        onPress={() => navigation.navigate('Animation')}
      />
      <Button
        title="Swipe Animation screen"
        onPress={() => navigation.navigate('SwipeAnimation')}
      />
      <Button
        title="Pinch Gesture"
        onPress={() => navigation.navigate('PinchAnimation')}
      />
      <Button
        title="Tap Gesture"
        onPress={() => navigation.navigate('TapAnimation')}
      />
      <Button
        title="List Animation"
        onPress={() => navigation.navigate('ListAnimation')}
      />
      <Button
        title="Tab Animation"
        onPress={() => navigation.navigate('TabAnimation')}
      />
      <Button
        title="Swipeup Animation"
        onPress={() => navigation.navigate('SwipeupAnimation')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  gearIcon: {
    right: 16,
    fontSize: 20,
  },
  fileManagerButton: {
    borderRadius: 20,
    backgroundColor: 'red',
    padding: 12,
  },
  fileManagerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
