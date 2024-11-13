import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveConfiguration = async (
  serviceName: string,
  accessKey: string,
  secretKey: string,
) => {
  try {
    await AsyncStorage.setItem(`${serviceName}AccessKey`, accessKey);
    await AsyncStorage.setItem(`${serviceName}SecretKey`, secretKey);
    console.log(`${serviceName} configuration saved successfully`);
  } catch (error) {
    console.error(`Error saving ${serviceName} configuration: `, error);
  }
};

export const loadConfiguration = async (serviceName: string) => {
  try {
    const accessKey = await AsyncStorage.getItem(`${serviceName}AccessKey`);
    const secretKey = await AsyncStorage.getItem(`${serviceName}SecretKey`);
    if (accessKey && secretKey) {
      return {accessKey, secretKey};
    }
    return null;
  } catch (error) {
    console.error(`Error loading ${serviceName} configuration: `, error);
    return null;
  }
};
