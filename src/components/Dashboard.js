import React, { useEffect, useState } from 'react'

import { MDBContainer } from 'mdbreact'
import { Container } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'
import '../assets/css/main.css'

import NavigationBar from './NavigationBar'
import LoadingScreen from './LoadingScreen'
import GoogleMap from './GoogleMap'

import axios from 'axios'


const apiURL = require('../assets/apiURL.json').url

function Dashboard() {

    const [spots, setSpots] = useState([])
    const [favourites, setFavourites] = useState([])
    const [loadingMessage, setLoadingMessage] = useState('Please wait while we are loading the map...')
    const [tableData, setTableData] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const mapContainerStyle = {
        width: '1920px',
        height: '720px',
        position: 'relative'
    }

    const center = {
        lat: 45.9443,
        lng: 25.0094
    }

    const fetchData = async (requestCount = 0) => {
        let requestSpots, requestFavourites
        
        try {
            requestSpots = await axios.get(apiURL + 'spot')
            requestFavourites = await axios.get(apiURL + 'favourites')
        }

        catch (err) {
            if (requestCount < 2) {
                setLoadingMessage('Unexpected error. Trying again...')
                return await fetchData(requestCount + 1)
            }

            const requestResponse = err.response

            return setLoadingMessage('Something went wrong, and we couldn\'t load the map. Server replied with: "' + requestResponse.data + '". Please try again.')
        }

        setSpots(requestSpots.data)
        setFavourites(requestFavourites.data)

        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <MDBContainer fluid className = 'main text-light'>
            <NavigationBar reloadData = { fetchData } isLoading = { isLoading } />
            
            {
                isLoading ? <LoadingScreen loadingMessage = { loadingMessage } /> : 
                <Container fluid className = 'd-flex justify-content-center'>
                    <GoogleMap showFilter withWrap center = { center } zoom = { 6 } spots = { spots } favourites = { favourites } mapContainerStyle = { mapContainerStyle } />
                </Container>
            }

        </MDBContainer>
    )
}

export default Dashboard