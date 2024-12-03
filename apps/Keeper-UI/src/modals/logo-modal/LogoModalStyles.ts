import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = (
  logo: string | undefined,
  isEmployee?: boolean,
  isError?: boolean,
  isImageUploading?: boolean,
) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      width: SCREEN_WIDTH,
      backgroundColor: theme.color.white,
      margin: 0,
    },
    spinner: {
      position: 'absolute',
      top: SCREEN_HEIGHT / 2,
      left: SCREEN_WIDTH / 2 - 10,
      zIndex: 1,
    },
    imageSelectorSection: {
      width: '100%',
      height: logo ? SCREEN_WIDTH : 250,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: logo ? 'visible' : 'hidden',
      backgroundColor: logo || isImageUploading ? theme.color.primary : theme.color.darkGrey,
    },
    logoImage: {
      // this 10 comes from the paddingHorizontal on scrollview class in AddJobStyles
      height: SCREEN_WIDTH,
      width: SCREEN_WIDTH,
      position: 'absolute',
    },
    profileImgPlaceholder: {
      backgroundColor: theme.color.darkGrey,
      width: '100%',
      height: 350,
      position: 'absolute',
      top: -37,
    },
    emptyCompanyLogoContainer: {
      backgroundColor: theme.color.darkGrey,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 350,
      position: 'absolute',
      top: -37,
    },
    companyLogoText: {
      color: theme.color.white,
      bottom: 50,
      zIndex: 99,
      fontSize: 40,
      width: '80%',
      textAlign: 'center',
      lineHeight: 45,
    },
    chooseLogoButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: isEmployee ? 35 : 21,
      top: logo ? 175 : 75,
      width: '100%',
    },
    chooseLogoButton: {
      backgroundColor: isError ? theme.color.alert : theme.color.pink,
      borderRadius: 99,
      height: 50,
      width: 50,
      justifyContent: 'center',
      alignItems: 'center',
      // borderWidth: 1,
      // borderStyle: 'solid',
      // borderColor: theme.color.primary,
    },
  });

  return styles;
};

export default useStyles;
