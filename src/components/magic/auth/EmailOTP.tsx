import { useMagic } from '@/hooks/MagicProvider';
import showToast from '@/utils/showToast';
import { MagicRPCError, RPCErrorCode } from 'magic-sdk';
import { LoginProps } from '@/utils/types';
import { saveUserInfo } from '@/utils/common';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";

const EmailOTP = ({ token, setToken }: LoginProps) => {
  const { magic } = useMagic();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);

  const handleLogin = async () => {
    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setEmailError(true);
    } else {
      try {
        setLoginInProgress(true);
        setEmailError(false);
        const token = await magic?.auth.loginWithEmailOTP({ email });
        // Rehydrates the user session whenever getInfo is invoked
        const metadata = await magic?.user.getInfo();

        const publicAddress = metadata?.wallets?.ethereum?.publicAddress;
        if (!token || !publicAddress) {
          throw new Error('Magic login failed');
        }

        setToken(token);
        saveUserInfo(token, 'EMAIL', publicAddress);
        setEmail('');
      } catch (e) {
        console.error('login error:', e);
        if (e instanceof MagicRPCError) {
          switch (e.code) {
            case RPCErrorCode.MagicLinkFailedVerification:
            case RPCErrorCode.MagicLinkExpired:
            case RPCErrorCode.MagicLinkRateLimited:
            case RPCErrorCode.UserAlreadyLoggedIn:
              showToast({ message: e.message, type: 'error' });
              break;
            default:
              showToast({
                message: 'Something went wrong. Please try again',
                type: 'error',
              });
          }
        }
      } finally {
        setLoginInProgress(false);
      }
    }
  };

  return (
    <div className="space-y-5">

      {/* Subtle helper text (no big header anymore) */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Enter your email to receive a secure login code
        </p>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <Input
          type="email"
          value={email}
          placeholder="you@domain.com"
          autoComplete="email"
          className="h-11"
          onChange={(e) => {
            if (emailError) setEmailError(false);
            setEmail(e.target.value);
          }}
        />

        {emailError && (
          <p className="text-sm text-destructive">
            Please enter a valid email address
          </p>
        )}
      </div>

      {/* Button */}
      <Button
        className="w-full h-11 font-medium"
        disabled={
          isLoginInProgress ||
          (token.length > 0 ? false : email.length === 0)
        }
        onClick={handleLogin}
      >
        {isLoginInProgress ? "Sending code..." : "Continue with email"}
      </Button>

      {/* Footer hint */}
      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        By continuing, you agree to receive a one-time login code from Kryptie.
      </p>
    </div>
  );
};

export default EmailOTP;

