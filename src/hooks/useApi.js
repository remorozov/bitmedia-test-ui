import { useCallback, useState } from 'react'
import axios from 'axios'

// axios.defaults.baseURL = process.env.BASE_URL | 'http://localhost:4000/transactions'
axios.defaults.baseURL = 'https://bitmedia-test-api-6uo7q.ondigitalocean.app/transactions'

class ApiError extends Error {
  apiMessage = this.message
}

export const useApi = () => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const getTransactions = useCallback(async ({ page }) => {
    setLoading(true)
    try {
      const { data } = await axios.get(`?page=${page}`)
      //   console.log(data)
      if (data.error) {
        throw new ApiError(data.error)
      }
      setLoading(false)
      return data
    } catch (err) {
      console.log(err.message)
      setError(err.apiMessage || 'Oops, something went wrong')
      setLoading(false)
    }
  })

  const getTransactionsByFilter = useCallback(async ({ page, filter, value }) => {
    setLoading(true)
    try {
      const { data } = await axios.get(`/${filter}/${value}?page=${page}`)
      console.log(data)
      if (data.error) {
        console.log(data.error)
        throw new ApiError(data.error)
      }
      setLoading(false)
      return data
    } catch (err) {
      if (!!err.request?.response) {
        const obj = JSON.parse(err.request.response)
        obj.error && setError(obj.error)
        setLoading(false)
        return null
      }
      setError('Oops, something went wrong')
      setLoading(false)
      return null
    }
  })

  return {
    error,
    setError,
    loading,
    getTransactions,
    getTransactionsByFilter,
  }
}
