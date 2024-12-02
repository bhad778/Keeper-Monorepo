import { AppBoldText, Clickable } from 'components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import useStyles from './BackButtonStyles';

type BackButtonProps = {
  onClick?: () => void;
  containerStyles?: React.CSSProperties;
  iconStyles?: React.CSSProperties;
  textStyles?: React.CSSProperties;
  backText?: string;
};

const BackButton = ({ onClick, containerStyles, iconStyles, backText, textStyles }: BackButtonProps) => {
  const navigate = useNavigate();
  const styles = useStyles();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Clickable onClick={onClick || goBack} style={{ ...styles.backArrowContainer, ...containerStyles }}>
      <ArrowBackIcon sx={{ ...styles.backIcon, ...iconStyles }} />
      {backText && <AppBoldText style={{ ...styles.backText, ...textStyles }}>{backText}</AppBoldText>}
    </Clickable>
  );
};

export default BackButton;
