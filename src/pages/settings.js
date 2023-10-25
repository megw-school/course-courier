import React, {useState, useEffect} from 'react';

function SettingsPage() {
    const [settings, setSettings] = useState([]);

    const loadSettings = async () => {
        const response = await fetch('/settings');
        const data = await response.json();
        setSettings(data);
    };
    
    useEffect(() => {
        loadSettings();
    }, []);

    const [canvas_token, setCanvasToken] = useState(settings.canvas_token);
    const [taskManager, setTaskManager] = useState(settings.tasKManager);
    const [tm_client_id, setTmClientID] = useState(settings.tm_client_id);
    const [tm_client_secret, setTmClientSecret] = useState(settings.tm_client_secret);

    // REST work
    const updateSettings = async (e) => {
        e.preventDefault();
        const newSettings = {canvas_token, taskManager, tm_client_id, tm_client_secret};
        const response = await fetch(`/settings`, {
            method: 'PUT', 
            body: JSON.stringify(newSettings),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // Check if request was successful
        let msg = undefined
        if (response.status === 200) {
            console.log('Status ok')
            console.log(response)
            msg = "Settings Saved!";
        } else {
            console.log('Status bad')
            msg = `Failed to save settings! Status code: ${response.status}`;
        }
        
        alert(msg);

    }

    return (
        <div className='app-settings'>
            <div className="app-header">
                <h1>Course Courier</h1>
            </div>
            <div className='settings-content'>
                <form>
                    <div>
                        <label className="label-col">Canvas Token</label>
                        <input
                        className='input-col'
                        type="text"
                        value={canvas_token}
                        onChange={e => setCanvasToken(e.target.value)}/>
                    </div>
                    <div>
                        <label className="label-col">Task Manager</label>
                        <select className='input-col' onChange={e => setTaskManager(e.target.value)}>
                            <option value="ClickUp">ClickUp</option>
                        </select>
                    </div>
                    <div>
                        <label className="label-col">Task Manager Client ID</label>
                        <input
                        className='input-col'
                        type="text"
                        value={tm_client_id}
                        onChange={e => setTmClientID(e.target.value)}/>
                    </div>
                    <div>
                        <label className="label-col">Task Manager Client Secret</label>
                        <input
                        className='input-col'
                        type="text"
                        value={tm_client_secret}
                        onChange={e => setTmClientSecret(e.target.value)}/>
                    </div>
                </form>
                <button onClick={updateSettings}>
                        Save
                </button>
            </div>
        </div>
    )
}

export default SettingsPage;
