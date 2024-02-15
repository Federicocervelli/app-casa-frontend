import { useTheme } from '@rneui/themed';
import React, { useState, ChangeEvent } from 'react';
import { OutlinedTextField } from 'rn-material-ui-textfield';

interface InputFieldProps {
  label: string;
  onInputChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, onInputChange }) => {
  const {theme} = useTheme();
  const [value, setValue] = useState('');

  const handleTextChange = (text: string) => {
    setValue(text);
    // Call the callback function from the parent with the updated value
    onInputChange(text);
  };

  return (
    <OutlinedTextField
      label={label}
      keyboardType="default"
      value={value}
      onChangeText={handleTextChange}
      contentInset={{ left: 18 }}
      labelOffset={{ x1: 8 }}
      tintColor={theme.colors.accent}
      cursorColor={theme.colors.accent}
      textColor={theme.colors.onBgPrimary}
      baseColor={theme.colors.onBgSecondary}
    />
  );
};

export default InputField;
