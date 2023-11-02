import React from 'react'

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