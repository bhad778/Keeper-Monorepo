import { useCallback, useState } from 'react';
import { AppBoldText, AppHeaderText, Clickable, KeeperImage } from 'components';
import { getPropByString } from 'utils';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import useStyles from './KeeperSelectDropdownStyles';

type KeeperSelectDropdownProps = {
  value: string;
  data: unknown[];
  valueString: string;
  valueImg?: string;
  // make function with generic type
  onSelectItem: any;
};

const KeeperSelectDropdown = ({ value, valueImg, data, valueString, onSelectItem }: KeeperSelectDropdownProps) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const styles = useStyles(isDropDownOpen);

  const toggleIsDropDownOpen = useCallback(() => {
    setIsDropDownOpen((prev) => !prev);
  }, []);

  return (
    <div style={styles.container}>
      <Clickable style={styles.selectContainer} onClick={toggleIsDropDownOpen}>
        <AppBoldText style={styles.valueText}>{value}</AppBoldText>
        {valueImg && <KeeperImage style={styles.logoImage} source={valueImg} resizeMode="contain" />}
        <ArrowDropDownIcon sx={styles.downArrow} />
      </Clickable>

      {data && data.length > 0 && isDropDownOpen && (
        <div style={styles.companyList}>
          {data.map((dataListItem: any, index: number) => (
            <Clickable
              style={{
                ...styles.companyListItem,
                backgroundColor: dataListItem.color,
                borderBottomLeftRadius: index == data.length ? 20 : 0,
                borderBottomRightRadius: index == data.length ? 20 : 0,
              }}
              onClick={() => onSelectItem(dataListItem)}
            >
              <AppHeaderText style={styles.companyNameText}>{getPropByString(dataListItem, valueString)}</AppHeaderText>
              {/* <AppHeaderText style={styles.companyNameText}>{dataListItem['settings.']}</AppHeaderText> */}
              {dataListItem.settings.img && (
                <KeeperImage style={styles.logoImage} source={dataListItem.settings.img} resizeMode="contain" />
              )}
            </Clickable>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeeperSelectDropdown;
