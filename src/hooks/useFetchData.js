import { useEffect, useState } from 'react'

export function useFetchData(fetchFunction) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const response = await fetchFunction()
                setData(response)
                setError(null)
            } catch (err) {
                console.error(err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [fetchFunction])

    return { data, loading, error }
}