import { LayerZeroConfig } from './scripts/types/LayerZeroConfig';

const config : AppConfig = {
    networks: {
        development: {
            layerZero: {
                token: "CryptosToken",
                adapter: "CryptosTokenOFTAdapter",
                endpoint: {
                    endpointId: 1,
                    endpointLocation: "MockLayerZeroEndpoint",
                    endpointDestinations: [
                        {
                            destinationToken: "CryptosTokenPolygon",
                            destinationEndpoint: "MockLayerZeroEndpoint:Polygon"
                        }
                    ]
                },
                peers: {
                    polygon: {
                        network: "localhost",
                        endpointId: 2,
                        token: "CryptosTokenPolygon"
                    }
                }
            }
        },
        ethereumSepolia: {
            confirmations: 1,
            pollingInterval: 1000,
            pollingTimeout: 300000, // 5 minutes
            owner: "0x333E78ae5D0Cc42586dAcE93a7a9e0a26789Eb4F",
            layerZero: {
                token: "CryptosToken",
                adapter: "CryptosTokenOFTAdapter",
                endpoint: {
                    endpointId: 40161,
                    endpointLocation: "0x6edce65403992e310a62460808c4b910d972f10f"
                },
                peers: {
                    polygon: {
                        network: "polygonMumbai",
                        endpointId: 40109,
                        token: "CryptosTokenPolygon"
                    }
                }
            }
        },
        ethereumMainnet: {
            confirmations: 2,
            pollingInterval: 1000,
            pollingTimeout: 600000, // 10 minutes
            owner: "0xa25BabD8e575FF990F6dE4326633cd0371534500",
            layerZero: {
                token: "CryptosToken",
                adapter: "CryptosTokenOFTAdapter",
                endpoint: {
                    endpointId: 30101,
                    endpointLocation: "0x1a44076050125825900e736c501f859c50fe728c"
                    
                },
                peers: {
                    polygon: {
                        network: "polygonMainnet",
                        endpointId: 30109,
                        token: "CryptosTokenPolygon"
                    }
                }
            }
        }
    }
};

export default config;

export interface NetworkConfig {
    confirmations?: number;
    pollingInterval?: number;
    pollingTimeout?: number;
    owner?: string;
    layerZero: LayerZeroConfig;
}

interface AppConfig {
    networks: {
        [key: string]: NetworkConfig;
    };
}