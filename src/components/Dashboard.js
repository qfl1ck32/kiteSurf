import React, { useEffect, useState } from 'react'

import { MDBContainer } from 'mdbreact'

import { Container } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'
import '../assets/css/main.css'

import NavigationBar from '../components/NavigationBar'

import axios from 'axios'

import LoadingScreen from '../components/LoadingScreen'

import useLocalStorage from '../services/useLocalStorage'

import GoogleMap from './GoogleMap'

const apiURL = require('../assets/apiURL.json').url

function Dashboard() {

    const user = useLocalStorage('user')[0]

    const mapContainerStyle = {
        width: '1920px',
        height: '720px'
    }

    const center = {
        lat: user?.lat || 47,
        lng: user?.lng || 26
    }

    const [spots, setSpots] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = async () => {
        let request
        
        try {
            request = await axios.get(apiURL + 'spot')
        }

        catch (err) {
            return console.log('err') // will have to change
        }

        setSpots(request.data)
        setIsLoading(false)
        console.log(user)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <MDBContainer fluid className = 'main text-light'>
            <NavigationBar />

            {
                isLoading ? <LoadingScreen /> : 
                <Container fluid className = 'd-flex justify-content-center'>
                    <GoogleMap center = { center } zoom = { 8 } spots = { spots } mapContainerStyle = { mapContainerStyle } />
                </Container>
            }

        </MDBContainer>
    )
}

export default Dashboard