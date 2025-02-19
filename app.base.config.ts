import { LayerZeroConfig } from './scripts/types/LayerZeroConfig';

const config : AppConfig = {
    networks: {
        development: {
            layerZero: {
                token: "CryptosTokenBase",
                endpoint: {
                    endpointId: 5,
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
                            destinationToken: "CryptosTokenBNB",
                            destinationEndpoint: "MockLayerZeroEndpoint:BNB"
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
                    bnb: {
                        network: "localhost",
                        endpointId: 4,
                        token: "CryptosTokenBNB"
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
                    bnb: {
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
        baseTestnet: {
            layerZero: {
                token: "CryptosTokenBase",
                endpoint: {
                    endpointId: 40245,
                    endpointLocation: "0x6EDCE65403992e310A62460808c4b910D972f10f"
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
                    bnb: {
                        network: "bnbTestnet",
                        endpointId: 40102,
                        token: "CryptosTokenBNB"
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
                    bnb: {
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
        baseMainnet: {
            layerZero: {
                token: "CryptosTokenBase",
                endpoint: {
                    endpointId: 30184,
                    endpointLocation: "0x4208D6E27538189bB48E603D6123A94b8Abe0A0b",
                    config : {
                        skale: {
                            sendConfig: {
                                executorConfig: {
                                    maxMessageSize: 10000,
                                    executorAddress: '0x2CCA08ae69E0C44b18a57Ab2A87644234dAebaE4'
                                },
                                ulnConfig: {
                                    confirmations: BigInt(10),
                                    optionalDVNCount: 0,
                                    requiredDVNCount: 1,
                                    optionalDVNThreshold: 0,
                                    requiredDVNs: [
                                        "0x9e059a54699a285714207b43b055483e78faac25"
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
                                        "0x9e059a54699a285714207b43b055483e78faac25"
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
                    bnb: {
                        network: "bnbMainnet",
                        endpointId: 30102,
                        token: "CryptosTokenBNB"
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
                    bnb: {
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