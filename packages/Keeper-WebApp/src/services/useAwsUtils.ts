import MiscService from 'services/MiscService';
import { TImagePayload } from 'types/globalTypes';
import { useState } from 'react';
import toast from 'react-hot-toast';

const useAwsUtils = () => {
  const [isImageUploading, setIsImageUploading] = useState(false);

  const pickImage = async (
    base64Image: string,
    mime: string,
  ): Promise<
    | {
        uri?: string;
        canceled?: boolean;
        error?: any;
      }
    | undefined
  > => {
    try {
      const imagePayload: TImagePayload = {
        mime,
        image: base64Image,
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
        if (error.response.status === 413) {
          toast.error('That image is too big! Try another one that is smaller.');
        } else {
          toast.error('Something went wrong uploading that image. Try uploading again.');
        }
        setIsImageUploading(false);
        return {
          error,
        };
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
