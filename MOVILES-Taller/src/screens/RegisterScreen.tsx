import React, { useState } from 'react';
import { View, Image } from 'react-native';
import {Button,Snackbar,Text,TextInput,} from 'react-native-paper';
import { styles } from '../theme/appStyles';
import { auth } from '../configs/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

interface FormRegister {
  email: string;
  password: string;
}

interface Message {
  visible: boolean;
  text: string;
  color: string;
}

export const RegisterScreen = ({ navigation }: any) => {
  const [formRegister, setFormRegister] = useState<FormRegister>({
    email: '',
    password: '',
  });
  const [showMessage, setShowMessage] = useState<Message>({
    visible: false,
    text: '',
    color: '',
  });

  const handleInputChange = (key: string, value: string): void => {
    setFormRegister({ ...formRegister, [key]: value });
  };

  const handleRegister = async () => {
    if (!formRegister.email || !formRegister.password) {
      setShowMessage({
        visible: true,
        text: 'Completa todos los campos',
        color: '#ef5350',
      });
      return;
    }

    if (formRegister.password.length < 6) {
      setShowMessage({
        visible: true,
        text: 'La contraseña debe tener al menos 6 caracteres',
        color: '#ef5350',
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formRegister.email, formRegister.password);
      setShowMessage({
        visible: true,
        text: '¡Registro exitoso! Bienvenido',
        color: '#4caf50',
      });
      setFormRegister({ email: '', password: '' });
      navigation.navigate('Login');
    } catch (error: any) {
      let msg = 'Error al registrarse';
      if (error.code === 'auth/email-already-in-use') {
        msg = 'Este correo ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Correo inválido';
      }
      setShowMessage({
        visible: true,
        text: msg,
        color: '#ef5350',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/snake1.png')} 
          style={styles.logoImage} 
        />
        <Text style={styles.text}>Únete al Juego</Text>
        <Text style={styles.subtitle}>Crea tu cuenta gratis</Text>
      </View>

      <TextInput
        mode="outlined"
        label="Correo electrónico"
        placeholder="tu@correo.com"
        value={formRegister.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon="email" />}
        style={styles.inputStyle}
      />

      <TextInput
        mode="outlined"
        label="Contraseña"
        placeholder="Mínimo 6 caracteres"
        value={formRegister.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
        left={<TextInput.Icon icon="lock" />}
        style={styles.inputStyle}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        icon="account-plus"
      >
        Registrarse
      </Button>

      <Text
        style={styles.textRedirect}
        onPress={() => navigation.navigate('Login')}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Text>

      <Snackbar
        visible={showMessage.visible}
        onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
        style={[styles.snackbar, { backgroundColor: showMessage.color }]}
        duration={3000}
      >
        {showMessage.text}
      </Snackbar>
    </View>
  );
};