import React, { useCallback, useEffect, useState } from 'react';
import { View, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { RedesignModalHeader } from 'components';
import { ScrollView } from 'react-native-gesture-handler';
import { AlertModal } from 'modals';

import { useStyles } from './LargeDescriptionModalStyles';
import { backoutWithoutSavingSubTitle, backoutWithoutSavingTitle } from 'constants/globalConstants';

// type TCompanyDescription = {
//   name: string;
//   description: string;
// };

type TLargeDescriptionModal = {
  text: string;
  setText: (text: string) => void;
  isVisible: boolean;
  setIsVisible: (companyDescriptionModalVisible: boolean) => void;
  title: string;
  placeholder?: string;
};

const LargeDescriptionModal = ({
  text,
  setText,
  isVisible,
  setIsVisible,
  title,
  placeholder,
}: TLargeDescriptionModal) => {
  const [localText, setLocalText] = useState(text);
  // const [isAddExistingCompanyModalOpen, setIsAddExistingCompanyModalOpen] = useState(false);
  // this is only for when changing company description, it is what you see when pressing
  // plus button it contains past company description you can select from to save time
  // const [pastCompanyDescriptions, setPastCompanyDescriptions] = useState<TCompanyDescription[]>([]);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);

  const styles = useStyles();

  useEffect(() => {
    // every time you open or close the modal, localBenefits is synced with benefits from AddJob.tsx
    setLocalText(text);
    setHasSelectionChanged(false);
  }, [isVisible]);

  // get pastCompanyDescriptions
  // useEffect(() => {
  //   if (employersJobs && employersJobs.length > 0) {
  //     const pastCompanyDescriptions = employersJobs?.map(job => {
  //       return { name: job.settings.companyName || '', description: job.settings.companyDescription || '' };
  //     });
  //     setPastCompanyDescriptions(filterArrayOfObjectsByKey(pastCompanyDescriptions, 'name'));
  //   }
  // }, [employersJobs]);

  // const onPressAddButton = useCallback(() => {
  //   setIsAddExistingCompanyModalOpen(true);
  // }, []);

  // const onSelectCompanyDescription = useCallback(
  //   (description: string) => {
  //     setLocalText(description);
  //     closeAddPastJobDescriptionModal();
  //   },
  //   [closeAddPastJobDescriptionModal],
  // );

  // const closeAddPastJobDescriptionModal = useCallback(() => {
  //   setIsAddExistingCompanyModalOpen(false);
  // }, []);

  const onChangeText = (newText: string) => {
    setHasSelectionChanged(true);
    setLocalText(newText);
  };

  const onBackButtonPress = () => {
    if (hasSelectionChanged) {
      setIsAlertModalOpen(true);
    } else {
      closeModal();
    }
  };

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
  }, []);

  const closeModal = useCallback(() => {
    setLocalText('');
    setIsVisible(false);
    setHasSelectionChanged(false);
    closeAlertModal();
  }, [setIsVisible]);

  const onSave = () => {
    setText(localText);
    setIsVisible(false);
    closeModal();
  };

  return (
    <Modal animationIn='slideInRight' animationOut='slideOutRight' isVisible={isVisible} style={styles.modal}>
      <AlertModal
        isOpen={isAlertModalOpen}
        title={backoutWithoutSavingTitle}
        subTitle={backoutWithoutSavingSubTitle}
        closeModal={closeAlertModal}
        onConfirmPress={closeModal}
      />
      {/* <KeeperModal
        isModalOpen={isAddExistingCompanyModalOpen}
        closeModal={closeAddPastJobDescriptionModal}
        modalStyles={styles.keeperModal}>
        <AppHeaderText style={styles.addPreviousHeader}>Add Existing Company Description</AppHeaderText>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {pastCompanyDescriptions.map((item, index) => (
            <TouchableOpacity
              style={styles.menuListItem}
              onPress={() => onSelectCompanyDescription(item.description)}
              key={index}>
              <AppText style={styles.menuListText}>{item.name}</AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeeperModal> */}
      <RedesignModalHeader
        title={title}
        goBackAction={onBackButtonPress}
        onSave={onSave}
        isSaveDisabled={!hasSelectionChanged}
      />
      {/* {!isEmployee && employersJobs?.length > 0 && title === 'The Company' && (
          <TouchableOpacity onPress={onPressAddButton} hitSlop={50}>
            <Icon name='plus' size={30} color='white' />
          </TouchableOpacity>
        )}
      </RedesignModalHeader> */}
      <ScrollView contentContainerStyle={styles.screenScrollView}>
        <View style={styles.textSection}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor='white'
            value={localText}
            style={styles.textInput}
            multiline={true}
            autoFocus
            onChangeText={onChangeText}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

export default LargeDescriptionModal;
