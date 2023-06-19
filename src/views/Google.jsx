import { useEffect, useState } from 'react'

export default function Google() {

  const [accessToken, setAccessToken] = useState("");
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fragment = window.location.hash;
    const cleanFragment = fragment.slice(1);
    const urlParams = new URLSearchParams(cleanFragment);

    const hashData = {}

    for (const param of urlParams.entries()) {
      const [key, value] = param;
      hashData[key] = value
    }

    if (hashData.access_token) {
      console.log("access_token = " + hashData.access_token)
      setAccessToken(hashData.access_token)

      let endpoint = new URL("https://www.googleapis.com/oauth2/v3/userinfo");
      endpoint.searchParams.set("access_token", hashData.access_token);
      fetch(endpoint).then(resp => resp.json()).then((respData) => {
        if (respData.email) {
          setUserInfo(respData)
        }
      })

    } else return
  }, [])

  return (
    <>
      <h2>Google User Info</h2>
      <table>
        <tbody>
          <tr>
            <td>access_token</td>
            <td>{accessToken}</td>
          </tr>
          {Object.keys(userInfo).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{`${userInfo[key]}`}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </>
  )
}