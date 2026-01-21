import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
  },
});

export const getRooms = async () => {
  const { data } = await api.get('/rooms');
  return data;
};

export const getRoom = async (id) => {
  const { data } = await api.get(`/rooms?id=eq.${id}`);
  return data[0];
};

export const createRoom = async (name) => {
  const { data } = await api.post('/rooms', { name });
  return data;
};

export const deleteRoom = async (id) => {
  await api.delete(`/rooms?id=eq.${id}`);
};

export const getMessages = async (roomId, limit = 50) => {
  const { data } = await api.get(
    `/messages?room_id=eq.${roomId}&order=created_at.desc&limit=${limit}`
  );
  return data;
};

export const createMessage = async (roomId, username, content) => {
  const { data } = await api.post('/messages', {
    room_id: roomId,
    username,
    content,
  });
  return data;
};

export const deleteMessage = async (roomId, messageId) => {
  await api.delete(`/messages?id=eq.${messageId}&room_id=eq.${roomId}`);
};

export default api;