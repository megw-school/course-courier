import React from 'react'

function AssignmentRow({assignment}) {
    return (
        <>
            <tr>
                <td>{assignment.course}</td>
                <td>{assignment.type}</td>
                <td>{assignment.name}</td>
                <td>{assignment.unlock_date}</td>
                <td>{assignment.due_date}</td>
            </tr>
        </>
    )
}

export default AssignmentRow;