import React, {useState} from 'react';
import PersonalTokenForm from '../components/PersonalTokenForm';
import OAuthCredentialsForm from '../components/OAuthCredentialsForm';


function SettingsPage({settings, setSettings}) {
    const [canvas_auth, setCanvasAuth] = useState(settings.canvas_auth);
    const [canvas_token, setCanvasToken] = useState(settings.canvas_token);
    const [canvas_client_id, setCanvasClientID] = useState(settings.canvas_client_id);
    const [canvas_client_secret, setCanvasClientSecret] = useState(settings.canvas_client_secret);
    const [task_manager, setTaskManager] = useState(settings.task_manager);
    const [tm_auth, setTmAuth] = useState(settings.tm_auth);
    const [tm_token, setTmToken] = useState(settings.tm_token);
    const [tm_client_id, setTmClientID] = useState(settings.tm_client_id);
    const [tm_client_secret, setTmClientSecret] = useState(settings.tm_client_secret);

    // REST work
    const saveSettings = async (e) => {
        e.preventDefault();
        const newSettings = {
            canvas_auth:canvas_auth, canvas_token: canvas_token, canvas_client_id:canvas_client_id, canvas_client_secret:canvas_client_secret,
            task_manager: task_manager, tm_auth: tm_auth, tm_token:tm_token, tm_client_id: tm_client_id, tm_client_secret: tm_client_secret
        };
        setSettings(newSettings);

        const response_canvas = await fetch(`/credentials/canvas`, {
            method: 'PUT',
            body: JSON.stringify({
                token: canvas_token,
                client_id: canvas_client_id,
                client_secret: canvas_client_secret
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const response_tm = await fetch(`/credentials/${task_manager}`, {
            method: 'PUT',
            body: JSON.stringify({
                token: tm_token,
                client_id: tm_client_id,
                client_secret: tm_client_secret
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let msg =undefined
        // Check if request was successful
        if (response_canvas.status === 200 && response_tm.status === 200) {
            console.log('Status ok')
            msg = "Settings Saved!";
        } else if (response_canvas.status !== 200) {
            console.log('Status bad')
            msg = `Invalid credentials for Canvas`;
        } else {
            console.log('Status bad')
            msg = `Invalid credentials for ${task_manager}`;
        }

        alert(msg);
    };

    return (
        <div className='app-settings'>
            <div className="app-header">
                <h1>Course Courier</h1>
            </div>
            <div className='content'>
                <form>
                    <h3>Canvas</h3>
                    <h5>Authentication</h5>
                    <select value={canvas_auth} onChange={e => setCanvasAuth(e.target.value)}>
                        <option value="token">Personal Token</option>
                        <option value="oauth">OAuth Credentials</option>
                    </select>
                    <br/>
                    {canvas_auth==="token" && <PersonalTokenForm token={canvas_token} tokenChange={setCanvasToken}/>}
                    {canvas_auth==="oauth" && <OAuthCredentialsForm client_id={canvas_client_id} client_secret={canvas_client_secret} setClientId={setCanvasClientID} setClientSecret={setCanvasClientSecret}/>}

                    <h3>Task Manager</h3>
                    <select onChange={e => setTaskManager(e.target.value)}>
                        <option value="ClickUp">ClickUp</option>
                    </select>
                    <br/>
                    <h5>Authentication</h5>
                    <select value={tm_auth} onChange={e => setTmAuth(e.target.value)}>
                        <option value="token">Personal Token</option>
                        <option value="oauth">OAuth Credentials</option>
                    </select>
                    <br/>
                    {tm_auth==="token" && <PersonalTokenForm token={tm_token} tokenChange={setTmToken}/>}
                    {tm_auth==="oauth" && <OAuthCredentialsForm client_id={tm_client_id} client_secret={tm_client_secret} setClientId={setTmClientID} setClientSecret={setTmClientSecret}/>}

                </form>
                <br/>
                    <div className = "button-group"><button className='default-button' onClick={saveSettings} ><span>Save</span></button><div/>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage;
