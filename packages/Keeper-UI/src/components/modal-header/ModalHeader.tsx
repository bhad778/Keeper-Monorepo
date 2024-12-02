/* eslint-disable no-undef */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { AppBoldText, AppHeaderText } from 'components';

import { useStyles } from './ModalHeaderStyles';

type ModalHeaderProps = {
  saveText?: any;
  text?: string;
  screenTitle: string;
  border: any;
  leftIcon?: any;
  closeModal: (value: boolean) => void;
  rightIcon?: any;
  postJob?: any;
  onPressRightIcon?: any;
  totalCompletedFields?: number;
  totalFieldsLength?: number;
  hasShadow?: boolean;
};

const ModalHeader = ({
  postJob,
  saveText,
  text,
  screenTitle,
  border,
  rightIcon,
  leftIcon,
  closeModal,
  onPressRightIcon,
  totalCompletedFields,
  totalFieldsLength,
  hasShadow,
}: ModalHeaderProps) => {
  const styles = useStyles(border, hasShadow);

  const goBack = () => {
    closeModal(false);

    text && saveText(text);
  };

  return (
    <View style={styles.headerContents}>
      <View style={styles.headerContainer}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={() => goBack()}>
            <Icon name={leftIcon} size={40} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.openJobBoardSection}>
          <View style={styles.titleSection}>
            <AppHeaderText style={styles.titleText}>{screenTitle}</AppHeaderText>
          </View>

          <View style={styles.rightButtonSection}>
            {typeof totalCompletedFields === 'undefined' || totalCompletedFields >= totalFieldsLength ? (
              <TouchableOpacity
                onPress={
                  screenTitle === 'Add Job' ||
                  screenTitle === 'Edit Job' ||
                  screenTitle === 'Edit Profile' ||
                  screenTitle === 'Create Profile'
                    ? postJob
                    : onPressRightIcon
                }>
                <Icon name={rightIcon} size={40} />
              </TouchableOpacity>
            ) : (
              <AppBoldText>
                {totalCompletedFields}/{totalFieldsLength}
              </AppBoldText>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalHeader;
