import { useCallback, useRef, useState } from 'react';
import React from 'react';
import {
  AppText,
  KeeperTouchable,
  KeeperSelectButton,
  RedesignModalHeader,
  KeeperMultiLineTextInput,
} from 'components';
import { View, Text } from 'react-native';
import { useTheme } from 'theme/theme.context';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Feather';

import { useStyles } from './ResponsibilitiesModal2Styles';

const placeholderExamplesArray = [
  'Ex: We’re looking for someone with a strong grasp of software architecture principles. You should be capable of designing modular, scalable, and maintainable systems that stand the test of time.',
  'Ex: Minimum 3 years of front-end development experience. A portfolio that demonstrates your expertise with React, AWS Amplify, GraphQL, Zustand, and Redux is highly valued.',
  'Ex: You should have a solid understanding of front-end technologies and be proficient in at least most of the technologies we work with.',
  'Ex: Strong experience with VueJS or another modern JavaScript web framework (React, Angular, etc.)',
  'Ex: Experience with writing automated tests (e.g. Jest, Karma, Jasmine, Mocha, AVA, tape)',
  'Ex: Experience with Typescript or any out of Go, Python or .Net is a plus',
  'Ex: A commitment to continuous learning and openness to giving and receiving feedback as a part of fostering individual and team development',
  'Ex: A minimum of 2 years of professional experience in a tech company. ',
  'Ex: A quick and adaptable learner, able to take on multiple roles. ',
  'Ex: You have skills in Typescript/Javascript, HTML, CSS and have experience developing full-featured client-side applications using front-end frameworks such as React/Redux,.',
];

type ResponsibilitiesModalProps = {
  responsibilities: string[];
  responsibilitiesModalVisible: boolean;
  setResponsibilitiesModalVisible: (responsibilitiesModalVisible: boolean) => void;
  setResponsibilities: (responsibilities: any) => void;
};

const ResponsibilitiesModal2 = ({
  responsibilities,
  setResponsibilities,
  responsibilitiesModalVisible,
  setResponsibilitiesModalVisible,
}: ResponsibilitiesModalProps) => {
  const [localResponsibilities, setLocalResponsibilities] = useState(
    responsibilities.length > 0 ? responsibilities : ['', '', ''],
  );
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);
  const { theme } = useTheme();
  const scrollRef = useRef(null);
  const styles = useStyles();

  const addBlankResponsibility = () => {
    setLocalResponsibilities(['', ...localResponsibilities]);

    if (scrollRef && scrollRef?.current && scrollRef?.current?.scrollTo) {
      scrollRef?.current?.scrollTo(0, 0);
    }
  };

  const removeResponsibility = useCallback(
    (index: number) => {
      if (localResponsibilities.length >= 1) {
        const removeResponsibility = [...localResponsibilities];
        removeResponsibility.splice(index, 1);
        setLocalResponsibilities(removeResponsibility);
        setHasSelectionChanged(true);
      }
    },
    [localResponsibilities, setLocalResponsibilities],
  );

  const editResponsibility = (newResponsibility: string, selectedResponsibilityIndex: number) => {
    if (selectedResponsibilityIndex !== null) {
      const currentResponsibilities = [...localResponsibilities];
      currentResponsibilities[selectedResponsibilityIndex] = newResponsibility;
      setLocalResponsibilities(currentResponsibilities);
      setHasSelectionChanged(true);
    }
  };

  const textBox = (responsibility: string, index: number) => {
    const placeholderIndex = (localResponsibilities.length - 1 - index) % placeholderExamplesArray.length;
    return (
      <View style={styles.keeperTextInputContainer} key={index}>
        <KeeperTouchable style={styles.deleteButtonStyles} onPress={() => removeResponsibility(index)}>
          <Icon name='x' size={17} />
        </KeeperTouchable>

        {/* <CircleIcon sx={styles.rightArrow} /> */}

        <KeeperMultiLineTextInput
          value={responsibility}
          textColor={theme.color.white}
          onChangeText={(text: string) => editResponsibility(text, index)}
          // this logic ensures that its always only the last localResponsibilities?.length that get the placeholder text
          placeHolder={placeholderExamplesArray[placeholderIndex]}
        />
      </View>
    );
  };

  const closeModal = () => {
    setHasSelectionChanged(false);
    setResponsibilitiesModalVisible(false);
  };

  const saveModal = () => {
    // remove blank responsibilities
    const filteredResponsibilities = localResponsibilities.filter(resp => resp != '');

    setResponsibilities(filteredResponsibilities);
    closeModal();
  };

  return (
    <Modal style={styles.modal} isVisible={responsibilitiesModalVisible}>
      <RedesignModalHeader
        title={`YOU'RE A FIT IF`}
        goBackAction={closeModal}
        onSave={saveModal}
        isSaveDisabled={!hasSelectionChanged}
      />
      <View style={styles.contents}>
        <AppText style={styles.topText}>This will be a bulleted list of characteristics.</AppText>

        <KeyboardAwareScrollView
          style={styles.yourAFitItemsContainer}
          ref={scrollRef}
          persistentScrollbar
          keyboardShouldPersistTaps={false}>
          {localResponsibilities?.length >= 0
            ? localResponsibilities.map((responsibility, index) => {
                return textBox(responsibility, index);
              })
            : null}
        </KeyboardAwareScrollView>
        <KeeperSelectButton
          buttonStyles={styles.addToListButton}
          onPress={addBlankResponsibility}
          title='ADD TO LIST'></KeeperSelectButton>
      </View>
    </Modal>
  );
};

export default ResponsibilitiesModal2;
