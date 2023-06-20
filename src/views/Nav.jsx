import {googleConfig} from '../appConfig';

export default function Nav() {

  const redirectToLogin = () => {
    const endpoint = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    endpoint.searchParams.set('client_id', googleConfig.client_id);
    endpoint.searchParams.set('redirect_uri', 'http://localhost:5173/google');
    endpoint.searchParams.set('scope', 'email openid profile');
    endpoint.searchParams.set('response_type', 'code');
    endpoint.searchParams.set('access_type', 'offline');
    endpoint.searchParams.set('prompt', 'consent');
    endpoint.searchParams.set('state', '[csrf_token]');
    window.location.href = endpoint
  }

  return (
    <>
      <button onClick={redirectToLogin}>Google Login</button>
    </>
  )
}