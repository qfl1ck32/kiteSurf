import React, { useEffect, useState } from 'react'

import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact'
import { Button, Form } from 'react-bootstrap'

import GoogleMap from './GoogleMap'
import NewField from './FormField'

import * as Yup from 'yup'
import { useFormik } from 'formik'

import axios from 'axios'

const apiURL = require('../assets/apiURL.json').url

function AddSpotModal(props) {
    const [spot, setCurrentSpot] = useState({})
    const [showMissingSpotError, setShowMissingSpotError] = useState(false)
    const [messageAlert, setMessageAlert] = useState({
        show: false
    })

    useEffect(() => {
        setShowMissingSpotError(false)
    }, [spot])

    const addSpot = async () => {
        let newSpot
        
        try {
            newSpot = await axios.post(apiURL + 'spot')

            const newSpotID = newSpot.data.id

            await axios.put(apiURL + 'spot/' + newSpotID, { name: values.name, country: values.country, lat: spot.lat, long: spot.long, probability: parseInt(values.windProbability), month: values.highSeason })
        }

        catch (err) {
            const requestResponse = err.response

            return setMessageAlert({
                show: true,
                text: 'Something went wrong. Server replied with: "' + requestResponse.data + '".',
                type: 'danger'
            })
        }

        setMessageAlert({
            show: true,
            text: 'Successfully added a new spot - "' + values.name + '"!',
            type: 'success'
        })

        props.reloadData()
    }

    const center = {
        lat: 45.9443,
        lng: 25.0094
    }

    const mapContainerStyle = {
        width: '480px',
        height: '320px'
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('This field should not be empty.').min(2, 'This field should have a length of at least two characters.'),
        country: Yup.string().required('This field should not be empty.').min(2, 'This field should have a length of at least two characters.'),
        windProbability: Yup.number().required('This field should not be empty.').min(0, 'Probability should be positive.').max(100, 'Probability should be less than or equal to 100%.'),
        highSeason: Yup.string().required('This field should not be empty.').min(2, 'This field should have a length of at least two characters.'),
        startEndDate: Yup.date().required('This field should not be empty.')
    })

    const { errors, touched, values, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: {
            name: '',
            country: '',
            highSeason: '',
            windProbability: '',
            startEndDate: '',

            fadeErrors: true
        },

        onSubmit: addSpot,

        validationSchema
    })

    const newFieldSetup = (name, fieldName, placeholder, type) => {
        return {
            name: name,
            fieldName: fieldName,
            errors: errors,
            touched: touched,
            values: values,
            placeHolder: placeholder,
            type: type,
            handleChange: handleChange
          }
    }

    const handleSubmitFadeErrors = e => {
        handleSubmit(e)

        setShowMissingSpotError(Object.keys(spot).length === 0)

        setValues({...values, ...{'fadeErrors': false}})

        setTimeout(() => {
            setValues({...values, ...{'fadeErrors': true}})
        }, 0)
    }

    const name = NewField(newFieldSetup('Name', 'name', 'Romani', 'text'))
    const country = NewField(newFieldSetup('Country', 'country', 'Spain', 'text'))
    const highSeason = NewField(newFieldSetup('High season', 'highSeason', 'December - March', 'text'))
    const windProbability = NewField(newFieldSetup('Wind probability', 'windProbability', '93', 'text'))
    const startEndDate = NewField(newFieldSetup('Date', 'startEndDate', '', 'date'))

    return (
        <MDBModal isOpen = { props.isOpen } toggle = { () => props.setIsOpen(prevState => !prevState) } centered backdrop>
            <MDBModalHeader className = 'bg-primary'>Add new spot</MDBModalHeader>

            <MDBModalBody className = 'bg-primary'>
                <GoogleMap setCurrentSpot = { setCurrentSpot } withWrap = { false } center = { center } zoom = { 6 } spots = { [spot] } mapContainerStyle = { mapContainerStyle } />

                <MDBContainer className = { showMissingSpotError ? 'text-left alert alert-danger mt-2' : 'd-none' }>Setting a spot on the map is required.</MDBContainer>
                <hr />

                <Form className = 'text-center' noValidate onSubmit = { handleSubmitFadeErrors }>
                    { name }
                    { country }
                    { highSeason }
                    { windProbability }
                    { startEndDate }
                    
                    <MDBContainer className = { messageAlert.show ? ('alert alert-' + messageAlert.type) : 'd-none' }> { messageAlert.text } </MDBContainer>

                    <MDBModalFooter className = 'bg-primary'>
                        <Button onClick = {() => props.setIsOpen(false) } className = 'btn-sm bg-primary'>Cancel</Button>
                        <Button type = 'submit' className = 'btn-sm bg-success'>Confirm</Button>
                    </MDBModalFooter>
                </Form>
                
            </MDBModalBody>
            
        </MDBModal>
    )
}

export default AddSpotModal