import React, { memo, useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View, ScrollView, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { ResumeComponent, EditEmployee, AppBoldText, KeeperSpinnerOverlay, RedesignModalHeader } from 'components';
import { RootState } from 'reduxStore';
import { TEmployeeSettings } from 'keeperTypes';
import { UsersService } from 'services';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SettingsModal } from 'modals';

import { useStyles } from './ViewResumeStyles';

type ViewResumeProps = {
  closeResumePreviewModal?: () => void;
  previewEmployeeData?: TEmployeeSettings;
  areAllFieldsCompleted?: boolean;
  onCheckPress?: () => Promise<void>;
};

// this is the screen that employees
// see when they view their own resume
const ViewResume = ({
  closeResumePreviewModal,
  previewEmployeeData,
  areAllFieldsCompleted,
  onCheckPress,
}: ViewResumeProps) => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const loggedInEmployeeSettings = useSelector((state: RootState) => state.loggedInUser.settings);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const isEmployeeNew = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);

  const navigation = useNavigation();
  const route = useRoute();

  // this will be filled if coming from deep link
  const otherUserId = route?.params?.otherUserId;

  const isEmployee = accountType === 'employee';
  const shouldShowBackIcon = isEmployee && isEmployeeNew;

  const [employeeSettings, setEmployeeSettings] = useState<TEmployeeSettings | undefined>(
    otherUserId ? undefined : previewEmployeeData || loggedInEmployeeSettings,
  );
  const [isEditEmployeeModal, setIsEditEmployeeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isKeeperProModalOpen, setIsKeeperProModalOpen] = useState(false);

  const styles = useStyles();

  useEffect(() => {
    if (!previewEmployeeData) {
      setEmployeeSettings(loggedInEmployeeSettings);
    }
  }, [loggedInEmployeeSettings]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const employeeData = await UsersService.getEmployee({ userId: otherUserId || '' });
        if (employeeData.error && employeeData.error == 'Account deleted error') {
          Alert.alert('This user no longer exists!', 'Press ok to go back.', [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
        } else {
          setEmployeeSettings(employeeData.settings);
        }
      } catch (error) {
        Alert.alert('There was an error!', 'Press ok to go back.', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
      setIsLoading(false);
    };
    if (otherUserId) {
      getData();
    }
  }, []);

  const onSubmitPress = () => {
    if (closeResumePreviewModal && onCheckPress) {
      closeResumePreviewModal();
      onCheckPress();
    }
  };

  const openSettings = () => {
    setIsSettingsModalOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsModalOpen(false);
  };

  const onKeeperProPress = () => {
    setIsKeeperProModalOpen(true);
  };

  const closeKeeperProModal = () => {
    setIsKeeperProModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <SettingsModal
        isSettingsModalOpen={isSettingsModalOpen}
        closeSettings={closeSettings}
        isKeeperProModalOpen={isKeeperProModalOpen}
        closeKeeperProModal={closeKeeperProModal}
        onKeeperProPress={onKeeperProPress}
      />

      {isEditEmployeeModal && (
        <Modal animationType='slide' visible={isEditEmployeeModal}>
          <EditEmployee
            setEditEmployeeModalVisible={setIsEditEmployeeModal}
            editEmployeeData={{ employeeSettings: loggedInEmployeeSettings, _id: loggedInUserId }}
            isModal
          />
        </Modal>
      )}
      <View style={styles.viewResumeContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
          <RedesignModalHeader
            title={otherUserId ? 'Resume' : 'Your Resume'}
            // passing false means no back button
            goBackAction={shouldShowBackIcon ? closeResumePreviewModal : false}
            cogIconAction={!shouldShowBackIcon ? openSettings : false}
            containerStyles={styles.noBottomBorder}>
            {!otherUserId && !previewEmployeeData && (
              <TouchableOpacity onPress={() => setIsEditEmployeeModal(true)} hitSlop={30}>
                <AppBoldText style={styles.submitText}>Edit</AppBoldText>
              </TouchableOpacity>
            )}
            {areAllFieldsCompleted && (
              <TouchableOpacity onPress={onSubmitPress} hitSlop={30}>
                <AppBoldText style={styles.submitText}>Submit</AppBoldText>
              </TouchableOpacity>
            )}
          </RedesignModalHeader>

          {employeeSettings ? (
            <ResumeComponent isOwner={true} currentEmployeeSettings={{ ...employeeSettings }} />
          ) : (
            <View style={styles.loadingContainer}>
              <KeeperSpinnerOverlay isLoading={isLoading} />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default memo(ViewResume);
