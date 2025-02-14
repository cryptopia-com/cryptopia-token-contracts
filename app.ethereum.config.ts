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
                        },
                        {
                            destinationToken: "CryptosTokenBNB",
                            destinationEndpoint: "MockLayerZeroEndpoint:BNB"
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
                    },
                    bnb: {
                        network: "localhost",
                        endpointId: 4,
                        token: "CryptosTokenBNB"
                    }
                },
                options: {
                    polygon: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    skale: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    bnb: {
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
                    },
                    bnb: {
                        network: "bnbTestnet",
                        endpointId: 40102,
                        token: "CryptosTokenBNB"
                    }
                },
                options: {
                    polygon: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    skale: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    bnb: {
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
        ethereumMainnet: {
            confirmations: 2,
            pollingInterval: 1000,
            pollingTimeout: 600000, // 10 minutes
            layerZero: {
                token: "CryptosToken",
                endpoint: {
                    endpointId: 30101,
                    endpointLocation: "0x1a44076050125825900e736c501f859c50fe728c",
                    config : {
                        skale: {
                            sendConfig: {
                                executorConfig: {
                                    maxMessageSize: 10000,
                                    executorAddress: '0x173272739Bd7Aa6e4e214714048a9fE699453059'
                                },
                                ulnConfig: {
                                    confirmations: BigInt(10),
                                    optionalDVNCount: 0,
                                    requiredDVNCount: 1,
                                    optionalDVNThreshold: 0,
                                    requiredDVNs: [
                                        "0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
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
                                        "0x589dEDbD617e0CBcB916A9223F4d1300c294236b"
                                    ],
                                    optionalDVNs: []
                                }
                            }
                        }
                    }
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
                    },
                    bnb: {
                        network: "bnbMainnet",
                        endpointId: 30102,
                        token: "CryptosTokenBNB"
                    }
                },
                options: {
                    polygon: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    skale: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    bnb: {
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