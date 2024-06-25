export interface LayerZeroPeer {
    network: string;
    endpointId: number;
    token: string;
}

export interface LayerZeroOptions {
    executorLzReceiveOptions: ExecutorLzReceiveOption[];
}

export interface ExecutorLzReceiveOption {
    msgType: number;
    gasLimit: number;
}

export interface LayerZeroEndpointDestination {
    destinationToken: string;
    destinationEndpoint: string;
}

export interface LayerZeroExecutorConfig {
    maxMessageSize: number;
    executorAddress: string;
}

export interface LayerZeroULNConfig {
    confirmations: BigInt;
    optionalDVNCount: number;
    requiredDVNCount: number;
    optionalDVNThreshold: number;
    requiredDVNs: string[];
    optionalDVNs: string[];
}

export interface LayerZeroSendLibraryConfig {
    executorConfig: LayerZeroExecutorConfig;
    ulnConfig: LayerZeroULNConfig;
}

export interface LayerZeroReceiveLibraryConfig {
    ulnConfig: LayerZeroULNConfig;
}

export interface LayerZeroEndpointConfig {
    sendConfig: LayerZeroSendLibraryConfig;
    receiveConfig: LayerZeroReceiveLibraryConfig;
}

export interface LayerZeroEndpoint {
    endpointId: number,
    endpointLocation: string;
    endpointAltToken?: string;
    endpointDestinations?: LayerZeroEndpointDestination[];
    config?: {
        [key: string]: LayerZeroEndpointConfig;
    };
}

export interface LayerZeroConfig {
    token: string;
    adapter?: string;
    endpoint: LayerZeroEndpoint;
    peers: {
        [key: string]: LayerZeroPeer;
    };
    options: {
        [key: string]: LayerZeroOptions;
    };
}