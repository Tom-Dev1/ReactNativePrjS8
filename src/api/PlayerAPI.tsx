import { Player } from "../models/Player";
import ApiClient from "./APIClient";


export class PlayerAPI extends ApiClient {
    //Get all pefumes
    async getAllPlayer(): Promise<Player[]> {
        const response = await this.axiosInstance.get<Player[]>('/thanhttse160320');
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch player");
        }
    }


    // get a single pefume by ID
    async PlayerById(id: string): Promise<Player[]> {
        const response = await this.axiosInstance.get<Player[]>(`/thanhttse160320/${id}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch player by id");
        }
    }

}