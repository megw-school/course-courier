import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import AssignmentTable from "../components/AssignmentTable";
import downloadObjectAsJson, {formatCourseTree} from "../utils";
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
import Spinner from "react-bootstrap/Spinner"

/**
 * Import Page
 * Implements first step of Course Courier process. Allows user to import assignments from Canvas for a selected term.
 * Allows user to select specific courses/assignments to export.
 *
 * @param importData stores data imported from Canvas
 * @param setImportData set the importData state
 * @returns {Element} Import Page
 * @constructor
 */
function ImportPage({importData, setImportData}) {
    const [checked, setChecked] = useState(importData.courseTree.checked);
    const [expanded, setExpanded] = useState(importData.courseTree.expanded);
    const [selected_assignments, setSelectedAssignments] = useState(importData.assignments.selected);
    const [term, setTerm] = useState('F')
    const [year, setYear] = useState(new Date().getFullYear())
    const [spinner, setSpinner] = useState('none')

    /**
     * Get All Courses
     * Calls controller endpoint to get all courses from Canvas. Used for course tree.
     *
     * @returns {Promise<any>}
     */
    const getAllCourses = async () => {
        const response = await fetch(`/canvas-course-tree?term=${term + year.toString()}`);
        const data = await response.json();

        let msg = undefined
        if (response.status === 200) {
            console.log('Status ok')

        } else {
            console.log('Status bad')
            msg = `Authentication Error: Please update your Canvas credentials in Settings.`;
            alert(msg);
            return
        }

        return data;
    };

    /**
     * Get All Assignments
     * Calls controller endpoint to get all assignments for each course. Used for course tree.
     *
     * @returns {Promise<any>}
     */
    const getAllAssignments = async () => {
        console.log(term + year.toString());
        const response = await fetch(`/canvas-assignments?term=${term + year.toString()}`);
        const data = await response.json();

        let msg = undefined
        if (response.status === 200) {
            console.log('Status ok')

        } else {
            console.log('Status bad')
            msg = `Authentication Error: Please update your Canvas credentials in Settings.`;
            alert(msg);
            return
        }

        return data;
    };

    /**
     * Import Canvas Assignments
     * Build course tree by organizing courses and their assignments.
     *
     * @returns {Promise<void>}
     */
    const importCanvasAssignments = async () => {
        setSpinner('inline-block');
        const course_data = await getAllCourses();
        let all_expanded, all_checked, all_courses;
        [all_courses, all_expanded, all_checked] = formatCourseTree(course_data);

        const all_assignments = await getAllAssignments();
        setImportData(
            {
                courseTree: {checked: all_checked, expanded: all_expanded, courses: all_courses},
                assignments: {selected: all_assignments, all: all_assignments}
            }
        );
        setChecked(all_checked);
        setExpanded((all_expanded));
        setSelectedAssignments(all_assignments);
        setSpinner('none');
    };

    /**
     * Update Assignments
     * Update selected assignments based on tree selections.
     *
     * @param e DOM event
     */
    const updateAssignments = (e) => {
        setChecked(e);

        let newTable = [];
        for (let el of e) {
            let [course, assignment_type] = el.split('//');
            let temp = importData.assignments.all.filter(item => item.course.indexOf(course) !== -1 && item.type.indexOf(assignment_type) !== -1);
            newTable = newTable.concat(temp);
        }

        setSelectedAssignments(newTable)
        setChecked(e)
    };

    /**
     * Export Assignments
     * Export selected assignments to JSON file
     */
    const exportAssignments = () => {
        downloadObjectAsJson(selected_assignments, 'canvasAssignments')
    };

    /**
     * Next Step
     * Logic for navigating to next page: Organize.
     *
     */
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
                <p>Use the checkbox tree below to include or not include coursework based on the course and/or type.
                    Changes will reflect in the table below.</p>
                <strong>Select Term</strong>
                <div className="term-box">
                    <select onChange={e => setTerm(e.target.value)}>
                        <option value="F">Fall</option>
                        <option value="W">Winter</option>
                        <option value="S">Spring</option>
                        <option value="U">Summer</option>
                    </select>
                    <input type="number"
                           min="2000"
                           value={year}
                           onChange={e => setYear(e.target.value)}
                    />
                    <button className='default-button' onClick={importCanvasAssignments}>
                        <Spinner
                            style={{display: spinner}}
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        <span> Import</span>
                    </button>
                </div>

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
                    <button className='default-button' onClick={nextStep} title="Go to Organize">
                        <span> Save & Continue</span></button>
                    <button className='default-button' id="export-button" onClick={exportAssignments}>
                        <span>Export</span></button>
                </div>
            </div>
        </div>
    )
}

export default ImportPage;