import React from 'react'
import AssignmentRow from './AssignmentRow';

function AssignmentTable({assignments}) {
    return (
        <table>
            <thead>
            <tr>
                <th>Course</th>
                <th>Type</th>
                <th>Assignment</th>
                <th>Unlock Date</th>
                <th>Due Date</th>
            </tr>
            </thead>
            <tbody>
                {assignments.map((assignment, i) => <AssignmentRow assignment={assignment} key={i} />)}
            </tbody>
        </table>
    )
}

export default AssignmentTable;