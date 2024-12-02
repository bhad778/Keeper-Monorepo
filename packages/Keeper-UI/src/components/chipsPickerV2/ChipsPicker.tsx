import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { KeeperSelectButton, KeeperTextInput } from 'components';

import { useStyles } from './ChipsPickerStyles';

type ChipsPickerProps = {
  chipsData: string[];
  selectedChips: string[];
  setSelectedChips: (selectedChips: string[]) => void;
  maxCount?: number;
};

const ChipsPicker = ({ chipsData, selectedChips, setSelectedChips, maxCount = 60 }: ChipsPickerProps) => {
  const [filteredChips, setFilteredChips] = useState<string[]>(chipsData);
  const [addSkillText, setAddSkillText] = useState('');
  const [addedChips, setAddedChips] = useState<string[]>(selectedChips.filter(val => !chipsData.includes(val)));
  const [filteredAddedChips, setFilteredAddedChips] = useState<string[]>([]);

  const styles = useStyles();

  useEffect(() => {
    setFilteredAddedChips(addedChips);
  }, [addedChips]);

  const onSelectChip = useCallback(
    (selectedChipName: string) => {
      if (!selectedChips.includes(selectedChipName) && selectedChips.length < maxCount) {
        setSelectedChips([...selectedChips, selectedChipName]);
      } else {
        const updatedFilteredSelectedChips = selectedChips.filter(e => e !== selectedChipName);
        updatedFilteredSelectedChips.sort();
        setSelectedChips(updatedFilteredSelectedChips);

        const updatedSelectedChips = selectedChips.filter(e => e !== selectedChipName);
        updatedSelectedChips.sort();
        setSelectedChips(updatedSelectedChips);
      }
    },
    [selectedChips, maxCount, setSelectedChips],
  );

  const returnChipsFiltered = useCallback(() => {
    return filteredChips.map((name: string) => (
      <KeeperSelectButton
        buttonStyles={styles.keeperButtonStyles}
        textStyles={styles.buttonTextStyles}
        selected={selectedChips.includes(name)}
        onPress={onSelectChip}
        title={name}
        key={name}
      />
    ));
  }, [filteredChips, styles.keeperButtonStyles, styles.buttonTextStyles, selectedChips, onSelectChip]);

  const returnAddedChips = useCallback(() => {
    return filteredAddedChips.map((name: string, index: number) => (
      <KeeperSelectButton
        buttonStyles={styles.keeperButtonStyles}
        textStyles={styles.buttonTextStyles}
        selected={selectedChips.includes(name)}
        onPress={onSelectChip}
        title={name}
        key={index}
      />
    ));
  }, [filteredAddedChips, styles.keeperButtonStyles, styles.buttonTextStyles, selectedChips, onSelectChip]);

  const filterChips = useCallback(
    (searchText: string) => {
      if (searchText) {
        const updatedChips = chipsData.filter(name => name.toLocaleLowerCase().includes(searchText.toLowerCase()));
        setFilteredChips(updatedChips);
        const updatedAddedChips = addedChips.filter(name =>
          name.toLocaleLowerCase().includes(searchText.toLowerCase()),
        );
        setFilteredAddedChips(updatedAddedChips);
      } else {
        setFilteredChips(chipsData);
        setFilteredAddedChips(addedChips);
      }
    },
    [addedChips, chipsData],
  );

  const onPressAddChip = useCallback(() => {
    if (addSkillText) {
      setAddedChips(prev => {
        return [...prev, addSkillText];
      });
      setAddSkillText('');
    }
  }, [addSkillText]);

  return (
    <View style={styles.chipsPickerContainer}>
      <KeeperTextInput
        placeholder='Search Skills'
        placeholderTextColor='white'
        style={styles.searchInput}
        onChangeText={(text: string) => filterChips(text)}
        autoCorrect={false}
      />
      {/* <AppHeaderText style={{ color: 'white' }}>Add Skill</AppHeaderText> */}
      <View style={styles.addedChipsContainer}>
        <KeeperTextInput
          placeholder='Add Skill'
          placeholderTextColor='white'
          style={styles.addSkillInput}
          value={addSkillText}
          onChangeText={(text: string) => setAddSkillText(text)}
          autoCorrect={false}
        />
        {/* <TouchableOpacity style={{ position: 'absolute', right: 30, top: -20 }} onPress={onPressAddChip}>
          <AppHeaderText style={styles.addSkillText}>Add Skill</AppHeaderText>
        </TouchableOpacity> */}
        <KeeperSelectButton
          buttonStyles={styles.addSkillButton}
          textStyles={styles.addSkillButtonText}
          onPress={onPressAddChip}
          title='Add Skill'
        />
      </View>
      {/* <View style={styles.chipsScrollView}>{returnAddedSkills()}</View> */}
      <ScrollView contentContainerStyle={styles.chipsScrollView} showsVerticalScrollIndicator={false}>
        {returnAddedChips()}
        {returnChipsFiltered()}
      </ScrollView>
    </View>
  );
};

export default ChipsPicker;
