import { Picker } from '@react-native-picker/picker';
import  { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { apiHandler } from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/AntDesign';

const FormScreen = ({ route, navigation, transactionsDB, setTransactionsDB }) => {
    const params = route.params
    const id = params?.id

    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState(null);
    const [data, setData] = useState(new Date());
    const [hora, setHora] = useState(new Date());
    const [moeda, setMoeda] = useState(null);
    const [categoria, setCategoria] = useState('');
    const [moedas, setMoedas] = useState([]);
    const [tipo, setTipo] = useState();
    const [cotacao, setCotacao] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false)
    const [openTime, setOpenTime] = useState(false)

    function formatarData(date) {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        return `${mes}-${dia}-${ano}`;
    }
    function formatarDataBanco(date) {
        const ano = date.getFullYear();
        const mes = String(date.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
        const dia = String(date.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }

    function criarDataComHora(data, hora) {
        const [ano, mes, dia] = data.split('-').map(Number); // `map(Number)` converte as strings em 
        const [horaString, minuto] = hora.split(':').map(Number);
        return new Date(ano, mes - 1, dia, horaString, minuto);
    }


    function handleSubmit() {
        if (!valor || !descricao || !data || !hora || !moeda || !categoria || !tipo) return Alert.alert('Formulário incompleto', 'Preencha todos os campos!')
        const newTrasaction = {
            id: id ? id : transactionsDB.length + 1,
            descricao,
            valor,
            data: formatarDataBanco(data),
            hora: data?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            tipo,
            moeda,
            categoria
        }
        const newDB = id ? [...transactionsDB.map(transaction => {
            if (transaction.id === id) return newTrasaction
            else return transaction
        })] : [...transactionsDB, newTrasaction]
        setTransactionsDB(newDB)
        Alert.alert('Sucesso', `Transação ${id ? 'editada' : 'inserida'} com sucesso`)
        navigation.navigate('ListaTransacoes')
    }


    useEffect(() => {
        apiHandler.getMoedas().then((response) => setMoedas(response)).catch((err) => Alert.alert('Erro', 'Não foi possível buscar a cotação')).finally(() => {
            setIsLoading(false)
            if (id) {
                const currentTransaction = transactionsDB.find((item) => item.id === id)
                setValor(String(currentTransaction.valor))
                setDescricao(currentTransaction.descricao)
                setData(new Date(currentTransaction.data))
                setHora(criarDataComHora(currentTransaction.data, currentTransaction.hora))
                setCategoria(currentTransaction.categoria)
                setTipo(currentTransaction.tipo)
                setMoeda(currentTransaction.moeda)
            }
        })


    }, [])

    useEffect(() => {
        if (!moeda || !data) return
        if (moeda === 'BRL') return setCotacao('1.00')
        apiHandler.getCotacaoMoeda(moeda, formatarData(data)).then((response) => { console.log(response); setCotacao(response?.cotacaoCompra) }).catch((err) => console.log(err)).finally(() => setIsLoading(false))
    }, [moeda, data])
    return (
        <ScrollView>

            <View style={[styles.container, styles.fullWidth]}>
                {isLoading && <ActivityIndicator />}
                <Text style={[styles.textLarge, styles.textCenter, styles.bold, styles.marginBottom]}>{id ? 'Editar' : 'Adicionar'}</Text>
                <View style={styles.inputContainer}>
                    <Text>Descrição</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Descrição"
                        keyboardType='default'
                        value={descricao}
                        onChangeText={setDescricao}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Valor</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Valor"
                        keyboardType='numeric'
                        value={valor}
                        onChangeText={setValor}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Categoria</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Categoria"
                        keyboardType='default'
                        value={categoria}
                        onChangeText={setCategoria}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Data e hora</Text>
                    <View style={[styles.row, styles.fullWidth]}>
                        <View >
                            <TouchableOpacity
                                style={styles.datePicker}
                                onPress={() => setOpen(true)}>
                                <View style={[styles.row]}>
                                    <Icon name='calendar' size={24} color="#000" />
                                    <Text>{data?.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
                                </View>
                            </TouchableOpacity>
                            {
                                open &&
                                <DateTimePicker
                                    style={styles.dateComponent}
                                    locale="pt-BR"
                                    mode="date"
                                    value={data}
                                    onChange={(_, date) => {
                                        setOpen(false);
                                        if (date) setData(date);
                                    }}
                                />
                            }
                        </View>
                        <View>
                            <TouchableOpacity
                                style={styles.datePicker}
                                onPress={() => setOpenTime(true)}>
                                <View style={[styles.row]}>
                                    <Icon name='clockcircleo' size={24} color="#000" />
                                    <Text>{hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} </Text>
                                </View>
                            </TouchableOpacity>
                            {
                                openTime &&
                                <DateTimePicker
                                    value={hora}
                                    mode="time"
                                    locale="pt-BR"
                                    is24Hour={true}
                                    onChange={(_, selectedDate) => {
                                        setOpenTime(false);
                                        if (selectedDate) setHora(selectedDate);
                                    }}
                                />
                            }
                        </View>
                    </View>
                </View>


                <View style={styles.inputContainer}>
                    <Text>Tipo</Text>
                    <Picker
                        selectedValue={tipo}
                        onValueChange={setTipo}
                        style={styles.picker} >
                        <Picker.Item label={'Receita'} value={'receita'} />
                        <Picker.Item label={'Despesa'} value={'despesa'} />
                    </Picker>
                </View>
                <View style={styles.inputContainer}>
                    <Text>Moeda</Text>
                    <Picker
                        aria-label='Moedas'
                        selectedValue={moeda}
                        onValueChange={setMoeda}
                        style={styles.picker} >
                        {moedas?.map((item, idx) => (<Picker.Item key={`picker_forms_moeda_${idx}`} label={item.nomeFormatado} value={item.simbolo} />))}
                        <Picker.Item label={'Real Brasileiro'} value={'BRL'} />
                    </Picker>
                </View>
                {
                    moeda &&
                    data &&
                    cotacao &&
                    <View style={styles.inputContainer}>
                        <Text style={[styles.bold, styles.textCenter]}>
                            Cotação de {moeda} em {data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}:
                        </Text>
                        <Text style={[styles.bold, styles.textCenter]}>
                            BLR {cotacao}
                        </Text>
                        {
                            valor &&
                            <View style={[styles.row, styles.fullWidth, styles.textCenter]}>
                                <Text style={[styles.bold, styles.textCenter, styles.fullWidth]}>
                                    Valor total da transação: {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(cotacao * valor)}
                                </Text>
                            </View>
                        }
                    </View>
                }
                {
                  !cotacao &&
                    <View style={styles.inputContainer}>
<Text style={[styles.bold, styles.textCenter, styles.fullWidth, styles.colorRed]}>
  Selecione um dia da semana para pegar a cotação
  </Text>
                    </View>

                }

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>{id ? 'Editar' : 'Adicionar'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
      colorRed: {
        color: "#aa3939"
    },
    input: {
        width: '100%',
        height: 50,
    },
    inputContainer: {
        width: '100%'
    },
    input: {
        fontSize: 20,
        padding: 10,
        margin: 4,
        backgroundColor: "#ced4da",
        borderBottomWidth: 1,
        borderBottomColor: "#6c757d",
        borderRadius: 5,
    },
    fullWidth: {
        width: '100%'
    },
    bold: {
        fontWeight: 'bold'
    },
    textCenter: {
        textAlign: 'center'
    },
    textLarge: {
        fontSize: 20
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5
    },
    dateComponent: {
        width: 350
    },
    picker: {
        padding: 0,
        width: '100%',
        textTransform: 'capitalize'
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
    button: {
        backgroundColor: '#014f15',
        paddingVertical: 5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FormScreen;
