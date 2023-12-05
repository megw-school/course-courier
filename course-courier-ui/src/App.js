import './App.css';
import {Route, Routes} from 'react-router-dom';
import HomePage from './pages/home';
import HelpPage from './pages/help';
import SettingsPage from './pages/settings';
import ImportPage from "./pages/import";
import OrganizePage from "./pages/organize";
import ReviewPage from "./pages/review";
import CompletePage from "./pages/complete";
import React, {useState} from "react";

/**
 * Course Courier Application
 * Main part of application that handles calling other pages.
 *
 * @returns {Element}
 * @constructor
 */
function App() {
    // States we want to track across the application
    const [settings, setSettings] = useState({});
    const [importData, setImportData] = useState(
        {courseTree: {checked: [], expanded: [], courses: []},
            assignments: {selected: [], all: []}
        })
    const [configData, setConfigData] = useState(
        {workspace_name: 'default', space:'course', list:'type', tag:'none' , week_start: 'mon', includeStart:false, includeUrl:true}
        )
    const [reviewData, setReviewData] = useState({workspace: [], expanded: [], tasks: []})

    return (
        <div className="app">
                <Routes>
                    <Route path="/" element={<HomePage/>}></Route>
                    <Route path="/help" element={<HelpPage/>}></Route>
                    <Route path="/settings" element={<SettingsPage settings={settings} setSettings={setSettings}/>}></Route>
                    <Route path="/import" element={<ImportPage importData={importData} setImportData={setImportData}/> }></Route>
                    <Route path="/organize" element={<OrganizePage config={configData} setConfig={setConfigData}/>}></Route>
                    <Route path="/review" element={<ReviewPage assignments={importData.assignments.selected} config={configData} reviewData={reviewData} setReviewData={setReviewData}/>}></Route>
                    <Route path="/complete" element={<CompletePage assignments={importData.assignments.selected} config={configData}/>}></Route>
                </Routes>

            <footer className="app-footer">
                © 2023 Megan Wooley
            </footer>
        </div>
    );
}

export default App;
