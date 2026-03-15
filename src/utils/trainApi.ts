import request from '../utils/request';

const API_BASE = '/api/raildata';

export interface TrainData {
    id: number;
    trainId: string;
    originStation: string;
    destinationStation: string;
    currentStation: string;
    scheduledArrivalTime: string;
    estimatedArrivalTime: string | null;
    actualArrivalTime: string | null;
    status: string;
    delayMinutes: number | null;
    platform: string | null;
    lastUpdated: string;
    isDelayed: boolean;
}

interface RawTrainData {
    id?: number;
    trainId?: string;
    originStation?: string | null;
    destinationStation?: string | null;
    currentStation?: string | null;
    scheduledArrivalTime?: string | number | null;
    estimatedArrivalTime?: string | number | null;
    actualArrivalTime?: string | number | null;
    status?: string | null;
    delayMinutes?: number | null;
    platform?: string | null;
    lastUpdated?: string | null;
    isDelayed?: boolean | null;
}

interface ApiResponse<T = RawTrainData[]> {
    code: number;
    message: string;
    data: T;
}

export const fetchUpcomingTrains = async (): Promise<TrainData[]> => {
    try {
        console.log('Fetching from:', API_BASE + '/trains');
        console.log('Token exists:', !!localStorage.getItem('token'));

        const response = await request.get(API_BASE + '/trains') as ApiResponse;

        console.log('API response:', response);

        if (!response || response.code !== 200) {
            console.error('API error:', response?.code, response?.message);
            return [];
        }

        if (!Array.isArray(response.data)) {
            console.error('Data is not an array:', response.data);
            return [];
        }

        console.log('Total trains:', response.data.length);

        const mappedData: TrainData[] = response.data.map((train: RawTrainData) => ({
            id: train.id || Math.random(),
            trainId: train.trainId || 'Unknown',
            originStation: train.originStation || 'Unknown',
            destinationStation: train.destinationStation || 'Unknown',
            currentStation: train.currentStation || 'Unknown',
            scheduledArrivalTime: train.scheduledArrivalTime
                ? (typeof train.scheduledArrivalTime === 'number'
                    ? new Date(train.scheduledArrivalTime).toISOString()
                    : train.scheduledArrivalTime)
                : new Date().toISOString(),
            estimatedArrivalTime: train.estimatedArrivalTime ? String(train.estimatedArrivalTime) : null,
            actualArrivalTime: train.actualArrivalTime ? String(train.actualArrivalTime) : null,
            status: train.status || 'UNKNOWN',
            delayMinutes: train.delayMinutes || 0,
            platform: train.platform?.trim() || 'TBC',
            lastUpdated: train.lastUpdated || new Date().toISOString(),
            isDelayed: train.isDelayed || train.status === 'DELAYED'
        }));

        console.log('Mapped', mappedData.length, 'trains');
        return mappedData;

    } catch (error: any) {
        console.error('Error fetching trains:', error);
        return [];
    }
};