import { LayerZeroConfig } from './scripts/types/LayerZeroConfig';

const config : AppConfig = {
    networks: {
        development: {
            layerZero: {
                token: "CryptosTokenBNB",
                endpoint: {
                    endpointId: 4,
                    endpointLocation: "MockLayerZeroEndpoint",
                    endpointDestinations: [
                        {
                            destinationToken: "CryptosToken",
                            destinationEndpoint: "MockLayerZeroEndpoint:Ethereum"
                        },
                        {
                            destinationToken: "CryptosTokenPolygon",
                            destinationEndpoint: "MockLayerZeroEndpoint:Polygon"
                        },
                        {
                            destinationToken: "CryptosTokenSkaleEuropa",
                            destinationEndpoint: "MockLayerZeroEndpointAlt:Skale"
                        },
                        {
                            destinationToken: "CryptosTokenBase",
                            destinationEndpoint: "MockLayerZeroEndpoint:Base"
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
                    },
                    skale: {
                        network: "localhost",
                        endpointId: 3,
                        token: "CryptosTokenSkaleEuropa"
                    },
                    base: {
                        network: "localhost",
                        endpointId: 5,
                        token: "CryptosTokenBase"
                    }
                },
                options: {
                    ethereum: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
                            }
                        ]
                    },
                    polygon: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
                            }
                        ]
                    },
                    skale: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
                            }
                        ]
                    },
                    base: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
                            }
                        ]
                    }
                }
            }
        },
        bnbTestnet: {
            layerZero: {
                token: "CryptosTokenBNB",
                endpoint: {
                    endpointId: 40102,
                    endpointLocation: "0x6edce65403992e310a62460808c4b910d972f10f"
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
                    },
                    skale: {
                        network: "skaleEuropaTestnet",
                        endpointId: 40273,
                        token: "CryptosTokenSkaleEuropa"
                    },
                    base: {
                        network: "baseTestnet",
                        endpointId: 40245,
                        token: "CryptosTokenBase"
                    }
                },
                options: {
                    ethereum: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
                            }
                        ]
                    },
                    polygon: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
                            }
                        ]
                    },
                    skale: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
                            }
                        ]
                    },
                    base: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
                            }
                        ]
                    }
                }
            }
        },
        bnbMainnet: {
            layerZero: {
                token: "CryptosTokenBNB",
                endpoint: {
                    endpointId: 30102,
                    endpointLocation: "0x1a44076050125825900e736c501f859c50fE728c",
                    config : {
                        skale: {
                            sendConfig: {
                                executorConfig: {
                                    maxMessageSize: 10000,
                                    executorAddress: '0x3ebD570ed38B1b3b4BC886999fcF507e9D584859'
                                },
                                ulnConfig: {
                                    confirmations: BigInt(10),
                                    optionalDVNCount: 0,
                                    requiredDVNCount: 1,
                                    optionalDVNThreshold: 0,
                                    requiredDVNs: [
                                        "0xfd6865c841c2d64565562fcc7e05e619a30615f0"
                                    ],
                                    optionalDVNs: []
                                }
                            },
                            receiveConfig: {
                                ulnConfig: {
                                    confirmations: BigInt(10),
                                    optionalDVNCount: 0,
                                    requiredDVNCount: 1,
                                    optionalDVNThreshold: 0,
                                    requiredDVNs: [
                                        "0xfd6865c841c2d64565562fcc7e05e619a30615f0"
                                    ],
                                    optionalDVNs: []
                                }
                            }
                        }
                    }
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
                    },
                    skale: {
                        network: "skaleEuropaMainnet",
                        endpointId: 30273,
                        token: "CryptosTokenSkaleEuropa"
                    },
                    base: {
                        network: "baseMainnet",
                        endpointId: 30184,
                        token: "CryptosTokenBase"
                    }
                },
                options: {
                    ethereum: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
                            }
                        ]
                    },
                    polygon: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
                            }
                        ]
                    },
                    skale: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
                            }
                        ]
                    },
                    base: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 200000
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