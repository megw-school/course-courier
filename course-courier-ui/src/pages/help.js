import React from 'react';

/**
 * Help Page
 * Provides information on how to get credentials and why/how they are used.
 *
 * @returns {Element} Help Page
 * @constructor
 */
function HelpPage() {

    return (
        <div className='app-help'>
            <div className="app-header">
                <h1>Course Courier</h1>
            </div>
            <div className='content'>
                <h3>Help Page: Accessing and Setting Up API Credentials</h3>
                <h5>Overview</h5>
                <p>
                    To enable Course Courier to integrate with your Canvas courses and Task Management software, it is
                    essential to configure API credentials within the Settings. There are two methods to authenticate:
                    <ul>
                        <li>Manual Token Generation: Suitable for individual use.</li>
                        <li>OAuth Authorization Flow: Recommended for multi-user environments to comply with service
                            terms.
                        </li>
                    </ul>
                </p>
                <p>Choose the method based on your usage requirements.</p>
                <strong>
                    Important: For the security of your data, ensure that you never share your personal access tokens
                    and store them securely.
                </strong>
                <br/>
                <h5>Canvas API Authentication</h5>
                <p>
                    To access the Canvas API, you may either generate a personal access token manually or utilize the
                    OAuth authorization flow:
                    <ul>
                        <li>Manual Token: Follow <a
                            href="https://canvas.instructure.com/doc/api/file.oauth.html#manual-token-generation">Canvas'
                            guide</a> for personal use cases.
                        </li>
                        <li>OAuth Flow: Mandatory for applications serving multiple users to adhere to <a
                            href="https://www.instructure.com/policies/api-policy">Canvas' terms of service</a>.
                        </li>
                    </ul>
                </p>
                <p>Please consult the <a
                    href="https://canvas.instructure.com/doc/api/file.oauth.html#accessing-canvas-api">Canvas API
                    documentation</a> to select the appropriate method.</p>

                <p>By providing Canvas API authentication, you are agreeing to let this tool:
                    <ul>
                        <li>Read your Courses</li>
                        <li>Read your Assignments</li>
                    </ul>
                </p>
                <h5>ClickUp API Authentication</h5>
                <p>ClickUp API provides two options for generating an access token:
                    <ul>
                        <li>Manual Token: Generate a personal access token for individual setups.</li>
                        <li>OAuth Flow: Required for multi-user setups to ensure security and compliance.</li>
                    </ul>
                </p>
                <p>Refer to the <a href="https://clickup.com/api/#authentication">ClickUp API authentication</a> section
                    for detailed instructions on setting up your credentials correctly.</p>
                <p>By providing ClickUp API authentication, you are agreeing to let this tool:
                    <ul>
                        <li>Read your Workspaces</li>
                        <li>Create Spaces</li>
                        <li>Create Lists</li>
                        <li>Create Tasks</li>
                    </ul>
                </p>
            </div>
        </div>
    )
}

export default HelpPage;