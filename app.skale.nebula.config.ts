const config : AppConfig = {
    networks: {
        development: {},
        skaleEuropaTestnet: {},
        skaleEuropaMainnet: {}
    }
};

export default config;

export interface NetworkConfig {
    confirmations?: number;
    pollingInterval?: number;
    pollingTimeout?: number;
}

interface AppConfig {
    networks: {
        [key: string]: NetworkConfig;
    };
}