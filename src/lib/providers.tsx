"use client";
import React from "react";
import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, argent, braavos, useInjectedConnectors, jsonRpcProvider } from "@starknet-react/core";

function rpc() {
  return {
    nodeUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
  };
}

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });
  return (
    <StarknetConfig chains={[sepolia]} provider={jsonRpcProvider({ rpc })} connectors={connectors}>
      {children}
    </StarknetConfig>
  );
}
