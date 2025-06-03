// import { useEffect, useState } from 'react'
// import { token } from '../config'

// const useFetchData = (url) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       try {
//         const res = await fetch(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         const result = await res.json();

//         if (!res.ok) {
//           throw new Error(result.message);
//         }
//         setData(result.data);
//         setLoading(false);

//       } catch (err) {
//         setLoading(false);
//         setError(err.message);
//       }
//     } 

//     fetchData();
//   }, [url]);
//   return {
//     data, loading, error
//   }
// }

// export default useFetchData
import { useEffect, useState } from 'react'

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Get token from localStorage dynamically instead of importing from config
        const token = localStorage.getItem('token');
        
        const res = await fetch(url, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }
        setData(result.data);
        setLoading(false);

      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    } 

    fetchData();
  }, [url]);
  
  return {
    data, loading, error
  }
}

export default useFetchData