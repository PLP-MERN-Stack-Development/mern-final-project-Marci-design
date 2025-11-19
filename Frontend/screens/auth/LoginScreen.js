import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { AuthContext } from '../../context/AuthContext';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(4).label('Password'),
});

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const { handleChange, handleSubmit, handleBlur, values, errors, touched } = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const result = await login(values.email, values.password);
      
      if (!result.success) {
        Alert.alert('Error', result.error);
      }
      
      setIsLoading(false);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
        />
        <Text style={styles.title}>TransitFlow</Text>
        <Text style={styles.subtitle}>Your journey, simplified</Text>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            error={touched.email && errors.email}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
          
          <TextInput
            label="Password"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            error={touched.password && errors.password}
            style={styles.input}
            secureTextEntry
          />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Login
          </Button>
          
          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.linkButton}
          >
            Don't have an account? Register
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3f51b5',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  card: {
    padding: 10,
    elevation: 4,
  },
  input: {
    marginBottom: 10,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    padding: 5,
  },
  linkButton: {
    marginTop: 10,
  },
});

export default LoginScreen;