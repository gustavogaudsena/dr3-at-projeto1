import { Alert, Image, Platform, StyleSheet, Text, TouchableHighlight, light, View } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation'
import { useEffect, useRef, useState } from "react";
import { useWindowDimensions } from 'react-native';
import useOrientation from "../hooks/useOrientation";
import { useNavigation } from "@react-navigation/native";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
    useAnimatedStyle,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Icon } from "react-native-vector-icons/MaterialIcons";

export default function TransacaoItemList({ transaction, handleDelete }) {

    const { isPortrait, isLandscape } = useOrientation();
    const navigation = useNavigation()
    const valor = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: transaction.moeda
    }).format(transaction.valor);

    const swipeableRef = useRef(null)

    const data = new Date(transaction.data).toLocaleDateString('pt-BR')

    function RightAction(prog, drag) {
        return (
            <TouchableHighlight style={styles.swipeableEdit} onPress={() => onEdit(transaction)}>
                <View style={[styles.action, styles.editAction, { flex: 1, justifyContent: 'center', width: '100%' }]}>
                    <Text style={[styles.rightAction, { color: '#fff' }]}>Editar</Text>
                </View>
            </TouchableHighlight>
        );
    }

    function LeftAction(prog, drag) {
        return (
            <TouchableHighlight style={styles.swipeableDelete} onPress={() => onEdit(transaction)}>
                <View style={[styles.action, { flex: 1, justifyContent: 'center', width: '100%' }]}>
                    <Text style={[styles.leftAction, { color: '#fff' }]}>Deletar</Text>
                </View>
            </TouchableHighlight>
        );
    }


    return (
        <GestureHandlerRootView>
            <Swipeable
                ref={swipeableRef}
                containerStyle={styles.swipeable}
                friction={2}
                enableTrackpadTwoFingerGesture
                rightThreshold={80}
                leftThreshold={80}
                renderRightActions={RightAction}
                renderLeftActions={LeftAction}
                onSwipeableWillOpen={(action) => {
                    if (action === 'left') navigation.navigate('NovaTransacao', { id: transaction.id })
                    else if (action === 'right') handleDelete(transaction.id)
                    swipeableRef.current?.close()
                }}
            >
                <TouchableHighlight >
                    <View style={[styles.container]}>
                        <View style={[styles.row, styles.justifyBetween]}>
                            <Text style={[styles.textBold, styles.uppercase]}>{transaction.descricao}</Text>
                            {
                                !isPortrait &&
                                <Text style={[styles.capitalize]}>{transaction.categoria}</Text>
                            }
                        </View>
                        <View style={styles.rowGrid}>
                            <Text style={styles.valor}>{valor}</Text>
                            <View style={styles.row}>

                                <Text style={styles.data}>{data}</Text>
                                {
                                    !isPortrait &&
                                    <Text style={styles.data}> {transaction.hora}</Text>
                                }
                            </View>
                        </View>
                        {!isPortrait && (
                            <View style={styles.fullWidth}>
                                <Text style={[styles.textCenter, styles.uppercase, styles.bold, transaction.tipo === 'despesa' ? styles.colorRed : styles.colorGreen]}>{transaction.tipo}</Text>
                            </View>
                        )}
                    </View>
                </TouchableHighlight>
            </Swipeable>
        </GestureHandlerRootView>
    )

}

const styles = StyleSheet.create({
    leftAction: {

    },
    rightAction: {
        textAlign: 'right'
    },
    swipeableEdit: {
        paddingVertical: 10,
        marginVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        backgroundColor: '#014f15',
        borderColor: '#32302e',
        color: '#fff',
        flex: 0,
        flexDirection: 'column',
        gap: 10,
        maxWidth: '100%',
        width: '50%'
    },
    swipeableDelete: {
        paddingVertical: 10,
        marginVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        backgroundColor: 'rgb(80, 0, 0)',
        borderColor: '#32302e',
        color: '#fff',
        flex: 0,
        flexDirection: 'column',
        gap: 10,
        maxWidth: '100%',
        width: '50%'
    },
    container: {
        paddingVertical: 10,
        marginVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        backgroundColor: '#e6e6e6',
        borderColor: '#32302e',
        flex: 0,
        flexDirection: 'column',
        gap: 10,
        maxWidth: '100%'
    },
    row: {
        flexDirection: 'row',
    },
    portrait: {
        flexDirection: 'column',
    },
    capitalize: {
        textTransform: 'capitalize',
    },
    rowGrid: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    textBold: {
        fontWeight: 'bold',
    },
    uppercase: {
        textTransform: 'uppercase'
    },
    displayNone: {
        display: 'none'
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
    justifyBetween: {
        justifyContent: 'space-between'
    },
    colorRed: {
        color: "#aa3939"
    },
    colorGreen: {
        color: "#1caa23"
    },
    textCenter: {
        textAlign: 'center'
    },
    fullWidth: {
        width: '100%'
    }

})
