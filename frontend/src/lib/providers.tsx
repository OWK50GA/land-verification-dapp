"use client";
import React from "react";
import { sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  jsonRpcProvider,
  ready,
} from "@starknet-react/core";

function rpc() {
  return {
    nodeUrl:
      process.env.NEXT_PUBLIC_RPC_URL ||
      "https://rpc.starknet-testnet.lava.build/rpc/v0_9",
  };
}

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    recommended: [ready(), braavos()],
    includeRecommended: "always",
    order: "random",
  });
  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={jsonRpcProvider({ rpc })}
      connectors={connectors}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
