import { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode';
import { googleConfig } from '../appConfig';

export default function Google() {

  const [authorizationData, setAuthorizationData] = useState({});
  const [tokenData, setTokenData] = useState({});
  const [idTokenDecoded, setIdTokenDecoded] = useState({});
  const [tokenDataAfterRefresh, setTokenDataAfterRefresh] = useState({});

  const getAuthorizationData = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const authorizationData = {}

    for (const param of urlParams.entries()) {
      const [key, value] = param;
      authorizationData[key] = value
    }
    return authorizationData
  }

  const fetchToken = (authorizationCode) => {

    if (!authorizationCode) return

    const tokenEndpoint = 'https://oauth2.googleapis.com/token'

    const requestBody = {
      client_id: googleConfig.client_id,
      client_secret: googleConfig.client_secret,
      code: authorizationCode,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:5173/google',
    };

    return new Promise((resolve) => {
      fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(requestBody)
      })
        .then(response => response.json())
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          console.error('Error:', error);
        });
    })

  }


  const fetchRefreshToken = (data) => {

    const tokenEndpoint = 'https://oauth2.googleapis.com/token'

    const requestBody = {
      client_id: googleConfig.client_id,
      client_secret: googleConfig.client_secret,
      refresh_token: data.refresh_token,
      grant_type: 'refresh_token',

    };

    return new Promise((resolve) => {
      fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(requestBody)
      })
        .then(response => response.json())
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          console.error('Error:', error);
        });
    })
  }

  const revokeToken = (refreshToken) => {

    const endpoint = 'https://accounts.google.com/o/oauth2/revoke';

    const requestBody = {
      client_id: googleConfig.client_id,
      client_secret: googleConfig.client_secret,
      token: refreshToken,
    };

    return fetch(endpoint, {
      method: 'POST',
      body: new URLSearchParams(requestBody)
    })

  }


  useEffect(() => {
    (async () => {
      const authorizationData = getAuthorizationData()
      // localStorage.setItem('authorizationData', authorizationData)
      setAuthorizationData(authorizationData)
      console.log('authorizationData', authorizationData)

      const tokenData = await fetchToken(authorizationData.code)
      setTokenData(tokenData)
      console.log('tokenData', tokenData)

      const idTokenDecoded = jwtDecode(tokenData.id_token)
      setIdTokenDecoded(idTokenDecoded)
      console.log('id_token Decode', idTokenDecoded)

      await new Promise(resolve => setTimeout(resolve, 500));
      const tokenDataAfterRefresh = await fetchRefreshToken(tokenData)
      setTokenDataAfterRefresh(tokenDataAfterRefresh)
      console.log('tokenDataAfterRefresh', tokenDataAfterRefresh)

      await new Promise(resolve => setTimeout(resolve, 500));
      const revokeResponse = await revokeToken(tokenData.refresh_token)
      if (revokeResponse.ok) {
        console.log('Refresh token revoked successfully.');
      } else {
        console.error('Failed to revoke refresh token.');
      }

    })()

  }, [])


  return (
    <>
      <h3>Google authorizationData</h3>
      <table>
        <tbody>
          {Object.keys(authorizationData).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{`${authorizationData[key]}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Google tokenData</h3>
      <table>
        <tbody>
          {Object.keys(tokenData).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{`${tokenData[key]}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Google idTokenDecoded</h3>
      <table>
        <tbody>
          {Object.keys(idTokenDecoded).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{`${idTokenDecoded[key]}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Google tokenDataAfterRefresh</h3>
      <table>
        <tbody>
          {Object.keys(tokenDataAfterRefresh).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{`${tokenDataAfterRefresh[key]}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}