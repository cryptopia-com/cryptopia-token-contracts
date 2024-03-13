import { LayerZeroConfig } from './scripts/types/LayerZeroConfig';

const config : AppConfig = {
    networks: {
        development: {
            layerZero: {
                token: "CryptosTokenSkaleEuropa",
                endpoint: {
                    endpointId: 3,
                    endpointLocation: "MockLayerZeroEndpoint",
                    endpointDestinations: [
                        {
                            destinationToken: "CryptosTokenOFTAdapter",
                            destinationEndpoint: "MockLayerZeroEndpoint:Skale"
                        },
                        {
                            destinationToken: "CryptosTokenPolygon",
                            destinationEndpoint: "MockLayerZeroEndpoint:Polygon"
                        }
                    ]
                },
                peers: {
                    ethereum: {
                        network: "localhost",
                        endpointId: 1,
                        token: "CryptosTokenOFTAdapter"
                    },
                    polygon: {
                        network: "localhost",
                        endpointId: 2,
                        token: "CryptosTokenPolygon"
                    }
                }
            }
        },
        skaleEuropaTestnet: {
            layerZero: {
                token: "CryptosTokenSkaleEuropa",
                endpoint: {
                    endpointId: 40254,
                    endpointLocation: "0x6EDCE65403992e310A62460808c4b910D972f10f"
                },
                peers: {
                    ethereum: {
                        network: "ethereumSepolia",
                        endpointId: 40161,
                        token: "CryptosTokenOFTAdapter"
                    },
                    polygon: {
                        network: "polygonMumbai",
                        endpointId: 40109,
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