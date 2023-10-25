import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    const getStarted = () => {
        navigate('/import');
    };

    return (
        <div className='app-home'>
            <div className="app-header">
                <h1>Course Courier</h1>
                <h4> Easily transfer your coursework from Canvas straight to your favorite task manager.</h4>
            </div>
            <div className='home-content'>
                <div className="home-about">
                    <h4>About</h4>
                    <p>
                        Course Courier was born from a desire to help students effectively manage their academic workload. Our aim is to bridge the gap between your coursework on Canvas and the task management software you love and trust.
                        <br/>
                        <br/>
                        Here's how it works:
                        <ol>
                            <li><b>Import</b>: We will guide you through importing tasks from Canvas for each of your courses. You can choose what courses and types of assignments you want to include.</li>
                            <li><b>Organize</b>: Seamlessly categorize your tasks so they are organized the way you want within your chosen task management tool.</li>
                            <li><b>Review</b>: Give everything a once-over to ensure it's set up to your liking.</li>
                            <li><b>Complete</b>: Voilà, you're all set! Head to your task management software and get working!</li>
                        </ol>
                        At the moment, Course Courier is optimized for integration with ClickUp. However, we're tirelessly working on adding more task management platforms to our repertoire. For those using other platforms, we offer the option to export Canvas data for easy import elsewhere.
                        <br/>
                        <br/>
                        Thank you for choosing Course Courier! More exciting features are on the horizon.
                    </p>
                </div>
                <div className="home-start">
                    <h4>Ready to get started?</h4>
                    <button onClick={getStarted}><span>Let's Go!</span></button>
                    <br/>
                    <br/>
                    <br/>
                    <h4>First time here?</h4>
                    <p>No problem! Start by heading to <a href="/settings">Settings</a> and update your API tokens.</p>

                    <h4>Need help?</h4>
                    <p>Check out our step-by-step guide in the <a href="/help">Help</a> section.</p>
                </div>
            </div>
        </div>
    )
}

export default HomePage;