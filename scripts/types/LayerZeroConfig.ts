export interface LayerZeroPeer {
    network: string;
    endpointId: number;
    deploymentKey: string;
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
    endpoint: LayerZeroEndpoint;
    peers: {
        [key: string]: LayerZeroPeer;
    };
}