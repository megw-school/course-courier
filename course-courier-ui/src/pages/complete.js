import React, {useEffect, useState} from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import ErrorTable from "../components/ErrorTable";

/**
 * Complete Page
 * This is the last step of the Course Courier process and calls for the creation of task. Status of the process is
 * shown as well as any errors at the end of the process.
 *
 * @param assignments selected assignments from previous steps
 * @param config organization of workspace from previous steps
 * @returns {Element} Complete Page
 * @constructor
 */
function CompletePage({assignments, config}) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const [errors, setErrors] = useState([{space: 'None', list: 'None', task: 'None', msg: 'None'}])
    let tempErrors = [];

    /**
     * Create Tasks
     * Calls to controller to create tasks. Updates progress in a progress bar and tracks any errors.
     *
     * @returns {Promise<void>}
     */
    const createTasks = async () => {
        if (progress < 100) {
            let space, list, tag, data;
            let oldProgress = 0.0;
            let cnt = 0

            // Create each assignment
            for (let assignment of assignments) {
                data = assignment;
                space = config.space === 'none' ? 'All Courses' : data[config.space];
                list = config.list === 'none' ? 'All Coursework' : data[config.list];
                tag = data[config.tag] === 'none' ? undefined : data[config.tag];

                let task = {
                    name: data.name,
                    due_date: data.due_date,
                    unlock_date: !config.includeStart ? undefined : data.unlock_date,
                    url: !config.includeUrl ? undefined : data.url,
                    tag: tag
                };

                let req_body = {
                    workspace: config.workspace_name,
                    space: space,
                    list: list,
                    task: task
                };

                console.log('Request body');
                console.log(req_body);
                const response = await fetch(`/clickup-task`, {
                    method: 'POST',
                    body: JSON.stringify(req_body),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                // Save any errors for error table
                let msg = await response.text();
                if (response.status !== 200) {
                    tempErrors.push({space: space, list: list, task: task.name, msg: msg});
                }

                // For progress bar
                cnt++;
                oldProgress = Math.floor(cnt / assignments.length * 100);
                setProgress(oldProgress);

                if (oldProgress < 10) {
                    setStatus('Creating Spaces');
                } else if (oldProgress < 20) {
                    setStatus('Creating Lists');
                } else if (oldProgress < 80) {
                    setStatus('Creating Tasks');
                } else {
                    setStatus('Finishing');
                }

            }

            // Complete, show finished and create error table
            setProgress(100);
            if (tempErrors.length > 0) {
                setStatus('Finished with issues. See below...');
                setErrors(tempErrors);
            } else {
                setStatus('Finished!');
            }
        }
    };

    useEffect(() => {
        createTasks();

    }, []);

    return (
        <div className='app-complete'>
            <div className="app-header">
                <h1>Course Courier</h1>
            </div>
            <img className="step-display" src="/progress_complete.png" alt="Progress - Complete"/>
            <div className="content">
                <ProgressBar now={progress} striped={progress < 100} label={`${progress}%`} animated={progress < 100}/>
                <br/>
                <h3 className="status">{status}</h3>
                <br/>
                <br/>
                <h4>Errors</h4>
                <ErrorTable errors={errors}></ErrorTable>
            </div>

        </div>
    )
}

export default CompletePage;