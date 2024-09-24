import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateTimePickerProps {
  label: string;
  date: Date;
  onDateChange: (date: Date) => void;
  theme: any;
}

const CustomDateTimePicker: React.FC<DateTimePickerProps> = React.memo(({ label, date, onDateChange, theme }) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = useState(date);

  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (mode === 'date') {
        setTempDate(selectedDate);
        setMode('time');
        setShow(true);
      } else {
        const finalDate = new Date(tempDate);
        finalDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
        onDateChange(finalDate);
        setShow(false);
      }
    } else {
      setShow(false);
    }
  };
  

  const showPicker = () => {
    setMode('date');
    setShow(true);
  };

  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-IN', options);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textColor }]}>{label}</Text>
      <TouchableOpacity onPress={showPicker} style={[styles.button, { backgroundColor: theme.buttonColor }]}>
        <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>{formatDateTime(date)}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={tempDate}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
  },
});

export default CustomDateTimePicker;