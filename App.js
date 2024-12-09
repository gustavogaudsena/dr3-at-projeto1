import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import TransacaoListScreen from './screens/TransacaoListScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AuthenticationScreen from './screens/AuthenticationScreen';
import FormScreen from './screens/FormScreen';
import { useState } from 'react';
import { MOCK_TRANSACTIONS, MOCK_USER } from './utils/mocks';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Stack = createNativeStackNavigator();

export default function App() {
  const [usersDB, setUsersDB] = useState(MOCK_USER)
  const [transactionsDB, setTransactionsDB] = useState(MOCK_TRANSACTIONS)
  const NavigateForm = ({navigation}) => <TouchableOpacity style={{padding: 5}} onPress={() => navigation.navigate('NovaTransacao')}><Icon name='add' size={24} color="#000" /></TouchableOpacity>

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Autenticacao" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Autenticacao" >
          {(props) => <AuthenticationScreen usersDB={usersDB} setUsersDB={setUsersDB} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="ListaTransacoes" options={({ navigation }) => ({
          headerShown: true,
          title: 'Lista de Transações',
          headerBackVisible: false,
          headerRight: () => <NavigateForm navigation={navigation} />
        })}>
          {(props) => <TransacaoListScreen transactionsDB={transactionsDB} setTransactionsDB={setTransactionsDB} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="NovaTransacao" options={{
          headerShown: true,
          title: 'Transação',
          headerBackVisible: true
        }} >
          {(props) => <FormScreen transactionsDB={transactionsDB} setTransactionsDB={setTransactionsDB} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
