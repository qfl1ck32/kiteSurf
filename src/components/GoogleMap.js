import React, { useState, useCallback } from 'react'

import { MDBContainer, MDBRow } from 'mdbreact'


import { GoogleMap as GM, Marker, InfoWindow, LoadScript,  } from '@react-google-maps/api'

function MarkerInfoWindow(props) {
    const spot = props.activeMarker

    return spot ? (
        <InfoWindow  anchor = { props.markerMap[spot.id] } visible onCloseClick = { props.onInfoWindowCloseClick }>
            <MDBContainer style = { { width: '256px', height: 'auto' } } fluid className = 'text-primary'>
                <MDBRow className = 'h5 text-center d-flex justify-content-center'> { spot.country || 'Missing country' } </MDBRow>
                
                <br />

                <MDBRow className = 'h6'>Wind probability</MDBRow>
                <MDBRow className = 'ml-2 font-weight-bold'> { spot.probability ? spot.probability + '%' : 'Missing probability' } </MDBRow>

                <br />

                <MDBRow className = 'h6'>Latitude</MDBRow>
                <MDBRow className = 'ml-2 font-weight-bold'> { spot.lat } </MDBRow>

                <br />

                <MDBRow className = 'h6'>Longitude</MDBRow>
                <MDBRow className = 'ml-2 font-weight-bold'> { spot.long } </MDBRow>

                <br />

                <MDBRow className = 'h6'>When to go</MDBRow>
                <MDBRow className = 'ml-2 font-weight-bold'> { spot.month } </MDBRow>

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

    const onInfoWindowCloseClick = () => {
        setActiveMarker(null)
    }

    const { spots } = props

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

    return (
        <LoadScript googleMapsApiKey = 'AIzaSyCAJ-0Vpt1GD14pIRtiNzTuby6fmEu1FYg'>
            <GM onClick = { onInfoWindowCloseClick }
                onLoad = { onLoad }
                onUnmount = { onUnmount }
                mapContainerStyle = { props.mapContainerStyle }
                zoom = { props.defaultZoom }
                center = { props.defaultCenter }>
                
                { MapMarkers }

                <MarkerInfoWindow markerMap = { markerMap } activeMarker = { activeMarker } onInfoWindowCloseClick = { onInfoWindowCloseClick } />
            </GM>
        </LoadScript>
    )
}



export default GoogleMap