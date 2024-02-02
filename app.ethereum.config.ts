const config : AppConfig = {
    networks: {
        development: {},
        ethereumGoerli: {
            confirmations: 1,
            pollingInterval: 1000,
            pollingTimeout: 300000 // 5 minutes
        },
        ethereumMainnet: {
            confirmations: 2,
            pollingInterval: 1000,
            pollingTimeout: 600000 // 10 minutes
        }
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