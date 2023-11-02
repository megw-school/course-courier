import React, {useEffect, useState} from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import ErrorTable from "../components/ErrorTable";

function CompletePage({tasks, assignments, config}) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const [errors, setErrors] = useState([{space:'None', list:'None', task:'None', msg:'None'}])

    let tempErrors = [];
    const createTasks = async () => {
        if (progress < 100) {
            let space, list, tag, data;
            let oldProgress = 0.0;
            let cnt = 0

            for (let idd of tasks) {
                data = assignments.filter(item => item.id === idd)[0];
                space = data[config.space];
                list = data[config.list];
                tag = data[config.tag] !== 'none' ? data[config.tag] : undefined;

                let task = {
                    name: data.name,
                    due_date: data.due_date,
                    unlock_date: data.unlock_date,
                    url: data.url,
                    tag: tag
                };

                if (!config.includeStart) {
                    task.unlock_date = undefined;
                }

                if (!config.includeUrl) {
                    task.url = undefined;
                }

                let output = {
                    workspace: config.workspace_name,
                    space: space,
                    list: list,
                    task: task
                };

                const response = await fetch(`/clickup-task`, {
                    method: 'POST',
                    body: JSON.stringify(output),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                let msg = await response.text();
                if (response.status !== 200) {
                    tempErrors.push({space:space, list:list, task:task.name, msg:msg});
                }

                cnt++;
                oldProgress = Math.floor(cnt / tasks.length * 100);
                setProgress(oldProgress);

                if (oldProgress < 30) {
                    setStatus('Creating Spaces');
                } else if (oldProgress < 60) {
                    setStatus('Creating Lists');
                }
                else if (oldProgress < 90) {
                    setStatus('Creating Tasks');
                } else {
                    setStatus('Finishing');
                }

            }

            setProgress(100);
            if (tempErrors.length > 0) {
                setStatus('Finished with issues. See below...');
                setErrors(tempErrors);
            } else {
                setStatus('Finished!');
            }
        }
    };

    useEffect( () => {
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