import React from 'react';

/**
 * Personal Token Form
 * Provides the form for entering Personal Token information
 * @param token
 * @param tokenChange
 * @returns {Element}
 * @constructor
 */
function PersonalTokenForm({token, tokenChange}) {
    return (
        <>
            <label className="label-col">Personal Token</label>
            <input
                className='input-col'
                type="password"
                value={token}
                onChange={e => tokenChange(e.target.value)}/>
        </>
    );
}


export default PersonalTokenForm;