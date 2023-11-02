import React from 'react'
import ErrorRow from './ErrorRow';

function ErrorTable({errors}) {
    return (
        <table>
            <thead>
            <tr>
                <th>Space</th>
                <th>List</th>
                <th>Task</th>
                <th>Error</th>
            </tr>
            </thead>
            <tbody>
                {errors.map((err, i) => <ErrorRow err={err} key={i} />)}
            </tbody>
        </table>
    )
}

export default ErrorTable;