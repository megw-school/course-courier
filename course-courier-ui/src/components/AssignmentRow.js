import React from 'react'

/**
 * Assignment Row
 * Used for assignment table in Import page.
 *
 * @param assignment assignment object
 * @returns {Element} assignment row
 * @constructor
 */
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