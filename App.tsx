import React, { useState, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import CustomDateTimePicker from './DateTimePicker';
import ICSGenerator from './ICSGenerator';
import Share from 'react-native-share';
import { Buffer } from 'buffer';

const App = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());

  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const handleShare = async () => {
    if (!title.trim()) {
      Alert.alert('error', 'Event title is required');
      return;
    }

    const icsGenerator = new ICSGenerator({
      title,
      description,
      location,
      startDateTime,
      endDateTime,
    });

    const icsContent = icsGenerator.generate();

    const base64Content = Buffer.from(icsContent).toString('base64');

    function sanitizeTitle(title: String) {
      // Replace spaces with underscores
      let sanitizedTitle = title.replace(/\s+/g, '_');
      // Remove unwanted characters (keep alphanumeric, underscores, and hyphens)
      sanitizedTitle = sanitizedTitle.replace(/[^a-zA-Z0-9-_]/g, '');
      return sanitizedTitle;
    }

    const safeTitle = sanitizeTitle(title);
    const shareOptions = {
      title: 'Share event',
      message: 'Check out this event!',
      url: `data:text/calendar;base64,${base64Content}`,
      filename: `${safeTitle}.ics`
    };

    try {
      await Share.open(shareOptions);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'User did not share') {
        console.log('User cancelled sharing');
              Alert.alert('', 'did you share the file ?', [
                {
                  text: 'Yes',
                  onPress: () => console.log('Yes Pressed'),
                },
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed') 
                },
              ]);
            } else {
        console.error('Error sharing event:', error);
        Alert.alert('Error', 'Failed to share event. Please try again.');
      }
    }
  };
  const handleReset = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setStartDateTime(new Date());
    setEndDateTime(new Date());
  };

  const setStartDateTimeIfChanged = (newDate: Date) => {
    if (newDate.getTime() !== startDateTime.getTime()) {
      console.log('New Start DateTime:', newDate);
      setStartDateTime(newDate);
    }
  };

  const setEndDateTimeIfChanged = (newDate: Date) => {
    if (newDate.getTime() !== endDateTime.getTime()) {
      console.log('New End DateTime:', newDate);
      setEndDateTime(newDate);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.label, { color: theme.textColor }]}>Title :</Text>
      <TextInput
        style={[styles.input, { color: theme.textColor, borderColor: theme.borderColor }]}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title..."
        placeholderTextColor={theme.placeholderColor}
      />

      <Text style={[styles.label, { color: theme.textColor }]}>Description :</Text>
      <TextInput
        style={[styles.input, styles.multilineInput, { color: theme.textColor, borderColor: theme.borderColor }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description..."
        placeholderTextColor={theme.placeholderColor}
        multiline
        numberOfLines={4}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.location, { color: theme.textColor, borderColor: theme.borderColor }]}
          onChangeText={setLocation}
          value={location}
          placeholder="Location"
          placeholderTextColor={theme.placeholderColor}
        />
        <TouchableOpacity onPress={handleReset} style={[styles.input, styles.placeholder, { borderColor: theme.borderColor }]}>
          <Text style={{ color: theme.textColor }}>Reset</Text>
        </TouchableOpacity>
        <View style={[styles.input, styles.placeholder, { borderColor: theme.borderColor }]}>
          <Text style={{ color: theme.textColor }}>PLACEHOLDER1.1</Text>
        </View>
      </View>
      <View style={styles.row}>
        <CustomDateTimePicker
          label="Start"
          date={startDateTime}
          onDateChange={(newDate) => {
            console.log('New Start DateTime:', newDate)
            setStartDateTime(newDate)
          }}
          theme={theme}
        />
      </View>

      <View style={styles.row}>
        <CustomDateTimePicker
          label="End"
          date={endDateTime}
          onDateChange={(newDate) => {
            console.log('New End DateTime:', newDate)
            setEndDateTime(newDate)
          }}
          theme={theme}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonColor }]} onPress={handleShare}>
          <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>SHARE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};const lightTheme = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  borderColor: '#CCCCCC',
  placeholderColor: '#999999',
  buttonColor: '#007AFF',
  buttonTextColor: '#FFFFFF',
};

const darkTheme = {
  backgroundColor: '#1E1E1E',
  textColor: '#FFFFFF',
  borderColor: '#444444',
  placeholderColor: '#777777',
  buttonColor: '#0A84FF',
  buttonTextColor: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    justifyContent: 'center',
    marginBottom: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  location: {
    flex: 1,
    marginRight: 5,
  },
  placeholder: {
    flex: 1,
    marginHorizontal: 2,
  },
  fullWidth: {
    flex: 2,
    marginRight: 5,
  },
  placeholder2_0: {
    flex: 2,
    marginRight: 5,
  },
  dotSpacer: {
    flex: 1,
    alignItems: 'center',
  },
  placeholder2_1: {
    flex: 2,
    marginLeft: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default App;

