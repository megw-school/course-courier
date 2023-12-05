import React from 'react'

/**
 * Error Row
 * Used for building the error table on the Complete page.
 *
 * @param err task build error object
 * @returns {Element}
 * @constructor
 */
function ErrorRow({err}) {
    return (
        <>
            <tr>
                <td>{err.space}</td>
                <td>{err.list}</td>
                <td>{err.task}</td>
                <td>{err.msg}</td>
            </tr>
        </>
    )
}

export default ErrorRow;