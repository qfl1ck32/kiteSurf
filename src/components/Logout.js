import { useEffect } from 'react'
import { Redirect } from 'react-router-dom'

function Logout() {
    useEffect(() => {
        localStorage.clear()
    }, [])

    return <Redirect to = '/Dashboard' />
}

export default Logout