import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import {
        MDBNavbar, MDBNavbarBrand,
        MDBNavbarNav, MDBCollapse, MDBNavbarToggler,
        MDBNavItem } from 'mdbreact'
import { Image, Button } from 'react-bootstrap'

import Kite from '../assets/images/Kite.svg'
import ProfileDropdown from './ProfileDropdown'
import useLocalStorage from '../services/useLocalStorage'

import AddSpotModal from './AddSpotModal'

function NavigationBar(props) {

    const user = useLocalStorage('user')[0]

    const [collapse, setCollapse] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const onClickToggler = () => {
        setCollapse(currentState => !currentState)
    }

    const openSpotModal = async () => {
        setIsOpen(true)
    }

    return (
        <>
            <AddSpotModal reloadData = { props.reloadData } isOpen = { isOpen } setIsOpen = { setIsOpen }/>

            <MDBNavbar className = 'mb-4' dark expand = 'md' scrolling>

                <MDBNavbarBrand>
                    <Image onClick = { () => { return <Redirect to = '/Dashboard' /> } } fluid width = { 64 } src = { Kite } className = 'border rounded' />
                </MDBNavbarBrand>

                <MDBNavbarToggler onClick = { onClickToggler } />

                <MDBCollapse isOpen = { collapse } navbar>
                    <MDBNavbarNav right>

                        { user && !props.isLoading &&
                            <MDBNavItem>
                                <Button onClick = { openSpotModal }>Add spot</Button>
                            </MDBNavItem>
                        }

                        <MDBNavItem>
                            <ProfileDropdown user = { user } />
                        </MDBNavItem>
                        
                    </MDBNavbarNav>
                </MDBCollapse>

            </MDBNavbar>
        </>
    )
}

export default NavigationBar