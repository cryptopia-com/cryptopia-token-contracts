export interface LayerZeroPeer {
    network: string;
    endpointId: number;
    token: string;
}

export interface LayerZeroEndpointDestination {
    destinationToken: string;
    destinationEndpoint: string;
}

export interface LayerZeroEndpoint {
    endpointId: number,
    endpointLocation: string;
    endpointDestinations?: LayerZeroEndpointDestination[];
}

export interface LayerZeroConfig {
    token: string;
    adapter?: string;
    endpoint: LayerZeroEndpoint;
    peers: {
        [key: string]: LayerZeroPeer;
    };
}