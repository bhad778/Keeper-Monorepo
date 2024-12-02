import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, TextInputKeyPressEventData, NativeSyntheticEvent } from 'react-native';
import Modal from 'react-native-modal';
import { AppText, EditProfileTitle, KeeperSpinnerOverlay, KeeperTextInput, RedesignModalHeader } from 'components';
import Slider from '@react-native-community/slider';
import { useDebounce } from 'hooks';
import { useTheme } from 'theme/theme.context';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';

import { useStyles } from './LocationModalStyles';
import getEnvVars from '../../../environment';

type LocationModalProps = {
  locationModalVisible: boolean;
  setLocationModalVisible: (locationModalVisible: boolean) => void;
  address: string;
  setAddress: (address: string) => void;
  updateState: (value: any, key: string) => void;
  searchRadius: number;
  jobColor?: string;
  onSiteOptionsOpenTo?: string[];
  onSiteSchedule?: string;
};

const LocationModal = ({
  locationModalVisible,
  setLocationModalVisible,
  address,
  setAddress,
  updateState,
  searchRadius,
  onSiteOptionsOpenTo,
  onSiteSchedule,
}: LocationModalProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const [locationText, setLocationText] = useState(address || '');
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<any>();
  const [localSearchRadius, setLocalSearchRadius] = useState(searchRadius);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  const isEmployee = accountType === 'employee';

  const { googleMapsApiKey } = getEnvVars();
  const { theme } = useTheme();
  const styles = useStyles();

  let isOnSite = false;

  if (onSiteOptionsOpenTo) {
    isOnSite = !onSiteOptionsOpenTo.includes('Remote');
  } else {
    isOnSite = onSiteSchedule === 'Hybrid' || onSiteSchedule === 'Office';
  }

  const debouncedGoogleMapsSuggest = useDebounce(async (locationText: string) => {
    setIsLoading(true);
    const locationRes = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${locationText}&types=geocode&key=${googleMapsApiKey}`,
    );
    setIsLoading(false);
    if (locationText != '') {
      setLocationData(locationRes);
    } else {
      setLocationData(null);
    }
  }, 700);

  const updateLocationData = useCallback(
    async (locationText: string) => {
      setLocationText(locationText);
    },
    [debouncedGoogleMapsSuggest],
  );

  const onKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event && event.nativeEvent?.key != 'Backspace') {
      debouncedGoogleMapsSuggest(locationText);
    }
  };

  const onSelectLocation = useCallback(
    (location: string) => {
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
    },
    [setAddress],
  );

  const onSaveClick = () => {
    setHasSelectionChanged(false);

    setAddress(locationText);
    setLocationData(null);

    closeModal();
  };

  const closeModal = () => {
    setLocationModalVisible(false);
    setLocationText('');
  };

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={locationModalVisible}>
      <KeeperSpinnerOverlay isLoading={isLoading} />

      <RedesignModalHeader
        title={isEmployee ? 'LOCATION' : 'COMPANY LOCATION'}
        goBackAction={closeModal}
        onSave={onSaveClick}
        isSaveDisabled={!hasSelectionChanged}
      />
      <View style={styles.contentsContainer}>
        <View style={styles.textInputContainer}>
          <KeeperTextInput
            autoCorrect={false}
            value={locationText}
            autoFocus
            onChangeText={updateLocationData}
            onKeyPress={onKeyPress}
          />
        </View>
        {!locationData
          ? null
          : !(locationText === '' || locationText === locationData?.data?.predictions[0]?.description) && (
              <View style={styles.cityOptionsButtonsContainer}>
                <View style={styles.pointerTip} />
                <TouchableOpacity
                  onPress={() => onSelectLocation(locationData?.data?.predictions[0]?.description || '')}
                  style={styles.cityOptionsButton}>
                  <AppText style={styles.cityOptionsButtonText}>
                    {locationData?.data?.predictions[0]?.description?.replace(/, USA/g, '')}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSelectLocation(locationData?.data?.predictions[1]?.description || '')}
                  style={styles.cityOptionsButton}>
                  <AppText style={styles.cityOptionsButtonText}>
                    {locationData?.data?.predictions[1]?.description?.replace(/, USA/g, '')}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSelectLocation(locationData?.data?.predictions[2]?.description || '')}
                  style={styles.lastCityOptionsButton}>
                  <AppText style={styles.cityOptionsButtonText}>
                    {locationData?.data?.predictions[2]?.description?.replace(/, USA/g, '')}
                  </AppText>
                </TouchableOpacity>
              </View>
            )}
        {/* {isOnSite && (
          <View style={styles.searchRadiusContainer}>
            <EditProfileTitle text='Search Radius' />
            <EditProfileTitle text={`${localSearchRadius} miles`} />
            <Slider
              value={localSearchRadius}
              onValueChange={value => {
                setLocalSearchRadius(value);
              }}
              step={10}
              onSlidingComplete={(value: number) => updateState(value, 'searchRadius')}
              maximumTrackTintColor='grey'
              minimumTrackTintColor={theme.color.pink}
              style={styles.slider}
              minimumValue={10}
              maximumValue={100}
            />
          </View>
        )} */}
      </View>
    </Modal>
  );
};

export default LocationModal;
