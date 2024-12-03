import { KeyboardEvent, useCallback, useState } from 'react';
import {
  AppText,
  Header,
  KeeperTextInput,
  KeeperModal,
  Clickable,
  AppHeaderText,
  SpinnerOverlay,
  ModalSaveButton,
} from 'components';
import Slider from '@mui/material/Slider';
import { useDebounce } from 'hooks';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';
import { MiscService } from 'services';
import { useTheme } from 'theme/theme.context';

import { useStyles } from './LocationModalStyles';

type LocationModalProps = {
  setLocationModalVisible: (value: boolean) => void;
  address: string;
  setAddress: (address: string) => void;
  updateState: (value: any, key: string) => void;
  searchRadius: number;
  jobColor?: string;
  onSiteOptionsOpenTo?: string[];
  onSiteSchedule?: string;
};

const LocationModal = ({
  address,
  setAddress,
  updateState,
  searchRadius,
  onSiteOptionsOpenTo,
  onSiteSchedule,
  setLocationModalVisible,
}: LocationModalProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const { theme } = useTheme();

  const [locationText, setLocationText] = useState(address || '');
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<any>();
  const [localSearchRadius, setLocalSearchRadius] = useState(searchRadius);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  const isEmployee = accountType === 'employee';

  const styles = useStyles();

  let isOnSite = false;

  if (onSiteOptionsOpenTo) {
    isOnSite = !onSiteOptionsOpenTo.includes('Remote');
  } else {
    isOnSite = onSiteSchedule === 'Hybrid' || onSiteSchedule === 'Office';
  }

  const debouncedGoogleMapsSuggest = useDebounce(async (locationText: string) => {
    if (locationText) {
      setIsLoading(true);

      const locationRes = await MiscService.getGoogleMapsLocations({
        locationText,
      });

      setIsLoading(false);
      if (locationText != '') {
        setLocationData(locationRes);
      } else {
        setLocationData(null);
      }
    }
  }, 700);

  const updateLocationData = useCallback(async (locationText: string) => {
    setLocationText(locationText);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement> | undefined) => {
    if (event && !event?.key.includes('Backspace')) {
      debouncedGoogleMapsSuggest(locationText);
    }
  };

  const onSelectLocation = useCallback((location: string) => {
    // we have to do setLocationText('') into setTimeout because if the text was being highlighted for autocorrect
    // setLocationText('') then it would cause a bug with autocorrect and put random text in the input, so we
    // need to clear the text, which removes the autocorrect, then setTimeout to wait until its cleared and then set our data
    setLocationText('');
    setTimeout(() => {
      if (location) {
        setLocationText(location.replace(/, USA/g, ''));
        setLocationData(null);
      }
    }, 100);

    setHasSelectionChanged(true);

    // closeModal();
  }, []);

  const onSaveClick = () => {
    setHasSelectionChanged(false);

    setAddress(locationText);
    setLocationData(null);

    closeModal();
  };

  const closeModal = () => {
    setLocationModalVisible(false);
  };

  return (
    <KeeperModal modalStyles={styles.modal} isOpen closeModal={closeModal}>
      <ModalSaveButton onSaveClick={onSaveClick} disabled={!hasSelectionChanged} />
      <AppHeaderText
        style={{
          color: 'white',
          fontSize: 24,
        }}
      >
        {isEmployee ? 'CITY' : 'COMPANY LOCATION'}
      </AppHeaderText>
      <div style={styles.contentsContainer}>
        <div style={styles.textInputContainer}>
          <KeeperTextInput
            autoCorrect={false}
            value={locationText}
            autoFocus
            isLoading={isLoading}
            onChange={updateLocationData}
            onKeyDown={onKeyDown}
            placeholder="Search for company city."
          />
        </div>

        {!locationData
          ? null
          : !(locationText === '' || locationText === locationData[0]?.description) && (
              <div style={styles.cityOptionsButtonsContainer}>
                <Clickable
                  onClick={() => onSelectLocation(locationData[0]?.description || '')}
                  style={styles.cityOptionsButton}
                >
                  <AppText style={styles.cityOptionsButtonText}>
                    {locationData[0]?.description?.replace(/, USA/g, '')}
                  </AppText>
                </Clickable>
                <Clickable
                  onClick={() => onSelectLocation(locationData[1]?.description || '')}
                  style={styles.cityOptionsButton}
                >
                  <AppText style={styles.cityOptionsButtonText}>
                    {locationData[1]?.description?.replace(/, USA/g, '')}
                  </AppText>
                </Clickable>
                <Clickable
                  onClick={() => onSelectLocation(locationData[2]?.description || '')}
                  style={styles.lastCityOptionsButton}
                >
                  <AppText style={styles.cityOptionsButtonText}>
                    {locationData[2]?.description?.replace(/, USA/g, '')}
                  </AppText>
                </Clickable>
              </div>
            )}
        {/* {isOnSite && (
          <div style={styles.searchRadiusContainer}>
            <Header text="Search Radius" textInputLabelStyle={styles.searchRadiusTitle} />
            <Header text={`${localSearchRadius} miles`} textInputLabelStyle={styles.searchRadiusValue} />
            <Slider
              aria-label="Volume"
              value={localSearchRadius}
              onChange={(event: Event, newValue: number | number[]) => {
                setLocalSearchRadius(newValue as number);
              }}
              onChangeCommitted={(event: unknown, newValue: number | number[]) => {
                updateState(newValue, 'searchRadius');
              }}
              sx={{
                '& .MuiSlider-thumb': {
                  color: 'white',
                },
                '& .MuiSlider-track': {
                  color: theme.color.pink,
                },
                '& .MuiSlider-rail': {
                  color: theme.color.keeperGrey,
                },
              }}
              marks
              step={10}
              min={10}
              max={100}
            />
          </div>
        )} */}
      </div>
    </KeeperModal>
  );
};

export default LocationModal;
