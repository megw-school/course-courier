import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import AssignmentTable from "../components/AssignmentTable";
import downloadObjectAsJson from "../utils";
import CheckboxTree from 'react-checkbox-tree';
import {
    RiArrowDownDoubleLine,
    RiArrowDownSLine,
    RiArrowRightDoubleLine,
    RiArrowRightSLine,
    RiCheckboxBlankLine,
    RiCheckboxFill,
    RiCheckboxIndeterminateLine,
} from "react-icons/ri";


function ImportPage({importData, setImportData}) {
    const [checked, setChecked] = useState(importData.courseTree.checked);
    const [expanded, setExpanded] = useState(importData.courseTree.expanded);
    const [selected_assignments, setSelectedAssignments] = useState(importData.assignments.selected);

    const updateAssignments = (e) => {
        setChecked(e);

        let newTable = [];
        for (let el of e) {
            let [course, assignment_type] = el.split('//');
            let temp = importData.assignments.all.filter(item => item.course.indexOf(course) !== -1 && item.type.indexOf(assignment_type) !== -1);
            newTable = newTable.concat(temp);
        }

        // setAssignments(newTable);
        setSelectedAssignments(newTable)
        setChecked(e)
    };

    const exportAssignments = () => {
        // downloadObjectAsJson(assignments, 'canvasAssignments');
        downloadObjectAsJson(selected_assignments, 'canvasAssignments')
    };

    const navigate = useNavigate();
    const nextStep = (e) => {
        e.preventDefault();
        setImportData(
            {
                courseTree: {checked: checked, expanded: expanded, courses: importData.courseTree.courses},
                assignments: {selected: selected_assignments, all: importData.assignments.all}
            }
        )
        navigate('/organize');
    };

    return (
        <div className='app-import'>
            <div className="app-header">
                <h1>Course Courier</h1>
            </div>
            <img className="step-display" src="/progress_import.png" alt="Progress - Import"/>
            <div className="content">
                <h3>Import Coursework</h3>
                <p>Use the checkbox tree below to include or not include coursework based on the course and/or type. Changes will reflect in the table below.</p>
                <br/>
                <div className='row'>
                    <div className="import-content-left">
                        <CheckboxTree
                            className='import-tree'
                            nodes={importData.courseTree.courses}
                            checked={checked}
                            expanded={expanded}
                            onCheck={e => updateAssignments(e)}
                            onExpand={setExpanded}
                            showExpandAll='true'
                            icons={{
                                check: <RiCheckboxFill/>,
                                uncheck: <RiCheckboxBlankLine/>,
                                halfCheck: <RiCheckboxIndeterminateLine/>,
                                expandClose: <RiArrowRightSLine/>,
                                expandOpen: <RiArrowDownSLine/>,
                                expandAll: <RiArrowRightDoubleLine/>,
                                collapseAll: <RiArrowDownDoubleLine/>,
                                parentClose: null,
                                parentOpen: null,
                                leaf: null
                            }}
                        />
                    </div>
                    <div className="import-content-right">
                        <AssignmentTable assignments={selected_assignments}></AssignmentTable>
                    </div>
                </div>
                <br/>
                <br/>
                <div className='button-group'>
                    <button className='default-button' onClick={nextStep} title="Go to Organize"><span> Save & Continue</span></button>
                    <button className='default-button' id="export-button" onClick={exportAssignments}><span>Export</span></button>
                </div>
            </div>
        </div>
    )
}

export default ImportPage;