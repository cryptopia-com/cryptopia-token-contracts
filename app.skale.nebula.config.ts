const config : AppConfig = {
    networks: {
        development: {},
        skaleNebulaTestnet: {}
    }
};

export default config;

export interface NetworkConfig {
    confirmations?: number;
    pollingInterval?: number;
    pollingTimeout?: number;
    owner?: string;
}

interface AppConfig {
    networks: {
        [key: string]: NetworkConfig;
    };
}