import { useState, useEffect } from 'react'
import { getPostsPage } from '../api/axios'

const useAxios = (pageNum = 1, filter) => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false)
    const [prevFilter, setPrevFilter] = useState("")

    useEffect(() => {
        setIsLoading(true)
        setIsError(false)
        setError({})

        const controller = new AbortController()
        const { signal } = controller

        getPostsPage(pageNum, { signal }, filter)
            .then(data => {
                if(prevFilter === filter) {
                    setResults(prev => [...prev, ...data])
                    setHasNextPage(Boolean(data.length))
                    setIsLoading(false)
                } else {
                    setResults(data)
                    setHasNextPage(Boolean(data.length))
                    setIsLoading(false)
                    setPrevFilter(filter)
                }

            })
            .catch(e => {
                setIsLoading(false)
                if (signal.aborted) return
                setIsError(true)
                setError({ message: e.message })
            })

        return () => controller.abort()

    }, [pageNum, filter])

    return { isLoading, isError, error, results, hasNextPage, setResults }
}

export default useAxios