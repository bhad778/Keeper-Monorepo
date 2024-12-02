import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppBoldText, AppHeaderText, KeeperImage, KeeperTextInput } from 'components';
import Checkbox from 'expo-checkbox';
import { useTheme } from 'theme/theme.context';

import useStyles from './BrandFetchAutocompleteStyles';

type BrandFetchAutocompleteProps = {
  value: string | number;
  brandFetchAutoCompleteData: unknown[];
  isAnonymous?: boolean;
  setIsAnonymous?: any;
  onAddNewCompanyAutoComplete: () => void;
  onChange: (text: string) => void;
  onSelectItem: (selectedItem: unknown) => void;
};

const BrandFetchAutocomplete = ({
  value,
  brandFetchAutoCompleteData,
  isAnonymous,
  setIsAnonymous,
  onAddNewCompanyAutoComplete,
  onChange,
  onSelectItem,
}: BrandFetchAutocompleteProps) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const onCheckboxSelect = useCallback(() => {
    if (setIsAnonymous) {
      setIsAnonymous((prev: any) => !prev);
    }
  }, [setIsAnonymous]);

  return (
    <View style={styles.container}>
      <View style={styles.anonContainer}>
        <AppHeaderText style={styles.anonymousText}>Confidential?</AppHeaderText>
        <Checkbox
          style={styles.checkBox}
          color={theme.color.pink}
          onValueChange={onCheckboxSelect}
          value={isAnonymous}
        />
      </View>
      <KeeperTextInput onChangeText={onChange} value={value} />
      {brandFetchAutoCompleteData && brandFetchAutoCompleteData.length > 0 && (
        <View style={styles.companyList}>
          <TouchableOpacity style={styles.companyListItem} onPress={onAddNewCompanyAutoComplete}>
            <AppBoldText style={styles.dontSeeCompanyText}>Dont See Your Company? Click Here to Add Yours</AppBoldText>
          </TouchableOpacity>
          {brandFetchAutoCompleteData.map((dataListItem: any, index: number) => (
            <TouchableOpacity style={styles.companyListItem} onPress={() => onSelectItem(dataListItem)} key={index}>
              <AppHeaderText style={styles.companyNameText} numberOfLines={1}>
                {dataListItem.name}
              </AppHeaderText>
              {dataListItem.icon && (
                <KeeperImage
                  source={{
                    uri: dataListItem?.icon,
                  }}
                  style={styles.logoImage}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default BrandFetchAutocomplete;
