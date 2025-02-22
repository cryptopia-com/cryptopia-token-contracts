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
                        },
                        {
                            destinationToken: "CryptosTokenSkaleEuropa",
                            destinationEndpoint: "MockLayerZeroEndpointAlt:Skale"
                        },
                        {
                            destinationToken: "CryptosTokenBNB",
                            destinationEndpoint: "MockLayerZeroEndpoint:BNB"
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
                    skale: {
                        network: "localhost",
                        endpointId: 3,
                        token: "CryptosTokenSkaleEuropa"
                    },
                    bnb: {
                        network: "localhost",
                        endpointId: 4,
                        token: "CryptosTokenBNB"
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
        polygonAmoy: {
            layerZero: {
                token: "CryptosTokenPolygon",
                endpoint: {
                    endpointId: 40267,
                    endpointLocation: "0x6edce65403992e310a62460808c4b910d972f10f"
                },
                peers: {
                    ethereum: {
                        network: "ethereumSepolia",
                        endpointId: 40161,
                        token: "CryptosToken"
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
        polygonMainnet: {
            layerZero: {
                token: "CryptosTokenPolygon",
                endpoint: {
                    endpointId: 30109,
                    endpointLocation: "0x1a44076050125825900e736c501f859c50fe728c",
                    config : {
                        skale: {
                            sendConfig: {
                                executorConfig: {
                                    maxMessageSize: 10000,
                                    executorAddress: '0xCd3F213AD101472e1713C72B1697E727C803885b'
                                },
                                ulnConfig: {
                                    confirmations: BigInt(10),
                                    optionalDVNCount: 0,
                                    requiredDVNCount: 1,
                                    optionalDVNThreshold: 0,
                                    requiredDVNs: [
                                        "0x23DE2FE932d9043291f870324B74F820e11dc81A"
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
                                        "0x23DE2FE932d9043291f870324B74F820e11dc81A"
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
                    skale: {
                        network: "skaleEuropaMainnet",
                        endpointId: 30273,
                        token: "CryptosTokenSkaleEuropa"
                    },
                    bnb: {
                        network: "bnbMainnet",
                        endpointId: 30102,
                        token: "CryptosTokenBNB"
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