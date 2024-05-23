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

export interface LayerZeroEndpoint {
    endpointId: number,
    endpointLocation: string;
    endpointAltToken?: string;
    endpointDestinations?: LayerZeroEndpointDestination[];
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