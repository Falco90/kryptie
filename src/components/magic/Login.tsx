import { LoginProps } from '@/utils/types';
import EmailOTP from './auth/EmailOTP';

const Login = ({ token, setToken }: LoginProps) => {
  return (
    <div className="login-page">
      <div className="flex flex-col items-center gap-2 mb-10 mt-16">
        <h1 className="text-text-primary text-2xl font-bold mt-2">Magic + Particle</h1>
        <p className="text-text-muted text-sm font-mono">Login with email to upgrade your EOA to a Universal Account</p>
      </div>
      <div className="login-container">
        <EmailOTP token={token} setToken={setToken} />
      </div>

    </div>
  );
};

export default Login;

