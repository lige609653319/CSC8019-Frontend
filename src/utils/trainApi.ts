import request from '../utils/request';

const API_BASE = '/api/raildata';


const STATION_MAP: Record<string, string> = {
    '74800': 'Cramlington',
    '74801': 'Cramlington',
    'CRL': 'Cramlington',
    'CML': 'Cramlington',
    '30120': 'Newcastle',
    '31000': 'Newcastle',
    'NCL': 'Newcastle',
    '62011': 'Edinburgh',
    'EDB': 'Edinburgh',
    '52733': 'Morpeth',
    'MPT': 'Morpeth',
    '88461': 'Durham',
    'DMH': 'Durham',
    '72115': 'Sunderland',
    'SUN': 'Sunderland',
    '44365': 'Middlesbrough',
    'MBR': 'Middlesbrough',
    '77086': 'Darlington',
    'DAR': 'Darlington',
    '88315': 'York',
    'YRK': 'York',
    '87905': 'Leeds',
    'LDS': 'Leeds',
    '51937': 'Berwick-upon-Tweed',
    'BWK': 'Berwick-upon-Tweed'
};

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
    loc_stanox?: string | null;
    origin_location?: string | null;
    destination_location?: string | null;
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

const getStationName = (code: string | null | undefined): string => {
    if (!code) return 'Unknown Station';

    if (STATION_MAP[code]) {
        return STATION_MAP[code];
    }

    const trimmedCode = code.replace(/^0+/, '');
    if (STATION_MAP[trimmedCode]) {
        return STATION_MAP[trimmedCode];
    }

    const upperCode = code.toUpperCase();
    if (STATION_MAP[upperCode]) {
        return STATION_MAP[upperCode];
    }

    return 'Station ' + code;
};

export const fetchUpcomingTrains = async (): Promise<TrainData[]> => {
    try {
        console.log('Fetching from:', API_BASE + '/trains');

        // 使用泛型指定返回类型
        const response = await request.get(API_BASE + '/trains') as ApiResponse;

        console.log('API response:', response);

        let trainsArray: RawTrainData[] = [];

        if (response && response.code === 200 && Array.isArray(response.data)) {
            trainsArray = response.data;
        }
        else {
            console.error('Unexpected data format:', response);
            return [];
        }

        console.log('Total trains from API:', trainsArray.length);

        const mappedData: TrainData[] = trainsArray.map((train: RawTrainData) => {
            const trainId = train.trainId || train.id?.toString() || 'Unknown';

            const originCode = train.originStation || train.origin_location || '';
            const destCode = train.destinationStation || train.destination_location || '';
            const currentCode = train.currentStation || train.loc_stanox || '';

            const currentStation = getStationName(currentCode);
            const originStation = originCode ? getStationName(originCode) : currentStation;
            const destinationStation = destCode ? getStationName(destCode) : currentStation;

            let scheduledTime: string;
            if (train.scheduledArrivalTime && typeof train.scheduledArrivalTime === 'number') {
                scheduledTime = new Date(train.scheduledArrivalTime).toISOString();
            } else if (train.scheduledArrivalTime && typeof train.scheduledArrivalTime === 'string') {
                scheduledTime = train.scheduledArrivalTime;
            } else {
                scheduledTime = new Date().toISOString();
            }

            const status = train.status || 'UNKNOWN';

            return {
                id: train.id || Math.random(),
                trainId: trainId,
                originStation: originStation,
                destinationStation: destinationStation,
                currentStation: currentStation,
                scheduledArrivalTime: scheduledTime,
                estimatedArrivalTime: train.estimatedArrivalTime ? String(train.estimatedArrivalTime) : null,
                actualArrivalTime: train.actualArrivalTime ? String(train.actualArrivalTime) : null,
                status: status,
                delayMinutes: train.delayMinutes || 0,
                platform: train.platform?.trim() || 'TBC',
                lastUpdated: train.lastUpdated || new Date().toISOString(),
                isDelayed: train.isDelayed || status === 'DELAYED'
            };
        });

        console.log('Mapped', mappedData.length, 'trains');
        return mappedData;

    } catch (error) {
        console.error('Error fetching trains:', error);


        if (error && typeof error === 'object') {
            const err = error as { response?: { status: number; data: unknown }; message?: string };
            if (err.response) {
                console.error('Response error:', err.response.status, err.response.data);
                if (err.response.status === 401) {
                    console.error('未认证，请先登录');
                } else if (err.response.status === 403) {
                    console.error('没有权限');
                }
            } else if (err.message) {
                console.error('Error message:', err.message);
            }
        }

        return [];
    }
};