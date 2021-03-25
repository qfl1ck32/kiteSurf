import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { Dropdown, Image } from 'react-bootstrap'

import User from '../assets/images/User.svg'

function ProfileDropdown(props) {

    const [redirect, setRedirect] = useState({
        shouldRedirect: false,
        to: ''
    })

    const authOnClick = e => {
        setRedirect({
            shouldRedirect: true,
            to: props.userID == null ? 'Login' : 'Logout'
        })
    }

    return redirect.shouldRedirect ? (<Redirect to = { '/' + redirect.to } />) :
    (
        <Dropdown>
            <Dropdown.Toggle variant = 'primary' id = 'dropdown'>
                <Image fluid width = { 16 } src = { User } />
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick = { authOnClick }>{ props.userID == null ? 'Login' : 'Logout' }</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}


export default ProfileDropdown