const config : AppConfig = {
    networks: {
        development: {
            depositor: "0xb5505a6d998549090530911180f38aC5130101c6"
        },
        polygonMumbai: {
            depositor: "0xb5505a6d998549090530911180f38aC5130101c6"
        },
        polygonMainnet: {
            depositor: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa"
        }
    }
};

export default config;

export interface NetworkConfig {
    confirmations?: number;
    pollingInterval?: number;
    pollingTimeout?: number;
    depositor: string;
}

interface AppConfig {
    networks: {
        [key: string]: NetworkConfig;
    };
}