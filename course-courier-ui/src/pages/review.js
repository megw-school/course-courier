import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import CheckboxTree from "react-checkbox-tree";
import {
    RiArrowDownDoubleLine,
    RiArrowDownSLine,
    RiArrowRightDoubleLine,
    RiArrowRightSLine,
    RiErrorWarningFill,
} from "react-icons/ri";
import {formatReviewTree} from "../utils";

/**
 * Review Page
 * Provides user an opportunity to view how their tasks will be created in ClickUp.
 *
 * @param assignments selected assignments from Import step
 * @param config selected organization from Organize step
 * @param reviewData stores the task tree
 * @param setReviewData set the reviewData state
 * @returns {Element} Review Page
 * @constructor
 */
function ReviewPage({assignments, config, reviewData, setReviewData}) {
    const [expanded, setExpanded] = useState(reviewData.expanded);

    useEffect(() => {
        let workspace, expand_all, tasks;
        [workspace, expand_all, tasks] = formatReviewTree(assignments, config);
        setReviewData({workspace: workspace, expanded: expand_all, tasks: tasks});
        setExpanded(expand_all);
    }, []);

    /**
     * Next Step
     * Handles the logic of navigating to the next page: Complete
     *
     */
    const navigate = useNavigate();
    const nextStep = (e) => {
        e.preventDefault();
        let msg = "Once you submit this form, you cannot make any changes. Continue?";
        if (window.confirm(msg) === true) {
            navigate('/complete');
        }
    };

    /**
     * Previous Step
     * Handles the logic of navigating to the previous page: Organize
     *
     * @param e DOM event
     */
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
                <div className="button-group">
                    <button className='default-button' onClick={nextStep} title="Go to Complete"><span>Submit</span>
                    </button>
                    <button className='default-button' id="back-button" onClick={prevStep} title="Back to Organize">
                        <span>Go Back</span></button>
                </div>
            </div>
        </div>
    )
}

export default ReviewPage;