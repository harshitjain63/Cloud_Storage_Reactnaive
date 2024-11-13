import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import 'stream-browserify';
import 'readable-stream';
import {Buffer} from 'buffer';

global.Buffer = global.Buffer || Buffer;

import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import {loadConfiguration} from '../utils/storage';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import axios from 'axios';

const FileManagerScreen = () => {
  const [configured, setConfigured] = useState(false);
  const [client, setClient] = useState(null);
  const [serviceName] = useState('Wasabi');

  useEffect(() => {
    loadConfiguration(serviceName).then(config => {
      if (config) {
        setConfigured(true);
        const configuredClient = configureWasabi(
          config.accessKey,
          config.secretKey,
        );
        setClient(configuredClient);
      } else {
        Alert.alert('Error', 'Please configure AWS S3 first');
      }
    });
  }, [serviceName]);

  const fetchFilesFolders = async () => {
    const response = await axios.post(
      'https://filestoreserver.onrender.com/aws/fetch-content',
      {
        currentPath: '/',
        accessKeyId: 'AKIAQZFG5FCE22H4LCE6',
        secretAccessKey: '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',
        region: 'ap-south-1',
        bucketName: 'aarjavharshit',
      },
    );
    console.log('response', response.data);
  };

  const configureWasabi = (accessKey, secretKey) => {
    const configuredClient = new S3Client({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      endpoint: 'https://s3.wasabisys.com',
      region: 'us-east-1',
    });
    return configuredClient;
  };

  const createFolder = async folderName => {
    if (!client) {
      Alert.alert('Error', 'Wasabi client is not configured.');
      return;
    }

    try {
      const result = await client.send(
        new PutObjectCommand({
          Bucket: 'filemanager',
          Key: `${folderName}/`,
          Body: 'hello',
        }),
      );
      Alert.alert('Success', `Folder '${folderName}' created successfully.`);
      console.log(result);
    } catch (error) {
      console.error('Error creating folder:', error);
      const errorMessage = error.message || 'An unknown error occurred';
      Alert.alert('Error', `Failed to create folder: ${errorMessage}`);
    }
  };

  if (!configured) {
    return <Text>Loading configuration...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>File Manager</Text>
      <Button
        title="Create Folder"
        onPress={() => createFolder('new-folder8')}
      />
      <Button title="Get Data" onPress={() => fetchFilesFolders()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default FileManagerScreen;
