import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import ModalHeader from '../../components/modal-header/ModalHeader';
import Modal from 'react-native-modal';
import { useStyles } from './SearchRadiusModalStyles';
import { AppText } from 'components';
import { useTheme } from 'theme/theme.context';

type SearchRadiusModalProps = {
  searchRadiusModalVisible: boolean;
  setSearchRadiusModalVisible: (searchRadiusModalVisible: boolean) => void;
  searchRadius: number;
  setSearchRadius: (searchRadius: number) => void;
};

const SearchRadiusModal = ({
  searchRadiusModalVisible,
  setSearchRadiusModalVisible,
  searchRadius,
  setSearchRadius,
}: SearchRadiusModalProps) => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={searchRadiusModalVisible}>
      <View style={styles.sliderSection}>
        <ModalHeader
          leftIcon='chevron-left'
          border={1}
          closeModal={setSearchRadiusModalVisible}
          screenTitle='Search Radius'
        />

        <View>
          <View>
            <AppText>{`${searchRadius} miles`}</AppText>
          </View>

          <Slider
            value={searchRadius}
            onValueChange={setSearchRadius}
            minimumTrackTintColor={theme.color.pink}
            style={{ width: 200, height: 40 }}
            minimumValue={10}
            maximumValue={100}
            step={1}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SearchRadiusModal;
