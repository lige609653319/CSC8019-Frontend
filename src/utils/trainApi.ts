const API_BASE = 'http://localhost:8080/api/raildata';

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

export const fetchUpcomingTrains = async (minutes: number = 60): Promise<TrainData[]> => {
    try {

        const response = await fetch(`${API_BASE}/trains`);
        const result = await response.json();

        console.log('API response:', result);


        if (Array.isArray(result)) {

            const now = new Date();
            const futureTime = new Date(now.getTime() + minutes * 60000);

            const filtered = result.filter((train: TrainData) => {
                if (!train.scheduledArrivalTime) return false;
                const arrivalTime = new Date(train.scheduledArrivalTime);
                return arrivalTime >= now && arrivalTime <= futureTime;
            });

            console.log(`Found ${filtered.length} trains arriving in next ${minutes} minutes`);
            return filtered;
        }

        else if (result.code === 200 && Array.isArray(result.data)) {
            const now = new Date();
            const futureTime = new Date(now.getTime() + minutes * 60000);

            const filtered = result.data.filter((train: TrainData) => {
                if (!train.scheduledArrivalTime) return false;
                const arrivalTime = new Date(train.scheduledArrivalTime);
                return arrivalTime >= now && arrivalTime <= futureTime;
            });

            return filtered;
        }
        else {
            throw new Error('Invalid data format received from server');
        }
    } catch (error) {
        console.error('Error fetching trains:', error);
        throw error;
    }
};