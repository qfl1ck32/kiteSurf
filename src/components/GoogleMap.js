import React, { useState, useCallback } from 'react'

import { MDBContainer, MDBRow } from 'mdbreact'

import { GoogleMap as GM, Marker, InfoWindow, LoadScript,  } from '@react-google-maps/api'

const SpotInfoContainer = props => {
    return (
        <>
            <MDBRow className = 'h6'> { props.name } </MDBRow>
            <MDBRow className = 'ml-2 font-weight-bold'> { props.value } </MDBRow>
        </>
    )
}

function MarkerInfoWindow(props) {
    const spot = props.activeMarker

    return spot ? (
        <InfoWindow  anchor = { props.markerMap[spot.id] } visible onCloseClick = { props.onInfoWindowCloseClick }>
            <MDBContainer style = { props.markerInfoWindowStyle } fluid className = 'text-primary'>
                <MDBRow className = 'h5 text-center d-flex justify-content-center'> { spot.country || 'Missing country' } </MDBRow>
                <hr />

                <SpotInfoContainer name = 'Wind probability' value = { spot.probability ? spot.probability + '%' : 'Missing probability' } />
                <br />

                <SpotInfoContainer name = 'Latitude' value = { spot.lat } />
                <br />

                <SpotInfoContainer name = 'Longitude' value = { spot.long } />
                <br />

                <SpotInfoContainer name = 'When to go' value = { spot.month } />

            </MDBContainer>
        </InfoWindow>
    ) : null
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

    const { spots } = props

    const [map, setMap] = useState(null)

    const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds()
        map.fitBounds(bounds)
        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    const [activeMarker, setActiveMarker] = useState(null)
    const [markerMap, setMarkerMap] = useState({})

    const onMarkerClick = (marker) => {
        setActiveMarker(null)
        setActiveMarker(marker)
    }

    const onMarkerLoad = (marker, markerData) => {
        return setMarkerMap(prevState => {
            return { ...prevState, [markerData.id]: marker }
        })
    }

    const onInfoWindowCloseClick = e => {
        if (props.setCurrentSpot == null)
            return setActiveMarker(null)
        
        const latLng = e.latLng
        
        props.setCurrentSpot({
            lat: parseFloat(latLng.lat()),
            long: parseFloat(latLng.lng()),
            id: Math.floor(Math.random() * 10000)
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
            onLoad = { onLoad }
            onUnmount = { onUnmount }
            mapContainerStyle = { props.mapContainerStyle }
            zoom = { props.defaultZoom }
            center = { props.defaultCenter }>
            
            { MapMarkers }

            <MarkerInfoWindow markerInfoWindowStyle = { props.markerInfoWindowStyle } markerMap = { markerMap } activeMarker = { activeMarker } onInfoWindowCloseClick = { onInfoWindowCloseClick } />
        </GM>
    )

    return (
        props.withWrap ? 

        <LoadScript googleMapsApiKey = 'AIzaSyCAJ-0Vpt1GD14pIRtiNzTuby6fmEu1FYg'>
            { GoogleMapInstance }
        </LoadScript>

        : GoogleMapInstance
    )
}



export default GoogleMap