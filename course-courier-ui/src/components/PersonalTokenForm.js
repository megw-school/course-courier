import React from 'react';

function PersonalTokenForm({token, tokenChange}) {
    return (
        <>
            <label className="label-col">Personal Token</label>
            <input
                className='input-col'
                type="text"
                value={token}
                onChange={e => tokenChange(e.target.value)}/>
        </>
    );
}


export default PersonalTokenForm;