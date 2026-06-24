import axios from "axios"
import { useEffect, useState } from "react"

const useFetch = (url) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
        async function fetchfromApi(){
            try {
                const currentApiData = await axios.get(url, {
                    withCredentials: true
                })

                setData(currentApiData.data)
                setLoading(false)
            } catch (error) {
                console.error(error)
                setError(error)
                setLoading(false)
            }
        }

        useEffect(() => {
            fetchfromApi()
        },[url])


        return ({data, loading, error, refetch: fetchfromApi})
    }

export default useFetch;