import { useCallback, useState } from 'react';

// this makes it so if you focus a top input it does not use
// keyBoardAvoidingView but when you focus a bottom input it does use it
const useKeyboardAvoidingViewOffset = (baseOffset: number, offset: number) => {
  const [keyboardAvoidingViewOffset, setKeyboardAvoidingViewOffset] = useState(baseOffset);

  const onFocusTextInput = useCallback(() => {
    setKeyboardAvoidingViewOffset(offset);
  }, [offset]);

  const onFocusDateInput = useCallback(() => {
    setKeyboardAvoidingViewOffset(baseOffset);
  }, []);

  return {
    keyboardAvoidingViewOffset,
    onFocusTextInput,
    onFocusDateInput,
  };
};

export default useKeyboardAvoidingViewOffset;
