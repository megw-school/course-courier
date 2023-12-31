import React from 'react';

/**
 * OAuth Credentials Form
 * Provides the form for providing Oauth Credentials.
 *
 * @param client_id
 * @param client_secret
 * @param setClientId
 * @param setClientSecret
 * @returns {Element}
 * @constructor
 */
function OAuthCredentialsForm({client_id, client_secret, setClientId, setClientSecret}) {
    return (
        <>
            <label className="label-col">Client ID</label>
            <input
                className='input-col'
                type="text"
                value={client_id}
                onChange={e => setClientId(e.target.value)}/>
            <label className="label-col">Client Secret</label>
            <input
                className='input-col'
                type="password"
                value={client_secret}
                onChange={e => setClientSecret(e.target.value)}/>
        </>
    );
}


export default OAuthCredentialsForm;