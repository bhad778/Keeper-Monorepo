import { useTheme } from 'theme/theme.context';
import { TEmployeeEducation } from 'keeperTypes';

export const useStyles = (textColor: string | undefined, isSmallScreen: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    numberText: {
      fontSize: 15,
      color: textColor || theme.color.white,
    },
    educationMajorText: {
      fontFamily: 'app-header-font',
      fontSize: 25,
      paddingBottom: 6,
      color: textColor || theme.color.white,
    },
    educationDegreeAndSchoolText: {
      color: textColor || theme.color.white,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    educationItemContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    bulletPoint: {
      paddingLeft: 5,
      paddingRight: 5,
    },
    educationTextContainer: {
      flexDirection: 'row',
    },
    circle: {
      fontSize: 9,
      color: textColor,
      right: 4,
      marginRight: 3,
      marginLeft: 3,
      paddingTop: 3,
      paddingRight: 10,
    },
  } as const;

  return styles;
};

export default useStyles;
