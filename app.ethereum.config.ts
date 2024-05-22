import { LayerZeroConfig } from './scripts/types/LayerZeroConfig';

const config : AppConfig = {
    networks: {
        development: {
            layerZero: {
                token: "CryptosToken",
                endpoint: {
                    endpointId: 1,
                    endpointLocation: "MockLayerZeroEndpoint",
                    endpointDestinations: [
                        {
                            destinationToken: "CryptosTokenPolygon",
                            destinationEndpoint: "MockLayerZeroEndpoint:Polygon"
                        },
                        {
                            destinationToken: "CryptosTokenSkaleEuropa",
                            destinationEndpoint: "MockLayerZeroEndpointAlt:Skale"
                        }
                    ]
                },
                peers: {
                    polygon: {
                        network: "localhost",
                        endpointId: 2,
                        token: "CryptosTokenPolygon"
                    },
                    skale: {
                        network: "localhost",
                        endpointId: 3,
                        token: "CryptosTokenSkaleEuropa"
                    }
                }
            }
        },
        ethereumSepolia: {
            confirmations: 1,
            pollingInterval: 1000,
            pollingTimeout: 300000, // 5 minutes
            layerZero: {
                token: "CryptosToken",
                endpoint: {
                    endpointId: 40161,
                    endpointLocation: "0x6edce65403992e310a62460808c4b910d972f10f"
                },
                peers: {
                    polygon: {
                        network: "polygonAmoy",
                        endpointId: 40267,
                        token: "CryptosTokenPolygon"
                    },
                    skale: {
                        network: "skaleEuropaTestnet",
                        endpointId: 40273,
                        token: "CryptosTokenSkaleEuropa"
                    }
                }
            }
        },
        ethereumMainnet: {
            confirmations: 2,
            pollingInterval: 1000,
            pollingTimeout: 600000, // 10 minutes
            layerZero: {
                token: "CryptosToken",
                endpoint: {
                    endpointId: 30101,
                    endpointLocation: "0x1a44076050125825900e736c501f859c50fe728c"
                },
                peers: {
                    polygon: {
                        network: "polygonMainnet",
                        endpointId: 30109,
                        token: "CryptosTokenPolygon"
                    },
                    skale: {
                        network: "skaleEuropaMainnet",
                        endpointId: 30273,
                        token: "CryptosTokenSkaleEuropa"
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
    layerZero: LayerZeroConfig;
}

interface AppConfig {
    networks: {
        [key: string]: NetworkConfig;
    };
}