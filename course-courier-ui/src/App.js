import './App.css';
import {Route, Routes} from 'react-router-dom';
import HomePage from './pages/home';
import HelpPage from './pages/help';
import SettingsPage from './pages/settings';
import ImportPage from "./pages/import";
import OrganizePage from "./pages/organize";
import ReviewPage from "./pages/review";
import CompletePage from "./pages/complete";
import React, {useEffect, useState} from "react";


function App() {
    const [settings, setSettings] = useState({});
    const [importData, setImportData] = useState(
        {courseTree: {checked: [], expanded: [], courses: []},
            assignments: {selected: [], all: []}
        })
    const [workspaces, setWorkspaces] = useState([])
    const [configData, setConfigData] = useState(
        {workspace_name: 'default', space:'course', list:'type', tag:'none' , week_start: 'mon', includeStart:false, includeUrl:true}
        )
    const [reviewData, setReviewData] = useState({workspace: [], expanded: [], tasks: []})

    const loadWorkspaces = async () => {
        const response = await fetch('/clickup-workspaces');
        const data = await response.json();
        setWorkspaces(data);
    };

    const loadSettings = async () => {
        const response_canvas = await fetch('/credentials/canvas');
        const canvas_auth = await response_canvas.json();

        const response_tm = await fetch('/credentials/clickup');
        const tm_auth = await response_tm.json();

        const data = {
            canvas_auth:'oauth', canvas_token: canvas_auth.token, canvas_client_id: canvas_auth.client_id, canvas_client_secret: canvas_auth.client_secret,
            task_manager: 'ClickUp', tm_auth: 'oauth', tm_token: tm_auth.token, tm_client_id: tm_auth.client_id, tm_client_secret: tm_auth.client_secret
        };

        if (data.canvas_token !== '' && data.canvas_client_id === '') {
            data.canvas_auth = 'token'
        }

        if (data.tm_token !== '' && data.tm_client_id === '') {
            data.tm_auth = 'token'
        }

        setSettings(data);
    };

    useEffect( () => {
        loadSettings();
        loadWorkspaces();
    }, []);

    // useEffect(() => {
    //     console.log(prev_loc);
    //     console.log(location);
    //     if (!isSaved) {
    //         let msg = "Once you submit this form, you cannot make any changes. Continue?";
    //         if (window.confirm(msg) === true) {
    //             setIsSaved(true);
    //         } else {
    //             navigate(prev_loc);
    //             return;
    //         }
    //     }
    //
    //     prev_loc = location;
    //
    // }, [location]);

    return (
        <div className="app">
                <Routes>
                    <Route path="/" element={<HomePage setImportData={setImportData}/>}></Route>
                    <Route path="/help" element={<HelpPage/>}></Route>
                    <Route path="/settings" element={<SettingsPage settings={settings} setSettings={setSettings}/>}></Route>
                    <Route path="/import" element={<ImportPage importData={importData} setImportData={setImportData}/> }></Route>
                    <Route path="/organize" element={<OrganizePage config={configData} setConfig={setConfigData} workspaces={workspaces} assignments={importData.assignments.selected} setReviewData={setReviewData}/>}></Route>
                    <Route path="/review" element={<ReviewPage reviewData={reviewData}/>}></Route>
                    <Route path="/complete" element={<CompletePage tasks={reviewData.tasks} assignments={importData.assignments.selected} config={configData}/>}></Route>
                </Routes>

            <footer className="app-footer">
                © 2023 Megan Wooley
            </footer>
        </div>
    );
}

export default App;
