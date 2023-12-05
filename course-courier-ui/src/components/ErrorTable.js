import React from 'react'
import ErrorRow from './ErrorRow';

/**
 * Error Table
 * Used for building the error table in the Complete page.
 *
 * @param errors all errors to add to table
 * @returns {Element}
 * @constructor
 */
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
            {errors.map((err, i) => <ErrorRow err={err} key={i}/>)}
            </tbody>
        </table>
    )
}

export default ErrorTable;