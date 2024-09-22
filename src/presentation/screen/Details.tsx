import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from '../components/HeaderComponent';
import { Ionicons } from '@expo/vector-icons';
import { showInfoRemoveToast, showSuccessToast } from '../components/Toast';
import { getFavorites, saveFavorites } from '../../utils/asyncStorage';
import { Player } from '../../models/Player';

type RootStackParamList = {
    Details: { player: Player };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;

type Props = {
    route: DetailsScreenRouteProp;
    navigation: DetailsScreenNavigationProp;
};

const DetailsScreen: React.FC<Props> = ({ route, navigation }) => {
    const { player } = route.params;
    const [favorites, setFavorites] = useState<Player[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const loadFavoritesFromStorage = async () => {
            try {
                const storedFavorites = await getFavorites();
                setFavorites(storedFavorites);
                setIsFavorite(storedFavorites.some(fav => fav.id === player.id));
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };
        loadFavoritesFromStorage();
    }, []);

    const toggleFavorite = async () => {
        let updatedFavorites = [...favorites];
        if (isFavorite) {
            updatedFavorites = updatedFavorites.filter(fav => fav.id !== player.id);
            showInfoRemoveToast();
        } else {
            updatedFavorites.push(player);
            showSuccessToast();
        }
        setFavorites(updatedFavorites);
        setIsFavorite(!isFavorite);
        await saveFavorites(updatedFavorites);
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent
                handleGoBack={() => navigation.goBack()}
                handleGoHome={() => navigation.navigate('Home' as any)}
            />
            <View style={{ position: 'relative', alignItems: 'center' }}>
                <Image source={{ uri: player.image }} resizeMode='contain' style={styles.image} />
                <TouchableOpacity
                    onPress={toggleFavorite}
                    style={styles.favoriteButton}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={40}
                        color={isFavorite ? 'red' : 'gray'}
                    />
                </TouchableOpacity>
                <Text style={styles.name}>{player.playerName}</Text>
                <Text style={styles.price}>Năm sinh: {player.YoB}</Text>
                <Text style={styles.price}>Vị trí: {player.position}</Text>

                <Text style={styles.price}>Team: {player.team}</Text>
                <Text style={styles.price}>Captains: {player.isCaptain ? 'Đội trưởng' : 'Không phải đội trưởng'}</Text>
                <Text style={styles.price}>Giờ chơi:{player.MinutesPlayed} phút</Text>


            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    price: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    notes: {
        fontSize: 16,
        marginHorizontal: 16,
        marginVertical: 8,

    },
    image: {
        width: 250,
        height: 300,
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        marginLeft: 19,
        marginVertical: 20,
    },
    favoriteButton: {
        position: 'absolute',
        top: 40,
        right: 40,
        zIndex: 10,
    },
});

export default DetailsScreen;
