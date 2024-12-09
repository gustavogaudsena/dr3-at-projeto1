import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Card({ produto }) {

    const preco = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(produto.preco);


    return (
        <TouchableOpacity >
            <View style={styles.container}>
                <Image style={styles.avatar} source={{ uri: produto.imagens?.[0] }} />
                <View style={styles.containerText}>
                    <Text style={styles.nome}>{produto.nome}</Text>
                    <Text style={styles.descricao}>{produto.descricao}</Text>
                    <Text style={styles.valor}>{preco}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        marginVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        backgroundColor: '#e6e6e6',
        borderColor: '#32302e',
        flex: 0,
        flexDirection: 'row',
        gap: 10,
    },
    containerText: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        flex: 0,
        gap: 10,
        maxWidth: '70%',
        flex: 1
    },
    avatar: {
        width: '30%',
        height: '100%'
    },
    text: {
        fontSize: 16
    },
    valor: {
        textAlign: 'right',
    }
})
