import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { AppBoldText, KeeperImage, KeeperTouchable } from 'components';
import { getPropByString } from 'utils';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import useStyles from './KeeperSelectDropdownStyles';
import KeeperLogoSvg from '../../assets/svgs/k-icon.svg';

type KeeperSelectDropdownProps = {
  value: string;
  data: unknown[];
  valueString: string;
  subTitle?: string;
  // make function with generic type
  onSelectItem: any;
};

const KeeperSelectDropdown = ({ value, data, valueString, subTitle, onSelectItem }: KeeperSelectDropdownProps) => {
  const selectedJobColor = useSelector((state: RootState) => state.local.selectedJob.color);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const styles = useStyles(isDropDownOpen, selectedJobColor);

  const toggleIsDropDownOpen = useCallback(() => {
    setIsDropDownOpen(prev => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <KeeperTouchable style={styles.selectContainer} onPress={toggleIsDropDownOpen}>
        <KeeperLogoSvg style={styles.keeperLogoImg} />
        <View style={styles.textContainer}>
          <AppBoldText style={styles.subTitle}>
            <AppBoldText style={styles.subTitle}>Candidates for: </AppBoldText>
            {subTitle}
          </AppBoldText>
          <AppBoldText style={styles.valueText}>{value}</AppBoldText>
        </View>
        {isDropDownOpen ? (
          <Ionicons name='arrow-up-circle-outline' style={styles.downArrow} />
        ) : (
          <Ionicons name='arrow-down-circle-outline' style={styles.downArrow} />
        )}
      </KeeperTouchable>

      {data && data.length > 0 && isDropDownOpen && (
        <View style={styles.companyList}>
          {data.map((dataListItem: any, index: number) => (
            <KeeperTouchable
              key={index}
              style={{
                ...styles.companyListItem,
                backgroundColor: dataListItem.color,
              }}
              onPress={() => onSelectItem(dataListItem)}>
              <AppBoldText style={styles.valueText}>{getPropByString(dataListItem, valueString)}</AppBoldText>
              {dataListItem.settings.img && (
                <KeeperImage
                  style={styles.logoImage}
                  source={{
                    uri: dataListItem.settings.img,
                  }}
                  resizeMode='contain'
                />
              )}
            </KeeperTouchable>
          ))}
        </View>
      )}
    </View>
  );
};

export default KeeperSelectDropdown;
