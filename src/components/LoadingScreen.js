import React from 'react'

import { MDBJumbotron, MDBContainer } from 'mdbreact'
import { Spinner } from 'react-bootstrap'

function LoadingScreen() {

    return (
        <MDBJumbotron className = 'bg-primary text-center'>
            <MDBContainer fluid className = 'mb-2'>
                Please wait while we are loading the map...
            </MDBContainer>

            <Spinner animation = 'grow' variant = 'info'/>
        </MDBJumbotron>
    )
}

export default LoadingScreen