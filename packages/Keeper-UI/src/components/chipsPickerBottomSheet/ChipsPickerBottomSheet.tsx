import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { KeeperSelectButton, KeeperTextInput } from 'components';

import { useStyles } from './ChipsPickerBottomSheetStyles';

type ChipsPickerBottomSheetProps = {
  chipsData: string[];
  selectedChips: string[];
  setSelectedChips: (selectedChips: string[]) => void;
  maxCount?: number;
};

const ChipsPickerBottomSheet = ({
  chipsData,
  selectedChips,
  setSelectedChips,
  maxCount = 60,
}: ChipsPickerBottomSheetProps) => {
  const [filteredChips, setFilteredChips] = useState<string[]>(chipsData || []);

  const styles = useStyles();

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

  const filterChips = useCallback(
    (searchText: string) => {
      if (searchText) {
        const updatedChips = chipsData.filter(name => name.toLocaleLowerCase().includes(searchText.toLowerCase()));
        setFilteredChips(updatedChips);
      } else {
        setFilteredChips(chipsData);
      }
    },
    [chipsData],
  );

  return (
    <View style={styles.chipsPickerContainer}>
      <KeeperTextInput
        placeholder='Search Skills'
        placeholderTextColor='black'
        style={styles.searchInput}
        onChangeText={(text: string) => filterChips(text)}
        autoCorrect={false}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled={true}
        style={styles.chipsScrollView}
        alwaysBounceVertical={false}>
        <FlatList
          contentContainerStyle={{ alignSelf: 'flex-start' }}
          numColumns={Math.ceil(filteredChips?.length / 3)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          key={Math.random()}
          data={filteredChips}
          renderItem={({ item }) => {
            return (
              <KeeperSelectButton
                buttonStyles={styles.keeperButtonStyles}
                textStyles={styles.buttonTextStyles}
                selected={selectedChips.includes(item)}
                onPress={onSelectChip}
                title={item}
                key={item}
              />
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

export default ChipsPickerBottomSheet;
