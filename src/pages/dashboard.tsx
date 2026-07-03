import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUniversalAccount } from "@/hooks/UniversalAccountProvider";

type PaymentRequest = {
  id: string;
  amount: string;
  token: string;
  status: "PENDING" | "COMPLETED";
  recipient: string;
};

export default function Dashboard() {
  const router = useRouter();
  const { accountInfo } = useUniversalAccount();

  const [requests, setRequests] = useState<PaymentRequest[]>([]);

  useEffect(() => {
    const user =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!user) router.push("/");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const activeRequests = requests.filter((r) => r.status === "PENDING");
  const completedRequests = requests.filter((r) => r.status === "COMPLETED");

  return (
    <div className="min-h-screen bg-background px-6 py-10 space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your payment requests and wallet activity
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push("/payment-request/create")}
          >
            New Payment Request
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Outgoing Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active payment requests
              </p>
            ) : (
              activeRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between border border-border rounded-lg p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {req.amount} {req.token}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      To: {req.recipient}
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border border-primary/20">
                    Pending
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No completed requests
                </p>
              ) : (
                completedRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {req.amount} {req.token}
                    </span>

                    <Badge variant="secondary">Paid</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Wallet</CardTitle>
            </CardHeader>
            <CardContent className="text-xs font-mono text-muted-foreground break-all">
              {accountInfo?.evmSmartAccount || "—"}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
