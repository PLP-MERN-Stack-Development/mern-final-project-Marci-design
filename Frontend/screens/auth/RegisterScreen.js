import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { AuthContext } from '../../context/AuthContext';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  email: Yup.string().required().email().label('Email'),
  phone: Yup.string().required().min(10).label('Phone'),
  password: Yup.string().required().min(4).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required()
    .label('Confirm password'),
});

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const { handleChange, handleSubmit, handleBlur, values, errors, touched } = useFormik({
    initialValues: { 
      name: '', 
      email: '', 
      phone: '', 
      password: '', 
      confirmPassword: '' 
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const result = await register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join TransitFlow today</Text>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Full Name"
            value={values.name}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            error={touched.name && errors.name}
            style={styles.input}
          />
          {touched.name && errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}
          
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
            label="Phone Number"
            value={values.phone}
            onChangeText={handleChange('phone')}
            onBlur={handleBlur('phone')}
            error={touched.phone && errors.phone}
            style={styles.input}
            keyboardType="phone-pad"
          />
          {touched.phone && errors.phone && (
            <Text style={styles.errorText}>{errors.phone}</Text>
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
          
          <TextInput
            label="Confirm Password"
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            error={touched.confirmPassword && errors.confirmPassword}
            style={styles.input}
            secureTextEntry
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Register
          </Button>
          
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
          >
            Already have an account? Login
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

export default RegisterScreen;