import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import CheckboxTree from "react-checkbox-tree";
import {
    RiArrowDownDoubleLine,
    RiArrowDownSLine, RiArrowRightDoubleLine,
    RiArrowRightSLine,
    RiErrorWarningFill,
} from "react-icons/ri";


function ReviewPage({reviewData}) {
    const [expanded, setExpanded] = useState(reviewData.expanded);

    const navigate = useNavigate();
    const nextStep = (e) => {
        e.preventDefault();
        let msg = "Once you submit this form, you cannot make any changes. Continue?";
        if (window.confirm(msg) === true) {
            navigate('/complete');
        }
    };

    const prevStep = (e) => {
        e.preventDefault();
        navigate('/organize');
    };

    return (
        <div className='app-review'>
            <div className="app-header">
                <h1>Course Courier</h1>
            </div>
            <img className="step-display" src="/progress_review.png" alt="Progress - Review"/>
            <div className='content'>
                <div className='row'>
                    <div className="review-content-left">
                        <CheckboxTree
                            className='review-tree'
                            nodes={reviewData.workspace}
                            expanded={expanded}
                            onExpand={setExpanded}
                            disabled='true'
                            showExpandAll='true'
                            icons={{
                                check: null,
                                uncheck: null,
                                halfCheck: null,
                                expandClose: <RiArrowRightSLine/>,
                                expandOpen: <RiArrowDownSLine/>,
                                expandAll: <RiArrowRightDoubleLine/>,
                                collapseAll: <RiArrowDownDoubleLine/>,
                                parentClose: null,
                                parentOpen: null,
                                leaf: null
                            }}
                        />
                    </div>
                    <div className="review-content-right">
                        <h4>Review Your Assignment Organization</h4>
                        <p>
                            Take a moment to inspect the tree to ensure that assignment tasks are organized to your
                            preference. By clicking "Submit", you'll create the corresponding spaces, lists, tasks,
                            and tags in your Task Management software.
                        </p>
                        <br/>
                        <RiErrorWarningFill/>
                        <span> <strong> Please Note: After submitting, modifications won't be possible.</strong></span>
                    </div>
                </div>
                <br/>
                <br/>
                <div className = "button-group">
                    <button className='default-button' onClick={nextStep} title="Go to Complete"><span>Submit</span></button>
                    <button className='default-button' id="back-button" onClick={prevStep} title="Back to Organize"><span>Go Back</span></button>
                </div>
            </div>
        </div>
    )
}

export default ReviewPage;