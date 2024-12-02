import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAwsUtils } from 'services';
import { KeeperImage, AppText } from 'components';
import Icon from 'react-native-vector-icons/AntDesign';
import { AlertModal } from 'modals';

import { useStyles } from './LogoModalStyles';
import ProfileImgPlaceholder from '../../assets/svgs/profile_img_placeholder.svg';

type LogoModalProps = {
  logo: string | undefined;
  setLogo: (logo: string) => void;
  isEmployee?: boolean;
  isError?: boolean;
};

const LogoModal = ({ logo, setLogo, isEmployee, isError }: LogoModalProps) => {
  const [alertModalText, setAlertModalText] = useState('');

  const { isImageUploading, pickImage } = useAwsUtils();

  const styles = useStyles(logo, isEmployee, isError, isImageUploading);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('We ask permission to access the camera to allow you to upload photos to your profile.');
      }
    })();
  }, []);

  const selectImage = async () => {
    const image = await pickImage();
    if (image?.canceled) {
      return;
    }
    if (image && image.error) {
      if (image.error.response.status === 413) {
        setAlertModalText('That image is too big!');
      } else {
        setAlertModalText('Something went wrong uploading that image :(');
      }
    }

    if (image && image.uri) {
      setLogo(image.uri);
    }
  };

  const closeAlertModal = () => {
    setAlertModalText('');
  };

  return (
    <View style={styles.imageSelectorSection}>
      <AlertModal
        isOpen={!!alertModalText}
        title={alertModalText}
        subTitle='Try another one that is smaller. Or take a screenshot of that image and use that instead.'
        closeModal={closeAlertModal}
        onConfirmPress={closeAlertModal}
        isOkButton
      />
      {logo || isImageUploading ? (
        <KeeperImage
          style={styles.logoImage}
          resizeMode={isEmployee ? 'cover' : 'contain'}
          source={{
            uri: logo,
          }}
          isApiCallLoading={isImageUploading}
        />
      ) : isEmployee ? (
        <ProfileImgPlaceholder style={styles.profileImgPlaceholder} />
      ) : (
        <View style={styles.emptyCompanyLogoContainer}>
          <AppText style={styles.companyLogoText}>COMPANY LOGO</AppText>
        </View>
      )}

      <View style={styles.chooseLogoButtonContainer}>
        <TouchableOpacity
          style={styles.chooseLogoButton}
          onPress={selectImage}
          hitSlop={{ top: 30, right: 30, left: 30, bottom: 30 }}>
          <Icon name='plus' size={39} color='black' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogoModal;
