import axios, { AxiosInstance } from "axios";

export default class ApiClient {
    axiosInstance: AxiosInstance;
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: "https://6692135626c2a69f6e916d99.mockapi.io/",
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}