import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View, StyleSheet } from "react-native"
import { Player } from "../../models/Player";
import { PlayerAPI } from "../../api/PlayerAPI";
import { getFavorites, saveFavorites } from "../../utils/asyncStorage";
import { showInfoRemoveToast, showSuccessToast } from "../components/Toast";
import CategoryFilter from "../components/CategoryFilter";
import PlayerCard from "../components/PlayerCard";

const HomeScreen: React.FC = () => {
    const [player, setPlayer] = useState<Player[]>([]);
    const [filteredPlayer, setFilteredPlayer] = useState<Player[]>([]);
    const [favorites, setFavorites] = useState<Player[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const isFocused = useIsFocused();

    console.log(favorites);

    useEffect(() => {
        const fetchPlayer = async () => {
            const api = new PlayerAPI();
            try {
                const data = await api.getAllPlayer();
                setPlayer(data);
                setFilteredPlayer(data);
            } catch (err) {
                console.log('Error fetching perfumes', err);
            }
            console.log('Player:', player);

        };

        const loadFavorites = async () => {
            try {
                const storedFavorites = await getFavorites();
                setFavorites(storedFavorites);
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };

        fetchPlayer();
        loadFavorites();
    }, [isFocused]);

    useEffect(() => {
        if (selectedTeam) {
            setFilteredPlayer(player.filter(player => player.team === selectedTeam));
        } else {
            setFilteredPlayer(player);
        }
    }, [selectedTeam, player]);

    const toggleFavorite = async (player: Player) => {
        let updatedFavorites = [...favorites];
        if (isFavorite(player.id)) {
            updatedFavorites = updatedFavorites.filter(fav => fav.id !== player.id);
            showInfoRemoveToast();
        } else {
            updatedFavorites.push(player);
            showSuccessToast();
        }
        setFavorites(updatedFavorites);
        await saveFavorites(updatedFavorites);
    };

    const isFavorite = (perfumeId: string) => {
        try {
            return favorites.findIndex(fav => fav.id === perfumeId) !== -1;
        } catch (error) {
            console.log('Error checking favorite', error);
            return false;
        }
    };




    const team = Array.from(new Set(player.map(perfume => perfume.team)));

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.header}>Player</Text>
            </View>
            <CategoryFilter
                team={team}
                selectedTeam={selectedTeam}
                onSelectTeam={setSelectedTeam}
            />
            <FlatList
                data={filteredPlayer}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                renderItem={({ item }) => (
                    <PlayerCard
                        player={item}
                        favorite={isFavorite(item.id)}
                        onChangeFavList={() => toggleFavorite(item)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
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
    list: {
        flexGrow: 1,
        paddingHorizontal: 3,
        paddingTop: 10,
        paddingBottom: 30,
        backgroundColor: '#96C9F4',
    },
    centeredText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});

export default HomeScreen;
