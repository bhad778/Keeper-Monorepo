import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import { AppHeaderText, AppText, KeeperModal, ModalHeader } from 'components';

import { useStyles } from './CompanyDescriptionModalStyles';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';
import { filterArrayOfObjectsByKey } from 'utils';

type TCompanyDescription = {
  name: string;
  description: string;
};

type CompanyDescriptionModalProps = {
  companyDescription: string;
  setCompanyDescription: (description: string) => void;
  companyDescriptionModalVisible: boolean;
  setCompanyDescriptionModalVisible: (companyDescriptionModalVisible: boolean) => void;
  title: string;
  placeholder?: string;
};

const CompanyDescriptionModal = ({
  companyDescription,
  setCompanyDescription,
  companyDescriptionModalVisible,
  setCompanyDescriptionModalVisible,
  title,
  placeholder,
}: CompanyDescriptionModalProps) => {
  const [isAddExistingCompanyModalOpen, setIsAddExistingCompanyModalOpen] = useState(false);
  const [pastCompanyDescriptions, setPastCompanyDescriptions] = useState<TCompanyDescription[]>([]);

  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);

  const styles = useStyles();

  useEffect(() => {
    if (employersJobs && employersJobs.length > 0) {
      const pastCompanyDescriptions = employersJobs?.map(job => {
        return { name: job.settings.companyName || '', description: job.settings.companyDescription || '' };
      });
      setPastCompanyDescriptions(filterArrayOfObjectsByKey(pastCompanyDescriptions, 'name'));
    }
  }, [employersJobs]);

  const onPressAddButton = () => {
    setIsAddExistingCompanyModalOpen(true);
  };

  const closeModal = () => {
    setIsAddExistingCompanyModalOpen(false);
  };

  const onSelectCompanyDescription = (description: string) => {
    setCompanyDescription(description);
    closeModal();
  };

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      isVisible={companyDescriptionModalVisible}
      style={styles.modal}>
      <KeeperModal isModalOpen={isAddExistingCompanyModalOpen} closeModal={closeModal} modalStyles={{ padding: 32 }}>
        <AppHeaderText style={styles.addPreviousHeader}>Add Existing Company Description</AppHeaderText>
        {pastCompanyDescriptions.map((item, index) => (
          <TouchableOpacity
            style={styles.menuListItem}
            onPress={() => onSelectCompanyDescription(item.description)}
            key={index}>
            <AppText style={styles.menuListText}>{item.name}</AppText>
          </TouchableOpacity>
        ))}
      </KeeperModal>
      <View style={styles.textSection}>
        <ModalHeader
          saveText={setCompanyDescription}
          text={companyDescription}
          leftIcon='chevron-left'
          screenTitle={title || 'The Company'}
          border={1}
          closeModal={setCompanyDescriptionModalVisible}
          onPressRightIcon={onPressAddButton}
          rightIcon={employersJobs?.length > 0 ? 'plus' : undefined}
        />

        <TextInput
          placeholder={placeholder}
          // placeholder={'What should the employee expect to do in this role?'}
          placeholderTextColor='black'
          value={companyDescription}
          style={styles.textInput}
          multiline={true}
          autoFocus
          onChangeText={descriptionText => setCompanyDescription(descriptionText)}
        />
      </View>
    </Modal>
  );
};

export default CompanyDescriptionModal;
