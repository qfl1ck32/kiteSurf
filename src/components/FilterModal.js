import React from 'react'

import { MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact'
import { Button, Form } from 'react-bootstrap'

import NewField from './FormField'

import * as Yup from 'yup'
import { useFormik } from 'formik'

function FilterModal(props) {

    const currentSpots = props.spots

    const tryFilter = () => {
        const newSpots = currentSpots.filter(item => {
            return item.country.toLowerCase() === values.country.toLowerCase() || item.probability === parseInt(values.windProbability)
        })

        props.setSpots(newSpots)
    }

    const validationSchema = Yup.object({
        country: Yup.string(),
        windProbability: Yup.string()
    })

    const { errors, touched, values, handleChange, handleSubmit, setValues } = useFormik({
        initialValues: {
            country: '',
            windProbability: '',

            fadeErrors: true
        },

        onSubmit: tryFilter,

        validationSchema
    })

    const handleSubmitFadeErrors = e => {
        handleSubmit(e)

        setValues({...values, ...{'fadeErrors': false}})

        setTimeout(() => {
            setValues({...values, ...{'fadeErrors': true}})
        }, 0)
    }

    const newFieldSetup = (name, fieldName, placeholder, type) => {
        return {
            name: name,
            fieldName: fieldName,
            errors: errors,
            touched: touched,
            values: values,
            placeHolder: placeholder,
            type: type,
            handleChange
          }
    }

    const country = NewField(newFieldSetup('Country', 'country', 'Romania', 'text'))
    const windProbability = NewField(newFieldSetup('Wind probability', 'windProbability', '47', 'text'))

    return (
        <MDBModal size = 'sm'  isOpen = { props.isOpen } toggle = { props.toggle }>
            <MDBModalHeader className = 'bg-primary' toggle = { props.toggle }>
                Filter
            </MDBModalHeader>

            <MDBModalBody className = 'bg-primary'>
                <Form className = 'text-center' noValidate onSubmit = { handleSubmitFadeErrors }>
                    { country }
                    { windProbability }
                    <Button className = 'text-white bg-primary' type = 'submit'>Apply filter</Button> 
                </Form>
            </MDBModalBody>

            <MDBModalFooter className = 'd-flex justify-content-between bg-primary'>
                <Button className = 'text-white bg-primary btn-sm' onClick = { props.toggle }>Cancel</Button>
                <Button className = 'text-white bg-secondary btn-sm' onClick = { props.resetFilters }>Reset filters</Button>
            </MDBModalFooter>

        </MDBModal>
    )
}

export default FilterModal