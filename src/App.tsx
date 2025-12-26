import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { config } from "@/config/wagmi";
import { Dashboard } from "@/components/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider theme="midnight">
        <TooltipProvider>
          <Toaster />
          <Dashboard />
        </TooltipProvider>
      </ConnectKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
