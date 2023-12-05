import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

/**
 * Organize Page
 * Handles second step of Course Courier process. Allows user to select workspace to create tasks in as well as how
 * they want to organize those tasks.
 *
 * @param config stores the organization selections made by the user
 * @param setConfig set the config state
 * @returns {Element} Organize Page
 * @constructor
 */
function OrganizePage({config, setConfig}) {
    const [workspaces, setWorkspaces] = useState([])
    const [workspace_name, setWorkspaceName] = useState(config.workspace_name);
    const [space, setSpace] = useState(config.space);
    const [list, setList] = useState(config.list);
    const [tag, setTag] = useState(config.tag);
    const [week_start, setWeekStart] = useState(config.week_start);
    const [include_start, setIncludeStart] = useState(config.includeStart);
    const [include_url, setIncludeUrl] = useState(config.includeUrl);

    /**
     * Next Step
     * Handles logic for navigating to the next page: Review.
     *
     */
    const navigate = useNavigate();
    const nextStep = () => {
        if (workspace_name === 'default') {
            alert("Please select a workspace!");
            return;
        }

        const newConfig = {
            workspace_name: workspace_name,
            space: space,
            list: list,
            tag: tag,
            week_start: week_start,
            includeStart: include_start,
            includeUrl: include_url
        };
        setConfig(newConfig);
        navigate('/review');
    };

    /**
     * Previous Step
     * Handles logic for navigating to the previous page: Import
     *
     */
    const prevStep = () => {
        let newConfig = {
            workspace_name: workspace_name,
            space: space,
            list: list,
            tag: tag,
            week_start: week_start,
            includeStart: include_start,
            includeUrl: include_url
        };
        setConfig(newConfig);

        navigate('/import');
    };

    /**
     * Load Workspaces
     * Calls controller endpoint to collect the user's ClickUp workspaces.
     *
     * @returns {Promise<void>}
     */
    const loadWorkspaces = async () => {
        const response = await fetch('/clickup-workspaces');
        const data = await response.json();
        setWorkspaces(data);
    };

    useEffect(() => {
        loadWorkspaces();
    }, []);

    return (
        <div className='app-organize'>
            <div className="app-header">
                <h1>Course Courier</h1>
            </div>
            <img className="step-display" src="/progress_organize.png" alt="Progress - Organize"/>
            <div className='content'>
                <h3>Organize Coursework</h3>
                <p>Choose a workspace and then adjust how coursework tasks will be grouped and labeled in that workspace
                    using the options below.</p>
                <br/>
                <form>
                    <div className="split-container">
                        <div className="row">
                            <div className="organize-content-left">
                                <label>Choose Workspace: </label>
                            </div>
                            <div className="organize-content-right">
                                <select value={workspace_name} onChange={e => setWorkspaceName(e.target.value)}>
                                    <option value='default'>Select Workspace</option>
                                    {workspaces.map((ws, i) => <option key={i} value={ws}>{ws}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="organize-content-left">
                                <label title="Workspace Children">Organize Spaces by: </label>
                            </div>
                            <div className="organize-content-right">
                                <select value={space} onChange={e => setSpace(e.target.value)}>
                                    <option value="course">Course</option>
                                    <option value="week">Week Available</option>
                                    <option value="type">Assignment Type</option>
                                    <option value="none">None</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="organize-content-left">
                                <label title="Space Children">Organize Lists by: </label>
                            </div>
                            <div className="organize-content-right">
                                <select value={list} onChange={e => setList(e.target.value)}>
                                    <option value="course">Course</option>
                                    <option value="week">Week Available</option>
                                    <option value="type">Assignment Type</option>
                                    <option value="none">None</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="organize-content-left">
                                <label title="Task Children">Organize Tags by: </label>
                            </div>
                            <div className="organize-content-right">
                                <select value={tag} onChange={e => setTag(e.target.value)}>
                                    <option value="course">Course</option>
                                    <option value="week">Week Available</option>
                                    <option value="type">Assignment Type</option>
                                    <option value="none">None</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="organize-content-left">
                                <label>Week Start</label>
                            </div>
                            <div className="organize-content-right">
                                <select value={week_start} onChange={e => setWeekStart(e.target.value)}>
                                    <option value="sun">Sunday</option>
                                    <option value="mon">Monday</option>
                                    <option value="tue">Tuesday</option>
                                    <option value="wed">Wednesday</option>
                                    <option value="thur">Thursday</option>
                                    <option value="fri">Friday</option>
                                    <option value="sat">Saturday</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="organize-content-left">
                                <label>Include</label>
                            </div>
                            <div className="organize-content-right">
                                <div title="Assignment Unlock Date">
                                    <input type="checkbox"
                                           checked={include_start}
                                           onChange={e => setIncludeStart(e.target.checked)}/>
                                    <label> Start Date</label>
                                </div>
                                <div title="Canvas Link to Assignment">
                                    <input type="checkbox"
                                           id="include-url-checkbox"
                                           checked={include_url}
                                           onChange={e => setIncludeUrl(e.target.checked)}/>
                                    <label> Assignment URL</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <br/>
                <br/>
                <div className="button-group">
                    <button className='default-button' onClick={nextStep} title="Go to Review">
                        <span>Save & Continue</span></button>
                    <button className='default-button' id="back-button" onClick={prevStep} title="Back to Import"><span>Go Back</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrganizePage;
