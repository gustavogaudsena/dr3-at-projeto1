import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import avatar from '../assets/login-avatar.png'

const AuthenticationScreen = ({ navigation, usersDB, setUsersDB }) => {
  const [username, setUsername] = useState(usersDB[0].username);
  const [password, setPassword] = useState(usersDB[0].password);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [register, setRegister] = useState(false);

  const handleLogin = () => {
    if (Array.from(usersDB).some((user) => user.username.toUpperCase() === username.toUpperCase() && user.password === password)) navigation.navigate('ListaTransacoes');
    else Alert.alert('Erro de autenticação', 'Nome de usuário ou senha inválidos.');
  };

  const handleRegister = () => {
    if (!username || username.length < 3) return Alert.alert('Erro de registro', 'Nome de usuário inválido.');
    if (!password || password.length < 6) return Alert.alert('Erro de registro', 'Senha inválida.');
    if (password !== confirmPassword) return Alert.alert('Erro de registro', 'Senhas não correspondem');
    if (Array.from(usersDB).some((user) => user.username === username)) return Alert.alert('Erro de registro', 'Nome de usuário já cadastrado.');
    const newUser = { username, password }
    const newDB = [...usersDB, newUser]
    setUsersDB(newDB)
    Alert.alert('Sucesso!', 'Usuário registrado!');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setRegister(false);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/login-avatar.png')} style={styles.avatar} />
      <Text style={styles.title}>{register ? 'Registrar' : 'Login'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {
        register &&
        <>
          <TextInput
            style={styles.input}
            placeholder="Corfimar a senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRegister(false)}>
            <Text style={[styles.buttonText, styles.colorGreen]}>Voltar</Text>
          </TouchableOpacity>
        </>
      }
      {
        !register &&
        <>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRegister(true)}>
            <Text style={[styles.buttonText, styles.colorGreen]}>Registrar</Text>
          </TouchableOpacity>
        </>
      }
    </View >
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#014f15',
    paddingVertical: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  colorGreen: {
    color: "#014f15"
  },
});

export default AuthenticationScreen;
