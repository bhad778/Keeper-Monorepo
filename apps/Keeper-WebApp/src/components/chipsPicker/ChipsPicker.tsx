import { useEffect, useState } from 'react';
import { KeeperSelectButton, KeeperTextInput } from 'components';

import { useStyles } from './ChipsPickerStyles';

type ChipsPickerProps = {
  chipsData: string[];
  selectedChips: string[];
  setSelectedChips: (selectedChips: string[]) => void;
  selectedChipColor?: string;
  maxCount: number;
};

const ChipsPicker = ({ chipsData, selectedChips, setSelectedChips, selectedChipColor, maxCount }: ChipsPickerProps) => {
  const [filteredChips, setFilteredChips] = useState<string[]>(chipsData);
  const [addSkillText, setAddSkillText] = useState('');
  const [addedChips, setAddedChips] = useState<string[]>(selectedChips.filter((val) => !chipsData.includes(val)));
  const [filteredAddedChips, setFilteredAddedChips] = useState<string[]>([]);

  const styles = useStyles();

  useEffect(() => {
    setFilteredAddedChips(addedChips);
  }, [addedChips]);

  const onSelectChip = (selectedChipName: string) => {
    if (!selectedChips.includes(selectedChipName) && selectedChips.length < maxCount) {
      setSelectedChips([...selectedChips, selectedChipName]);
    } else {
      const updatedFilteredSelectedChips = selectedChips.filter((e) => e !== selectedChipName);
      updatedFilteredSelectedChips.sort();
      setSelectedChips(updatedFilteredSelectedChips);

      const updatedSelectedChips = selectedChips.filter((e) => e !== selectedChipName);
      updatedSelectedChips.sort();
      setSelectedChips(updatedSelectedChips);
    }
  };

  const returnChipsFiltered = () => {
    return filteredChips.map((name: string) => (
      <KeeperSelectButton
        buttonStyles={styles.keeperButtonStyles}
        // unSelectedButtonStyles={styles.unSelectedButtonStyles}
        // selectedButtonStyles={styles.selectedButtonStyles}
        selectedTextStyles={styles.selectedTextStyles}
        selected={selectedChips.includes(name)}
        onClick={onSelectChip}
        title={name}
        key={name}
      />
    ));
  };

  const returnAddedChips = () => {
    return filteredAddedChips.map((name: string, index: number) => (
      <KeeperSelectButton
        buttonStyles={styles.keeperButtonStyles}
        // unSelectedButtonStyles={styles.unSelectedButtonStyles}
        // selectedButtonStyles={styles.selectedButtonStyles}
        selectedTextStyles={styles.selectedTextStyles}
        selected={selectedChips.includes(name)}
        onClick={onSelectChip}
        title={name}
        key={index}
      />
    ));
  };

  const filterChips = (searchText: string) => {
    if (searchText) {
      const updatedChips = chipsData.filter((name) => name.toLocaleLowerCase().includes(searchText.toLowerCase()));
      setFilteredChips(updatedChips);
      const updatedAddedChips = addedChips.filter((name) =>
        name.toLocaleLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredAddedChips(updatedAddedChips);
    } else {
      setFilteredChips(chipsData);
      setFilteredAddedChips(addedChips);
    }
  };

  const onPressAddChip = () => {
    if (addSkillText) {
      setAddedChips((prev) => {
        return [...prev, addSkillText];
      });
      setAddSkillText('');
    }
  };

  return (
    <div style={styles.chipsPickerContainer}>
      <KeeperTextInput placeholder="Search Skills" onChange={filterChips} autoCorrect={false} />
      <div style={styles.addedChipsContainer}>
        <KeeperTextInput
          placeholder="Enter New Skill"
          value={addSkillText}
          containerStyles={{ width: '100%' }}
          inputStyles={{ width: '100%' }}
          onChange={setAddSkillText}
          autoCorrect={false}
        />

        <KeeperSelectButton
          buttonStyles={styles.addSkillButton}
          textStyles={styles.addSkillText}
          onClick={onPressAddChip}
          title="Add Skill"
        />
      </div>
      <div style={styles.chipsScrollView}>
        {returnAddedChips()}
        {returnChipsFiltered()}
      </div>
    </div>
  );
};

export default ChipsPicker;
