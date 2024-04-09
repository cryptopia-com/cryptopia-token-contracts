import { LayerZeroConfig } from './scripts/types/LayerZeroConfig';

const config : AppConfig = {
    networks: {
        development: {
            layerZero: {
                token: "CryptosTokenPolygon",
                endpoint: {
                    endpointId: 2,
                    endpointLocation: "MockLayerZeroEndpoint",
                    endpointDestinations: [
                        {
                            destinationToken: "CryptosToken",
                            destinationEndpoint: "MockLayerZeroEndpoint:Ethereum"
                        }
                    ]
                },
                peers: {
                    ethereum: {
                        network: "localhost",
                        endpointId: 1,
                        token: "CryptosToken"
                    }
                }
            }
        },
        polygonMumbai: {
            layerZero: {
                token: "CryptosTokenPolygon",
                endpoint: {
                    endpointId: 40109,
                    endpointLocation: "0x6edce65403992e310a62460808c4b910d972f10f"
                },
                peers: {
                    ethereum: {
                        network: "ethereumSepolia",
                        endpointId: 40161,
                        token: "CryptosToken"
                    }
                }
            }
        },
        polygonMainnet: {
            owner: "0x0b4bd509B93B21f25E2d7051905E4A7DCa180A72",
            layerZero: {
                token: "CryptosTokenPolygon",
                endpoint: {
                    endpointId: 30109,
                    endpointLocation: "0x1a44076050125825900e736c501f859c50fe728c"
                },
                peers: {
                    ethereum: {
                        network: "ethereumMainnet",
                        endpointId: 30101,
                        token: "CryptosToken"
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