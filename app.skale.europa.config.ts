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
                    polygon: {
                        network: "localhost",
                        endpointId: 2,
                        token: "CryptosTokenPolygon"
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
                    },
                    bnb: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    base: {
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
                    endpointAltToken: "0x6c71319b1F910Cf989AD386CcD4f8CC8573027aB"
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
                    },
                    bnb: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    base: {
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
                    endpointAltToken: "0xE0595a049d02b7674572b0d59cd4880Db60EDC50",
                    config : {
                        ethereum: {
                            sendConfig: {
                                executorConfig: {
                                    maxMessageSize: 10000,
                                    executorAddress: '0x4208D6E27538189bB48E603D6123A94b8Abe0A0b'
                                },
                                ulnConfig: {
                                    confirmations: BigInt(10),
                                    optionalDVNCount: 0,
                                    requiredDVNCount: 1,
                                    optionalDVNThreshold: 0,
                                    requiredDVNs: [
                                        "0xce8358bc28dd8296Ce8cAF1CD2b44787abd65887"
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
                                        "0xce8358bc28dd8296Ce8cAF1CD2b44787abd65887"
                                    ],
                                    optionalDVNs: []
                                }
                            }
                        },
                        polygon: {
                            sendConfig: {
                                executorConfig: {
                                    maxMessageSize: 10000,
                                    executorAddress: '0x4208D6E27538189bB48E603D6123A94b8Abe0A0b'
                                },
                                ulnConfig: {
                                    confirmations: BigInt(10),
                                    optionalDVNCount: 0,
                                    requiredDVNCount: 1,
                                    optionalDVNThreshold: 0,
                                    requiredDVNs: [
                                        "0xce8358bc28dd8296Ce8cAF1CD2b44787abd65887"
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
                                        "0xce8358bc28dd8296Ce8cAF1CD2b44787abd65887"
                                    ],
                                    optionalDVNs: []
                                }
                            }
                        },
                        bnb: {
                            sendConfig: {
                                executorConfig: {
                                    maxMessageSize: 10000,
                                    executorAddress: '0x4208D6E27538189bB48E603D6123A94b8Abe0A0b'
                                },
                                ulnConfig: {
                                    confirmations: BigInt(10),
                                    optionalDVNCount: 0,
                                    requiredDVNCount: 1,
                                    optionalDVNThreshold: 0,
                                    requiredDVNs: [
                                        "0xce8358bc28dd8296Ce8cAF1CD2b44787abd65887"
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
                                        "0xce8358bc28dd8296Ce8cAF1CD2b44787abd65887"
                                    ],
                                    optionalDVNs: []
                                }
                            }
                        },
                        base: {
                            sendConfig: {
                                executorConfig: {
                                    maxMessageSize: 10000,
                                    executorAddress: '0x4208D6E27538189bB48E603D6123A94b8Abe0A0b'
                                },
                                ulnConfig: {
                                    confirmations: BigInt(10),
                                    optionalDVNCount: 0,
                                    requiredDVNCount: 1,
                                    optionalDVNThreshold: 0,
                                    requiredDVNs: [
                                        "0xce8358bc28dd8296Ce8cAF1CD2b44787abd65887"
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
                                        "0xce8358bc28dd8296Ce8cAF1CD2b44787abd65887"
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
                    },
                    bnb: {
                        executorLzReceiveOptions: [
                            {
                                msgType: 1,
                                gasLimit: 60000
                            }
                        ]
                    },
                    base: {
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