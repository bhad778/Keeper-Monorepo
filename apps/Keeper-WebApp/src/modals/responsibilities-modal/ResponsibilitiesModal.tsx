import { useCallback, useRef, useState } from 'react';
import {
  AppHeaderText,
  AppText,
  Clickable,
  KeeperModal,
  KeeperMultiLineInput,
  KeeperSelectButton,
  ModalSaveButton,
} from 'components';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';

import { useStyles } from './ResponsibilitiesModalStyles';

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

const ResponsibilitiesModal = ({
  responsibilities,
  setResponsibilities,
  setResponsibilitiesModalVisible,
}: ResponsibilitiesModalProps) => {
  const [localResponsibilities, setLocalResponsibilities] = useState(
    responsibilities.length > 0 ? responsibilities : ['', '', '']
  );
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  const scrollRef = useRef(null);
  const styles = useStyles();

  const addBlankResponsibility = () => {
    setLocalResponsibilities(['', ...localResponsibilities]);

    scrollRef?.current?.scrollTo(0, 0);
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
    [localResponsibilities, setLocalResponsibilities]
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
    return (
      <div style={styles.keeperTextInputContainer} key={index}>
        <Clickable style={styles.deleteButtonStyles} onClick={() => removeResponsibility(index)}>
          <CloseIcon sx={styles.xIcon} />
        </Clickable>

        <CircleIcon sx={styles.rightArrow} />

        <KeeperMultiLineInput
          value={responsibility}
          rows={3}
          autoFocus={index === 0}
          onChange={(event: any) => editResponsibility(event.target.value, index)}
          // this logic ensures that its the always only the last localResponsibilities?.length that get the placeholder text
          placeholder={placeholderExamplesArray[localResponsibilities?.length - 1 - index]}
        />
      </div>
    );
  };

  const closeModal = () => {
    setHasSelectionChanged(false);
    setResponsibilitiesModalVisible(false);
  };

  const saveModal = () => {
    // remove blank responsibilities
    const filteredResponsibilities = localResponsibilities.filter((resp) => resp != '');

    setResponsibilities(filteredResponsibilities);
    closeModal();
  };

  return (
    <KeeperModal modalStyles={styles.modal} isOpen closeModal={closeModal}>
      <div style={styles.topContentsContainer}>
        <ModalSaveButton onSaveClick={saveModal} disabled={!hasSelectionChanged} />
        <AppHeaderText style={styles.yourAFitIfText}>YOU'RE A FIT IF</AppHeaderText>

        <AppText style={styles.topText}>This will be a bulleted list of characteristics.</AppText>

        <KeeperSelectButton
          buttonStyles={styles.addToListButton}
          onClick={addBlankResponsibility}
          title="ADD TO LIST"
        ></KeeperSelectButton>
      </div>

      <div style={styles.yourAFitItemsContainer} ref={scrollRef}>
        {localResponsibilities?.length >= 0
          ? localResponsibilities.map((responsibility, index) => {
              return textBox(responsibility, index);
            })
          : null}
      </div>
    </KeeperModal>
  );
};

export default ResponsibilitiesModal;
