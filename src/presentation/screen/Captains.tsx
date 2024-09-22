import { StackNavigationProp } from "@react-navigation/stack";
import { Text, View, StyleSheet, Image, FlatList } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigation";
import { RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Player } from "../../models/Player";
import { PlayerAPI } from "../../api/PlayerAPI";




type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Captains'>;
    route: RouteProp<RootStackParamList, 'Captains'>;
};
const Captains: React.FC = () => {
    const [captains, setCaptains] = useState<Player[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            const playerAPI = new PlayerAPI();
            try {
                const players = await playerAPI.getAllPlayer();
                const currentYear = new Date().getFullYear();
                const captainsOver34 = players
                    .filter(player => player.isCaptain && (currentYear - player.YoB > 34))
                    .sort((a, b) => a.MinutesPlayed - b.MinutesPlayed); // Sorting by MinutesPlayed in ascending order
                setCaptains(captainsOver34);
            } catch (err) {
                setError('Failed to fetch captains');
            }
        };

        fetchPlayers();
    }, []);

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Captains Over 34</Text>
            <FlatList
                data={captains}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.playerContainer}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.playerInfo}>
                            <Text style={styles.playerName}>{item.playerName}</Text>
                            <Text>Minutes Played: {item.MinutesPlayed}</Text>
                            <Text>Position: {item.position}</Text>
                            <Text>Team: {item.team}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    playerContainer: {
        flexDirection: 'row',
        marginBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 20,
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
});

export default Captains;