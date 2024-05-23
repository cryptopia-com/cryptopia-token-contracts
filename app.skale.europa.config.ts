import { LayerZeroConfig } from './scripts/types/LayerZeroConfig';

const config : AppConfig = {
    networks: {
        development: {
            layerZero: {
                token: "CryptosTokenSkaleEuropa",
                endpoint: {
                    endpointId: 3,
                    endpointLocation: "MockLayerZeroEndpointAlt",
                    endpointAltToken: "MockLayerZeroEndpointAltToken",
                    endpointDestinations: [
                        {
                            destinationToken: "CryptosToken",
                            destinationEndpoint: "MockLayerZeroEndpoint:Ethereum"
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
                        token: "CryptosToken"
                    },
                    polygon: {
                        network: "localhost",
                        endpointId: 2,
                        token: "CryptosTokenPolygon"
                    }
                },
                options: {
                    ethereum: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    polygon: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    }
                }
            }
        },
        skaleEuropaTestnet: {
            layerZero: {
                token: "CryptosTokenSkaleEuropa",
                endpoint: {
                    endpointId: 40273,
                    endpointLocation: "0x82b7dc04A4ABCF2b4aE570F317dcab49f5a10f24",
                    endpointAltToken: "0x",
                },
                peers: {
                    ethereum: {
                        network: "ethereumSepolia",
                        endpointId: 40161,
                        token: "CryptosToken"
                    },
                    polygon: {
                        network: "polygonAmoy",
                        endpointId: 40267,
                        token: "CryptosTokenPolygon"
                    }
                },
                options: {
                    ethereum: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    polygon: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    }
                }
            }
        },
        skaleEuropaMainnet: {
            layerZero: {
                token: "CryptosTokenSkaleEuropa",
                endpoint: {
                    endpointId: 30273,
                    endpointLocation: "0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043",
                    endpointAltToken: "0x",
                },
                peers: {
                    ethereum: {
                        network: "ethereumMainnet",
                        endpointId: 30101,
                        token: "CryptosToken"
                    },
                    polygon: {
                        network: "polygonMainnet",
                        endpointId: 30109,
                        token: "CryptosTokenPolygon"
                    }
                },
                options: {
                    ethereum: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    polygon: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
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