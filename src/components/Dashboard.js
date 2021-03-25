import React, { useState } from 'react'

import { MDBContainer, MDBNavbar, MDBNavbarBrand,
         MDBNavbarNav, MDBCollapse, MDBNavbarToggler,
         MDBNavItem } from 'mdbreact'

import { Image, Button } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'
import '../assets/css/main.css'

import Kite from '../assets/images/Kite.svg'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // will use
// import { faUserCircle } from '@fortawesome/free-solid-svg-icons'

import ProfileDropdown from './ProfileDropdown'
import useLocalStorage from '../services/useLocalStorage'

function Dashboard(props) {

    const userID = useLocalStorage('userID')[0]

    const [collapse, setCollapse] = useState(false)

    const onClick = () => {
        setCollapse(currentState => !currentState)
    }

    return (
        <MDBContainer fluid className = 'main text-light'>
            <MDBNavbar dark expand = 'md' scrolling fixed = 'top'>

                <MDBNavbarBrand>
                    <Image fluid width = { 80 } src = { Kite } />
                </MDBNavbarBrand>

                <MDBNavbarToggler onClick = { onClick } />

                <MDBCollapse isOpen = { collapse } navbar>
                    <MDBNavbarNav right>

                        <MDBNavItem>
                            <Button>Add spot</Button>
                        </MDBNavItem>

                        <MDBNavItem>
                            <ProfileDropdown userID = { userID } />
                        </MDBNavItem>
                    </MDBNavbarNav>
                </MDBCollapse>

            </MDBNavbar>
        </MDBContainer>
    )
}

export default Dashboard