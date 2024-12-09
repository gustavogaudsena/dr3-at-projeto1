import { View, Text, StyleSheet, ScrollView, FlatList, TextInput, Button, Alert } from 'react-native';
import TransacaoItemList from '../components/TransacaoItemList';
import { useEffect, useState } from 'react';
import { MOCK_TRANSACTIONS } from '../utils/mocks';
import { Picker } from '@react-native-picker/picker';



export default function TransacaoListScreen({ transactionsDB, setTransactionsDB }) {
    const [transactions, setTransactions] = useState(transactionsDB)
    const [filter, setFilter] = useState("")
    const [orderBy, setOrderBy] = useState("")

    const filtrar = () => {
        const items = transactionsDB.filter(transacao =>
            transacao.categoria.toLowerCase().includes(filter.trim().toLowerCase()) ||
            transacao.descricao.toLowerCase().includes(filter.trim().toLowerCase()) ||
            transacao.tipo.toLowerCase().includes(filter.trim().toLowerCase()) ||
            transacao.moeda.toLowerCase().includes(filter.trim().toLowerCase()));
        setTransactions(items);
    }

    const ordernar = (order) => {
        const itemsOrdenados = transactions.sort((a, b) => {
            if (order === 'descricao') return a.descricao.localeCompare(b.descricao)
            if (order === 'categoria') return a.categoria.localeCompare(b.categoria)
            if (order === 'valor') return Number(a.valor) - Number(b.valor)
            if (order === 'data') return new Date(a.data) - new Date(b.data)
            if (order === 'hora') {
                const dateTimeA = new Date(`${a.data}T${a.hora}`);
                const dateTimeB = new Date(`${b.data}T${b.hora}`);
                return dateTimeA - dateTimeB;
            }
            if (order === 'tipo') return a.tipo.localeCompare(b.tipo)
            if (order === 'moeda') return a.moeda.localeCompare(b.moeda)
        })
        setTransactions(itemsOrdenados)
    }

    function handleDelete(id) {
        const filteredTransactions = transactionsDB.filter(item => item.id !== id)
        setTransactionsDB(filteredTransactions)
        Alert.alert('Transação deletada com sucesso!')
    }

    useEffect(() => {
        filtrar()
    }, [filter, transactionsDB])

    return (
        <View style={styles.container}>
            <View style={styles.containerFilter}>
                <TextInput
                    style={styles.input}
                    placeholder="Filtrar por descrição, categoria, tipo ou moeda"
                    value={filter}
                    onChangeText={setFilter}
                />
            </View>
            <Picker
                selectedValue={orderBy}
                onValueChange={(value) => {
                    setOrderBy((prev) => {
                        ordernar(value)
                        return value
                    })
                }}
                style={styles.picker}
            >
                <Picker.Item label="Ordenar por descricao" value="descricao" />
                <Picker.Item label="Ordenar por valor" value="valor" />
                <Picker.Item label="Ordenar por data" value="data" />
                <Picker.Item label="Ordenar por hora" value="hora" />
                <Picker.Item label="Ordenar por categoria" value="categoria" />
                <Picker.Item label="Ordenar por tipo" value="tipo" />
                <Picker.Item label="Ordenar por moeda" value="moeda" />
            </Picker>
            <FlatList
                data={transactions}
                renderItem={({ item, index }) => <TransacaoItemList transaction={item} handleDelete={handleDelete} />}
                keyExtractor={item => item.id}
                style={styles.flatList}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        gap: 15,
        paddingHorizontal: 5,
        marginVertical: 15,
        flexDirection: 'column',
        width: '100%'

    },
    flatList: {
        width: '100%'
    }
})