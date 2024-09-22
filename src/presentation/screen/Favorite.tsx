import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigation';
import { showInfoRemoveToast } from '../components/Toast';
import { getFavorites, saveFavorites } from '../../utils/asyncStorage';
import { Player } from '../../models/Player';
import PlayerCard from '../components/PlayerCard';

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Favorites'>;
    route: RouteProp<RootStackParamList, 'Favorites'>;
};

const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
    const [favorites, setFavorites] = useState<Player[]>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await getFavorites();
                setFavorites(storedFavorites);
            } catch (error) {
                console.error('Error loading favorites', error);
            }
        };

        if (isFocused) {
            loadFavorites();
        }
    }, [isFocused]);

    const removeFavorite = async (perfumeId: string) => {
        try {
            Alert.alert('Remove favorite', 'Are you sure you want to remove this favorite?', [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        const updatedFavorites = favorites.filter((item: Player) => item.id !== perfumeId);
                        setFavorites(updatedFavorites);
                        await saveFavorites(updatedFavorites);
                        showInfoRemoveToast();
                    },
                },
            ])

            // const updatedFavorites = favorites.filter((item: Player) => item.id !== perfumeId);
            // setFavorites(updatedFavorites);
            // await saveFavorites(updatedFavorites);
            // showInfoRemoveToast();

        } catch (error) {
            console.error('Error removing favorite', error);
        }
    };
    const removeAllFavorites = async () => {
        try {
            Alert.alert('Remove all favorites', 'Are you sure you want to remove all favorites?', [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        setFavorites([]);
                        await saveFavorites([]);
                        showInfoRemoveToast();
                    },
                },
            ]);
            // setFavorites([]);
            // await saveFavorites([]);
            // showInfoRemoveToast();
        } catch (error) {
            console.error('Error removing all favorites', error);
        }
    };
    if (favorites.length === 0) {
        return (
            <View style={styles.noFav}>
                <Text style={{ fontSize: 20, }}>No favorites found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.header}>Favorites</Text>
                {favorites.length >= 2 && (
                    <TouchableOpacity style={styles.removeAllButton} onPress={removeAllFavorites}>
                        <Text style={styles.removeAllButtonText}>Remove All</Text>
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={2}
                data={favorites}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <PlayerCard
                            player={item}
                            favorite={true}
                            onChangeFavList={() => removeFavorite(item.id)}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        marginBottom: 64,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 30,
    },
    cardContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 10,
    }, removeAllButton: {
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    }, removeAllButtonText: {
        color: 'white',
        fontSize: 16,
    },
    noFav: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }

});

export default FavoritesScreen;
