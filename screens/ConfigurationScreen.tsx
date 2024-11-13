import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {saveConfiguration, loadConfiguration} from '../utils/storage';
import {RootStackParamList} from '../App';

type ConfigurationScreenRouteProp = RouteProp<
  RootStackParamList,
  'Configuration'
>;

const ConfigurationScreen = () => {
  const route = useRoute<ConfigurationScreenRouteProp>();
  const serviceName = route.params.service; // Get service name from route params
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    loadConfiguration(serviceName).then(config => {
      if (config) {
        setAccessKey(config.accessKey);
        setSecretKey(config.secretKey);
      }
    });
  }, [serviceName]);

  const handleSave = () => {
    saveConfiguration(serviceName, accessKey, secretKey)
      .then(() => {
        Alert.alert(
          'Configuration Saved',
          `Configuration for ${serviceName} saved successfully!`,
        );
        navigation.goBack();
      })
      .catch(error => Alert.alert('Error', error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configure {serviceName}</Text>
      <TextInput
        style={styles.input}
        value={accessKey}
        onChangeText={setAccessKey}
        placeholder="Access Key"
      />
      <TextInput
        style={styles.input}
        value={secretKey}
        onChangeText={setSecretKey}
        placeholder="Secret Key"
        secureTextEntry
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default ConfigurationScreen;
