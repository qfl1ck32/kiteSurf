import React, { useState, useEffect } from 'react'
import { GoogleMap as GM, Marker, InfoWindow, LoadScript  } from '@react-google-maps/api'

import { MDBContainer, MDBRow } from 'mdbreact'
import { Button, Image } from 'react-bootstrap'

import FilterModal from './FilterModal'
import useLocalStorage from '../services/useLocalStorage'

import Filter from '../assets/images/Filter.svg'
import '../assets/css/googleMap.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

const apiURL = require('../assets/apiURL.json').url

const SpotInfoContainer = props => {
    return (
        <>
            <MDBRow className = 'h6'> { props.name } </MDBRow>
            <MDBRow className = 'ml-2 font-weight-bold'> { props.value } </MDBRow>
        </>
    )
}

const MarkerFavouriteButton = props => {

    let iconAndText

    if (props.isFavourite)
        iconAndText = {
            icon: faMinus,
            text: 'Remove from favourites'
        }
    else
        iconAndText = {
            icon: faPlus,
            text: 'Add to favourites'
        }

    return (
        <>
            <FontAwesomeIcon icon = { iconAndText.icon } />
            <MDBContainer className = 'd-inline ml-1'>
                { iconAndText.text }
            </MDBContainer>
        </>
    )
}

function MarkerInfoWindow(props) {
    const [message, setMessage] = useState('')

    const spot = props.activeMarker

    const favouriteData = props.markerMapFavourites[spot.id]
    const isFavourite = favouriteData.isFavourite

    const manageFavourites = async () => {
        let newID

        try {
            if (isFavourite)
                await axios.delete(apiURL + 'favourites/' + favouriteData.id)

            else {
                const newFavourite = await axios.post(apiURL + 'favourites')
                const newFavouriteID = newFavourite.data.id

                const fav = await axios.put(apiURL + 'favourites/' + newFavouriteID, { "spot": spot.id })

                newID = fav.data.id

                props.addToFavourites(spot, {
                    isFavourite: true,
                    id: newID
                })
            }
        }

        catch (err) {
            const requestResponse = err.response
            return setMessage('Something went wrong. Server replied with "' + requestResponse.data + '".')
        }

        setMessage('')
        props.changeIsFavourite(spot, {
            isFavourite: !isFavourite,
            id: favouriteData.id || newID
        })
    }

    return (
           
        <InfoWindow  anchor = { props.markerMap[spot.id] } visible onCloseClick = { props.onInfoWindowCloseClick }>
            <MDBContainer style = { props.markerInfoWindowStyle } fluid className = 'text-primary'>
                <MDBRow className = 'h5 text-center d-flex justify-content-center'> { spot.country } </MDBRow>
                <hr />

                <SpotInfoContainer name = 'Name' value = { spot.name } />
                <br />

                <SpotInfoContainer name = 'Wind probability' value = { spot.probability ? spot.probability + '%' : 'Missing probability' } />
                <br />

                <SpotInfoContainer name = 'Latitude' value = { spot.lat } />
                <br />

                <SpotInfoContainer name = 'Longitude' value = { spot.long } />
                <br />

                <SpotInfoContainer name = 'When to go' value = { spot.month } />

                <hr />

                {
                    props.user == null ? null :
                    <MDBContainer className = 'd-flex justify-content-center'>
                        <Button onClick = { manageFavourites } className = 'bg-secondary'>
                            <MarkerFavouriteButton isFavourite = { isFavourite } />
                        </Button>
                    </MDBContainer>
                }

                {
                    message ? 
                        <>
                            <hr />
                            <MDBContainer className = 'alert alert-danger' >{ message }</MDBContainer>
                        </>
                    : null
                }

            </MDBContainer>
        </InfoWindow>

    )
}

const Markers = (props) => (
    props.spots.map((spot, index) => {
        return <Marker  key = { index }
                        onLoad = { marker => props.onMarkerLoad(marker, spot) }
                        onClick = {_ => props.onMarkerClick(spot) }
                        position = { props.coordsFromMarkerData(spot) } />
    })
)

const GoogleMap = props => {

    const allSpots = props.spots
    const [activeMarker, setActiveMarker] = useState(null)
    const [markerMap, setMarkerMap] = useState({})
    const [markerMapFavourites, setMarkerMapFavourites] = useState({})
    const [spots, setSpots] = useState(props.spots)
    const [filterOpened, setFilterOpened] = useState(false)

    useEffect(() => {
        setSpots(allSpots)
    }, [allSpots])

    const { favourites } = props
    const user = useLocalStorage('user')[0]

    const addToFavourites = (spot, newFavourite) => {
        setMarkerMapFavourites(prevState => {
            return { ...prevState, [spot.id]: newFavourite }
        })
    }

    const resetFilters = () => {
        setSpots(allSpots)
    }

    const customIcon = others => Object.assign({
        path: 'M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z',
        fillColor: '#34495e',
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 1,
        scale: 1,
    }, others)

    const newIcon = isFavourite => {
        let others

        if (isFavourite)
            others = {
                fillColor: 'yellow',
                strokeColor: 'black'
            }
        else
            others = {
                fillColor: 'red',
                strokeColor: 'white'
            }

        return customIcon(others)
    }

    const toggleFilter = () => {
        setFilterOpened(prevState => !prevState)
    }
    
    const changeFilterState = () => {
        setFilterOpened(prevState => !prevState)
    }

    const onMarkerClick = (marker) => {
        setActiveMarker(null)
        setActiveMarker(marker)
    }

    const onMarkerLoad = (marker, spot) => {

        const spotID = parseInt(spot.id)

        const favourite = favourites && user ? favourites.filter(elem => parseInt(elem.spot) === spotID) : []

        const isFavourite = favourite.length !== 0

        const favouriteData = {
            isFavourite: isFavourite,
            id: isFavourite ? favourite[0].id : null
        }

        marker.setIcon(newIcon(isFavourite))
        
        setMarkerMap(prevState => {
            return { ...prevState, [spot.id]: marker }
        })

        setMarkerMapFavourites(prevState => {
            return { ...prevState, [spot.id]: favouriteData }
        })
    }

    const changeFavourite = (spot, favouriteData) => {
        const isFavourite = favouriteData.isFavourite
        const newMarker = markerMap[spot.id]

        setMarkerMapFavourites(prevState => {
            return { ...prevState, [spot.id]: favouriteData }
        })

        newMarker.setIcon(newIcon(isFavourite))

        setMarkerMap(prevState => {
            return { ...prevState, [spot.id]: newMarker }
        })
    }

    const onInfoWindowCloseClick = e => {
        if (props.setCurrentSpot == null)
            return setActiveMarker(null)
        
        const latLng = e.latLng
        
        props.setCurrentSpot({
            lat: parseFloat(latLng.lat()),
            long: parseFloat(latLng.lng()),
            id: -1
        })
    }

    const coordsFromMarkerData = markerData => {
        return {
            lat: parseFloat(markerData.lat),
            lng: parseFloat(markerData.long)
        }
    }

    const MapMarkers = Markers({
        spots,
        coordsFromMarkerData,
        onMarkerClick,
        onMarkerLoad
    })

    const GoogleMapInstance = 
    (
        <GM onClick = { e => onInfoWindowCloseClick(e) }
            mapContainerStyle = { props.mapContainerStyle }
            zoom = { props.zoom }
            center = { props.center }>

            {
                props.showFilter ? 
                <MDBContainer onClick = { changeFilterState } className = 'filterIcon d-flex bg-secondary rounded'>
                    <Image src = { Filter } className = 'filterIconSize mt-1' />
                    <MDBContainer fluid className = 'h5 text-center mt-2 text-white'>Filter</MDBContainer>
                </MDBContainer>
                : null
            }
        
            { MapMarkers }

            {
                activeMarker ? 
                <MarkerInfoWindow 
                user = { user } markerInfoWindowStyle = { props.markerInfoWindowStyle } markerMap = { markerMap } markerMapFavourites = { markerMapFavourites }
                changeIsFavourite = { changeFavourite } activeMarker = { activeMarker } onInfoWindowCloseClick = { onInfoWindowCloseClick } addToFavourites = { addToFavourites }
                /> : null
            }
        </GM>
    )

    return (

        <>

            <FilterModal resetFilters = { resetFilters } spots = { spots } setSpots = { setSpots } isOpen = { filterOpened } toggle = { toggleFilter } />

        {
            props.withWrap ? 

            <LoadScript googleMapsApiKey = 'AIzaSyCAJ-0Vpt1GD14pIRtiNzTuby6fmEu1FYg'>
                { GoogleMapInstance }
            </LoadScript>

            : GoogleMapInstance

        }

        </>
    )
}



export default GoogleMap