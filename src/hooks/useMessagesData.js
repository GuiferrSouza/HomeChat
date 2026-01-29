import { useEffect, useState } from 'react';
import { getMessages } from '../services/supabase';

export function useMessagesData(roomId) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!roomId) {
            setData([]);
            return;
        }

        let isMounted = true;
        setLoading(true);

        getMessages(roomId)
            .then((messages) => { if (isMounted) { setData(messages) } })
            .catch((err) => { if (isMounted) { setError(err.message) } })
            .finally(() => { if (isMounted) { setLoading(false) } });

        return () => { isMounted = false };
    }, [roomId]);

    return { data, setData, loading, error };
}