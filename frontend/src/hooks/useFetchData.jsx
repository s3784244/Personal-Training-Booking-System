/**
 * Custom Hook for Data Fetching
 * 
 * This reusable hook handles:
 * - API data fetching with loading states
 * - Error handling and user feedback
 * - Automatic re-fetching when URL changes
 * - Authentication token management
 * 
 * Used throughout the app for consistent data fetching patterns.
 * 
 * @param {string} url - The API endpoint to fetch data from
 * @returns {Object} - Contains data, loading state, and error state
 */

import { useEffect, useState } from 'react'

const useFetchData = (url) => {
  // State management for API response
  const [data, setData] = useState([])      // Fetched data
  const [loading, setLoading] = useState(false)  // Loading indicator
  const [error, setError] = useState(null)       // Error state

  useEffect(() => {
    // Function to fetch data from API
    const fetchData = async () => {
      setLoading(true)  // Show loading spinner
      
      try {
        // Get token from localStorage dynamically instead of importing from config
        const token = localStorage.getItem('token');
        
        const res = await fetch(url, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })

        const result = await res.json()

        // Check if request was successful
        if (!res.ok) {
          throw new Error(result.message + '😢')
        }

        // Update state with fetched data
        setData(result.data)
        setLoading(false)
        
      } catch (err) {
        // Handle errors and update error state
        setLoading(false)
        setError(err.message)
      }
    }

    // Trigger data fetch when component mounts or URL changes
    fetchData()
  }, [url])  // Re-run effect when URL changes

  // Return data and states for component consumption
  return {
    data,
    loading,
    error,
  }
}

export default useFetchData