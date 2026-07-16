import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_API_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getRooms = async () => {
    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('id', { ascending: true });

    if (error) throw error;
    return data;
};

export const createRoom = async (name) => {
    const { data, error } = await supabase
        .from('rooms')
        .insert([{ name }])
        .select();

    if (error) throw error;
    return data[0];
};

export const getMessages = async (roomId, limit = 50) => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(limit);

    if (error) throw error;
    return data;
};

export const createMessage = async (roomId, username, content) => {
    const { data, error } = await supabase
        .from('messages')
        .insert([{ room_id: roomId, username, content }])
        .select();

    if (error) throw error;
    return data[0];
};

export const registerAccess = () => {
  const insertAccess = async (location = null) => {
    const { error } = await supabase
      .from('accesses')
      .insert({
        latitude_coarse: location ? Number(location.latitude.toFixed(1)) : null,
        longitude_coarse: location ? Number(location.longitude.toFixed(1)) : null,
        accuracy_m: location ? Math.round(location.accuracy) : null,
      });

    if (error) console.error('Access info creation error:', error);
  };

  if (!navigator.geolocation) {
    insertAccess();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => insertAccess({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
    }),
    // User declined or location doesn't work.
    () => insertAccess(),
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    },
  );
};