import { useState } from 'react'

function useLocalStorage(key, initialValue = null) {

    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key)

            return item ? JSON.parse(item) : initialValue
        }

        catch (err) {
            return initialValue;
        }
    })

    const setValue = value => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            localStorage.setItem(key, JSON.stringify(valueToStore))
        }

        catch (err) {
            return null
        }
    }

    return [storedValue, setValue]
}

export default useLocalStorage