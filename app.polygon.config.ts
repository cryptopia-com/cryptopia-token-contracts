import { LayerZeroConfig } from './scripts/types/LayerZeroConfig';

const config : AppConfig = {
    networks: {
        development: {
            bridge: {
                depositor: "0xb5505a6d998549090530911180f38aC5130101c6"
            },
            layerZero: {
                endpoint: {
                    endpointId: 2,
                    endpointLocation: "MockLayerZeroEndpoint",
                    endpointDestinations: [
                        {
                            destinationToken: "CryptosTokenOFTAdapter",
                            destinationEndpoint: "MockLayerZeroEndpoint:Ethereum"
                        }
                    ]
                },
                peers: {
                    ethereum: {
                        network: "localhost",
                        endpointId: 1,
                        deploymentKey: "CryptosTokenOFTAdapter"
                    }
                }
            }
        },
        polygonMumbai: {
            bridge: {
                depositor: "0xb5505a6d998549090530911180f38aC5130101c6"
            },
            layerZero: {
                endpoint: {
                    endpointId: 40109,
                    endpointLocation: "0x6edce65403992e310a62460808c4b910d972f10f"
                },
                peers: {
                    ethereum: {
                        network: "ethereumSepolia",
                        endpointId: 40161,
                        deploymentKey: "CryptosTokenOFTAdapter"
                    }
                }
            }
        },
        polygonMainnet: {
            owner: "0x0b4bd509B93B21f25E2d7051905E4A7DCa180A72",
            bridge: {
                depositor: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa"
            },
            layerZero: {
                endpoint: {
                    endpointId: 30109,
                    endpointLocation: "0x1a44076050125825900e736c501f859c50fe728c"
                },
                peers: {
                    ethereum: {
                        network: "ethereumMainnet",
                        endpointId: 30101,
                        deploymentKey: "CryptosTokenOFTAdapter"
                    }
                }
            }
        }
    }
};

export default config;

export interface PolygonBridgeConfig {
    depositor: string;
}

export interface NetworkConfig {
    confirmations?: number;
    pollingInterval?: number;
    pollingTimeout?: number;
    owner?: string;
    bridge: PolygonBridgeConfig;
    layerZero: LayerZeroConfig;
}

interface AppConfig {
    networks: {
        [key: string]: NetworkConfig;
    };
}