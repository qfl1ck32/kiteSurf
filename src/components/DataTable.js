import React from 'react'
import { MDBDataTable } from 'mdbreact'

import '../assets/css/dataTable.css'

function DataTable(props) {
    const data = props.data

    return (
        <MDBDataTable className = 'text-white w-100' bordered  data = { data } />
    )
}

export default DataTable