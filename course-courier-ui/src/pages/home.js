import { useNavigate, Link } from "react-router-dom";
import { formatCourseTree } from "../utils";

const term = "F2023";
function HomePage({setImportData}) {
    const navigate = useNavigate();

    // Remember to put async on this when it is time
    const getAllCourses = async () => {
        const response = await fetch(`/canvas-course-tree?term=${term}`);
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

    // Remember to put async on this when it is time
    const getAllAssignments = async () => {
        const response = await fetch(`/canvas-assignments?term=${term}`);
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

    const importCanvasAssignments = async () => {
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
                        </p>
                        <ol>
                            <li><b>Import</b>: We will guide you through importing tasks from Canvas for each of your courses. You can choose what courses and types of assignments you want to include.</li>
                            <li><b>Organize</b>: Seamlessly categorize your tasks so they are organized the way you want within your chosen task management tool.</li>
                            <li><b>Review</b>: Give everything a once-over to ensure it's set up to your liking.</li>
                            <li><b>Complete</b>: Voilà, you're all set! Head to your task management software and get working!</li>
                        </ol>
                    <p>
                        At the moment, Course Courier is optimized for integration with ClickUp. However, we're tirelessly working on adding more task management platforms to our repertoire. For those using other platforms, we offer the option to export Canvas data for easy import elsewhere.
                        <br/>
                        <br/>
                        Thank you for choosing Course Courier! More exciting features are on the horizon.
                    </p>
                </div>
                <div className="home-start">
                    <h4>Ready to get started?</h4>
                    <button onClick={importCanvasAssignments}><span>Let's Go!</span></button>
                    <br/>
                    <br/>
                    <br/>
                    <h4>First time here?</h4>
                    <p>No problem! Start by heading to <Link to="/settings">Settings</Link> and update your API tokens.</p>

                    <h4>Need help?</h4>
                    <p>Check out our step-by-step guide in the <Link to="/help">Help</Link> section.</p>
                </div>
            </div>
        </div>
    )
}

export default HomePage;