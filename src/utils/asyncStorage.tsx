// AsyncStorage functions (utils/asyncStorage.ts)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player } from '../models/Player';

const FAVORITES_KEY = '@favorites';

// Retrieve favorites from AsyncStorage
export const getFavorites = async (): Promise<Player[]> => {
    try {
        const favoritesString = await AsyncStorage.getItem(FAVORITES_KEY);
        if (favoritesString !== null) {
            return JSON.parse(favoritesString);
        }
        return [];
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
};

// Save favorites to AsyncStorage
export const saveFavorites = async (favorites: Player[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
};
