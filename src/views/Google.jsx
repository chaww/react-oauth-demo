import { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode';

export default function Google() {

  const [accessToken, setAccessToken] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const getAuthorizationData = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const authorizationData = {}

    for (const param of urlParams.entries()) {
      const [key, value] = param;
      authorizationData[key] = value
    }
    return authorizationData
  }

  const fetchAccessToken = (authorizationCode) => {

    if (!authorizationCode) return

    const tokenEndpoint = 'https://oauth2.googleapis.com/token'

    const requestBody = {
      client_id: '277508119822-7oggtss40ulq7l01ajr9kbkk2o2nag69.apps.googleusercontent.com',
      client_secret: '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',
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


  const logout = (accessToken) => {
    let endpoint = new URL("https://oauth2.googleapis.com/revoke");
    endpoint.searchParams.set("access_token", accessToken);
  }


  useEffect(() => {
    (async () => {
      const authorizationData = getAuthorizationData()
      localStorage.setItem('authorizationData', authorizationData)
      console.log('authorizationData', authorizationData)

      fetchAccessToken(authorizationData.code)
      const tokenData = await fetchAccessToken(authorizationData.code)
      console.log('tokenData', tokenData)

    })()

  }, [])





  return (
    <>
      <h2>Google Authorization Code</h2>
      <table>
        <tbody>
          {Object.keys(userInfo).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{`${userInfo[key]}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {userInfo.email && <button onClick={logout}>Logout</button>}
    </>
  )
}


/*

https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?operation=login&
state=google-%7Chttps%3A%2F%2Fiamgique.medium.com%2Foauth-2-0-%E0%B8%81%E0%B8%B1%E0%B8%9A-grant-types-%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87-6-e9c82ca978b%3Fsource%3Dlogin--------------------------global_nav-----------%7Clogin&
access_type=online&
client_id=216296035834-k1k6qe060s2tp2a2jam4ljdcms00sttg.apps.googleusercontent.com&
redirect_uri=https%3A%2F%2Fmedium.com%2Fm%2Fcallback%2Fgoogle&
response_type=id_token%20token&
scope=email%20openid%20profile&
nonce=4554c2334d19dc611e35fb6ba5be76246f1a1cbaa086b354b9aafac8464b3620&
service=lso&
o2v=1&
flowName=GeneralOAuthFlow

*/