import React from 'react'
import { MDBContainer } from 'mdbreact'
import { Form } from 'react-bootstrap'

import '../assets/css/formField.css'

const FormField = (props) => (
    <Form.Group className = 'text-left'>
        <Form.Label className = 'text-white'>{ props.name + ':' }</Form.Label>

        <Form.Control 
            autoComplete = 'off'
            required
            type = { props.type }
            name = { props.fieldName }
            isValid = { !props.errors[props.fieldName] && (props.values[props.fieldName] || props.touched[props.fieldName]) }
            isInvalid = { props.errors[props.fieldName] && (props.values[props.fieldName] || props.touched[props.fieldName]) }
            onChange = { props.handleChange }
            value = { props.values[props.fieldName] }
            placeholder = { props.placeHolder }
            className = 'mb-1 rounded' />

        <MDBContainer className = { 'text-left alert alert-danger rounded ' + (props.errors[props.fieldName] && (props.values[props.fieldName] || props.touched[props.fieldName]) ? (props.values.fadeErrors ? 'fadeIn' : 'hidden') : 'd-none') }>
        
            { props.errors[props.fieldName] && (props.values[props.fieldName] || props.touched[props.fieldName]) ? props.errors[props.fieldName] : '' }
        
        </MDBContainer>

    </Form.Group>
)

export default function NewField(props) {
    return (
        <FormField 
            name = { props.name }
            fieldName = { props.fieldName }
            errors = { props.errors }
            values = { props.values }
            touched = { props.touched }
            handleChange = { props.handleChange }
            placeHolder = { props.placeHolder } 
            type = { props.type } />
    )
}