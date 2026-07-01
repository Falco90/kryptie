import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmailOTP from '@/components/magic/auth/EmailOTP';

export default function Home() {
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token') ?? '');
  }, [setToken]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_60%)]" />
      <div className="relative w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <Badge className="w-fit bg-primary/10 text-primary border border-primary/20">
              Beta
            </Badge>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Crypto payment requests, simplified.
            </h1>
            <p className="text-muted-foreground text-lg">
              Send, request, and track USDC, USDT, ETH, and SOL payments with
              instant wallet-based authentication.
            </p>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• Email-based wallet login (Magic)</p>
            <p>• Smart account execution (Universal Account)</p>
            <p>• On-chain payment requests in seconds</p>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground pt-4">
            <span>Powered by Magic</span>
            <span>•</span>
            <span>Base</span>
            <span>•</span>
            <span>Ethereum</span>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
            <CardHeader className="space-y-1 px-6 pt-6 pb-2">
              <CardTitle>Welcome to Kryptie</CardTitle>
              <CardDescription>
                Sign in to continue to your dashboard
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 pt-0 px-6 pb-6">
              <EmailOTP token={token} setToken={setToken} />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
