'use client';
import { Client, ReadOnlyClient, StoryClient, StoryConfig, StoryReadOnlyConfig } from '@story-protocol/core-sdk';
import { useWalletClient } from 'wagmi';
import { custom, http } from 'viem';

type EthereumProvider = { request(): Promise<any> };

export function useStoryClient(): { client: ReadOnlyClient | Client } {
  const { data: walletClient } = useWalletClient();

  if (typeof window !== 'undefined' && window?.ethereum && walletClient) {
    const config: StoryConfig = {
      chain: undefined,
      transport: walletClient
        ? custom(window.ethereum as EthereumProvider)
        : http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL),
      account: walletClient!.account,
    };

    const client = StoryClient.newClient(config);

    return { client };
  }

  const readOnlyConfig: StoryReadOnlyConfig = {
    chain: undefined,
    transport: http(process.env.RPC_PROVIDER_URL),
  };
  const client = StoryClient.newReadOnlyClient(readOnlyConfig);

  return { client };
}
