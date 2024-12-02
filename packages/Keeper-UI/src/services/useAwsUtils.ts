import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MiscService from 'services/MiscService';
import { TImagePayload } from 'types/globalTypes';
import { useState } from 'react';

const useAwsUtils = () => {
  const [isImageUploading, setIsImageUploading] = useState(false);

  const pickImage = async (): Promise<
    | {
        uri?: string;
        canceled?: boolean;
        error?: any;
      }
    | undefined
  > => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('We ask permission to access the camera to allow you to upload photos to your profile.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
        base64: true,
      });

      if (result.canceled) {
        return { canceled: true };
      }

      if (result && !result.canceled) {
        const fileName = result?.assets[0].uri;

        if (fileName != null) {
          // get what type of file it is
          const tempExt = fileName?.match(/\.[0-9a-z]+$/i);

          const ext = tempExt != null ? tempExt[0] : '';
          // regex returns .jpg for example, so remove the dot with substring(1)
          // and make the mime (which is the standard for naming file types)

          const mime = 'image/' + ext.substring(1);

          const base64Image = result?.assets[0].base64;

          const imagePayload: TImagePayload = {
            mime,
            image: 'data:image/jpeg;base64, ' + base64Image,
          };

          try {
            setIsImageUploading(true);

            const imageRes = await MiscService.imageUpload(imagePayload);
            setIsImageUploading(false);

            return {
              uri: imageRes.img,
            };
          } catch (error) {
            console.error('error uploading image', error);

            setIsImageUploading(false);
            return {
              error,
            };
          }
        }
      }
    } catch (error) {
      console.error('ImagePicker.launchImageLibraryAsync error: ', error);
      return { error };
    }
  };
  return {
    isImageUploading,
    pickImage,
  };
};

export default useAwsUtils;
