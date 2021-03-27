import React, { useEffect, useState } from 'react'

import { MDBContainer } from 'mdbreact'
import { Container } from 'react-bootstrap'

import NavigationBar from './NavigationBar'
import LoadingScreen from './LoadingScreen'
import DataTable from './DataTable'
import GoogleMap from './GoogleMap'
    
import "@fortawesome/fontawesome-free/css/all.min.css"

import axios from 'axios'

const apiURL = require('../assets/apiURL.json').url

function Dashboard() {

    const createColumn = name => {
        return {
            label: name.charAt(0).toUpperCase() + name.slice(1),
            field: name.replace(/ /g, ''),
            sort: 'asc',
            width: 150
        }
    }

    const createRow = spot => {
        return {
            name: spot.name,
            country: spot.country,
            latitude: spot.lat,
            longitude: spot.long,
            windProbability: spot.probability,
            whentogo: spot.month
        }
    }

    const createRows = spots => {
        return spots.map(createRow)
    }

    const createColumns = arr => {
        return arr.map(createColumn)
    }

    const [spots, setSpots] = useState([])
    const [favourites, setFavourites] = useState([])
    const [loadingMessage, setLoadingMessage] = useState('Please wait while we are loading the map...')

    const [tableData, setTableData] = useState({
        columns: createColumns(['name', 'country', 'latitude', 'longitude', 'wind Probability', 'when to go'])
    })

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

        setTableData(prevState => {
            return { ...prevState, rows: createRows(requestSpots.data) }
        })

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

                <>
                    <Container fluid className = 'd-flex justify-content-center'>
                        <GoogleMap showFilter withWrap center = { center } zoom = { 6 } spots = { spots } favourites = { favourites } mapContainerStyle = { mapContainerStyle } />
                    </Container>

                    <br />

                    <Container className = 'd-flex justify-content-center'>
                        <DataTable data = { tableData } />
                    </Container>
                </>
            }

        </MDBContainer>
    )
}

export default Dashboard