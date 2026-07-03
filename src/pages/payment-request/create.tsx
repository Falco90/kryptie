import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { NETWORKS } from "@/lib/networks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function CreatePaymentRequestPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("base");
  const [asset, setAsset] = useState("USDC");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem('token') ?? '');
  }, [setToken]);

  const selectedNetwork = useMemo(() => {
    return NETWORKS.find((n) => n.id === network)!;
  }, [network]);

  useEffect(() => {
    if (!selectedNetwork.assets.includes(asset as any)) {
      setAsset(selectedNetwork.assets[0]);
    }
  }, [selectedNetwork, asset]);

  async function handleCreate() {
    setLoading(true);

    try {
      const response = await fetch("/api/payment-request/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          currency: asset,
          network,
          title,
          note,
        }),
      });

      console.log(response);
      const data = await response.json();

      router.push(`/payment-request/${data.publicId}/manage`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
            >
              ← Dashboard
            </Button>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Create Payment Request
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create a shareable crypto payment request.
            </p>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Configure the payment request.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-6">
              <div className="space-y-2">
                <Label>Network</Label>
                <Select
                  value={network}
                  onValueChange={setNetwork}
                >
                  <SelectTrigger className="h-11 bg-card border border-border rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-card border border-border rounded-lg shadow-lg p-1 overflow-hidden">
                    {NETWORKS.map((network) => (
                      <SelectItem
                        key={network.id}
                        value={network.id}
                        className="rounded-md px-3 py-2 outline-none focus:bg-muted"
                      >
                        {network.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Asset</Label>
                  <Select
                    value={asset}
                    onValueChange={setAsset}
                  >
                    <SelectTrigger className="h-11 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-card border border-border rounded-lg shadow-lg p-1 overflow-hidden">
                      {selectedNetwork.assets.map((asset) => (
                        <SelectItem
                          key={asset}
                          value={asset}
                          className="rounded-md px-3 py-2 outline-none focus:bg-muted"
                        >
                          {asset}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    className="h-11 bg-card"
                    placeholder="25.00"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  className="bg-card"
                  placeholder="Enter a title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Note</Label>
                <Textarea
                  className="bg-card min-h-[120px]"
                  placeholder="Optional message..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="w-full"
                disabled={!amount || loading}
                onClick={handleCreate}
              >
                {loading
                  ? "Creating Payment Request..."
                  : "Create Payment Request"}
              </Button>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 h-fit sticky top-8">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle>Recipient Preview</CardTitle>
              <CardDescription>
                This is what the recipient will see.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-6">
              <div>
                <div className="text-sm text-muted-foreground">
                  Title
                </div>
                <div className="mt-1 text-xl font-semibold">
                  {title || "Untitled Payment Request"}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">
                  Amount
                </div>
                <div className="mt-2 text-4xl font-bold">
                  {amount || "0.00"} {asset}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Network
                </div>
                <div className="mt-1 font-medium">
                  {selectedNetwork.name}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">
                  Note
                </div>
                <p className="mt-2 text-sm leading-relaxed">
                  {note || "No note added."}
                </p>
              </div>
              <Separator />
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                Share link and QR code will appear after creation.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
