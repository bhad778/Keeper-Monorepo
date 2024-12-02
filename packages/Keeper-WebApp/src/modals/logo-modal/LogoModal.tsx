import React from 'react';
import { useAwsUtils } from 'services';
import { KeeperImage, AppText } from 'components';
import AddIcon from '@mui/icons-material/Add';
import ProfileImgPlaceholder from 'assets/svgs/profile_img_placeholder.svg?react';
import Button from '@mui/material/Button';
import { convertBase64 } from 'utils/globalUtils';

import { useStyles } from './LogoModalStyles';

type LogoModalProps = {
  logo: string | undefined;
  setLogo: (logo: string) => void;
  isEmployee?: boolean;
  isError?: boolean;
  isJobPosting?: boolean;
  style?: React.CSSProperties;
};

const LogoModal = ({ logo, setLogo, isEmployee, isError, isJobPosting, style }: LogoModalProps) => {
  const { isImageUploading, pickImage } = useAwsUtils();

  const styles = useStyles(logo, isError, isJobPosting);

  // useEffect(() => {
  //   (async () => {
  //     // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     // if (status !== 'granted') {
  //     //   alert('We ask permission to access the camera to allow you to upload photos to your profile.');
  //     // }
  //   })();
  // }, []);

  const handleFileRead = async (event: any) => {
    const file = event.target.files[0];
    const mime = file.type;
    const base64Image = await convertBase64(file);
    if (typeof base64Image === 'string') {
      // const image = await pickImage();
      const image = await pickImage(base64Image, mime);

      if (image && image.uri) {
        setLogo(image.uri);
      }
    }
  };

  return (
    <div style={styles.imageSelectorSection}>
      {logo || isImageUploading ? (
        <KeeperImage
          style={{ ...styles.logoImage, ...style }}
          resizeMode="contain"
          source={logo || ''}
          isApiCallLoading={isImageUploading}
        />
      ) : isEmployee ? (
        <ProfileImgPlaceholder style={styles.profileImgPlaceholder} />
      ) : (
        <div style={styles.emptyCompanyLogoContainer}>
          <AppText style={styles.companyLogoText}>COMPANY LOGO</AppText>
        </div>
      )}
      <div style={styles.logoButtonContainer}>
        <Button style={styles.chooseLogoButton} variant="contained" component="label">
          <AddIcon name="plus" style={{ fontSize: 50, color: 'black' }} />

          <input hidden accept="image/png, image/jpeg, image/jpg" type="file" onChange={handleFileRead} />
        </Button>
      </div>
    </div>
  );
};

export default LogoModal;
