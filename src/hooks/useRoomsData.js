import { getRooms } from '../services/supabase';
import { useFetchData } from './useFetchData';

export function useRoomsData() {
    const rooms = useFetchData(getRooms);
    return { data: rooms.data, loading: rooms.loading, error: rooms.error };
}