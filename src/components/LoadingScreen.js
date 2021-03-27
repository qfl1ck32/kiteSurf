import React from 'react'

import { MDBJumbotron, MDBContainer } from 'mdbreact'
import { Spinner } from 'react-bootstrap'

function LoadingScreen(props) {

    return (
        <MDBJumbotron className = 'bg-primary text-center'>
            <MDBContainer fluid className = 'mb-2'>
                { props.loadingMessage }
            </MDBContainer>

            <Spinner animation = 'grow' variant = 'info'/>
        </MDBJumbotron>
    )
}

export default LoadingScreen