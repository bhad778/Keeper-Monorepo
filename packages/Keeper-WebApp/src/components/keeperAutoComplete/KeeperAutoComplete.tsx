import { AppBoldText, AppHeaderText, Clickable, KeeperImage, KeeperTextInput } from 'components';
import { Checkbox } from '@mui/material';
import { useCallback } from 'react';

import useStyles from './KeeperAutoCompleteStyles';

type KeeperAutoCompleteProps = {
  value: string | number;
  data: unknown[];
  isLoading?: boolean;
  isAnonymous?: boolean;
  setIsAnonymous?: any;
  onAddNewCompanyAutoComplete: () => void;
  onChange: (text: string) => void;
  onSelectItem: (selectedItem: unknown) => void;
};

const KeeperAutoComplete = ({
  value,
  data,
  isLoading,
  isAnonymous,
  setIsAnonymous,
  onAddNewCompanyAutoComplete,
  onChange,
  onSelectItem,
}: KeeperAutoCompleteProps) => {
  const styles = useStyles();

  const onCheckboxSelect = useCallback(() => {
    if (setIsAnonymous) {
      setIsAnonymous((prev: any) => !prev);
    }
  }, [setIsAnonymous]);

  return (
    <div style={styles.container}>
      <div style={styles.anonContainer}>
        <AppHeaderText style={styles.anonymousText}>Confidential?</AppHeaderText>
        <Checkbox style={styles.checkBox} onChange={onCheckboxSelect} checked={isAnonymous} />
      </div>
      <KeeperTextInput onChange={onChange} value={value} isLoading={isLoading} placeholder="Ex: Splunk" />
      {data && data.length > 0 && (
        <div style={styles.companyList}>
          <Clickable style={styles.companyListItem} onClick={onAddNewCompanyAutoComplete}>
            <AppBoldText style={styles.dontSeeCompanyText}>Dont See Your Company? Click Here to Add Yours</AppBoldText>
          </Clickable>
          {data.map((dataListItem: any) => (
            <Clickable style={styles.companyListItem} onClick={() => onSelectItem(dataListItem)}>
              <AppHeaderText style={styles.companyNameText}>{dataListItem.name}</AppHeaderText>
              {dataListItem.icon && <KeeperImage style={styles.logoImage} source={dataListItem.icon} />}
            </Clickable>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeeperAutoComplete;
