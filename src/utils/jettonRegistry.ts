import { JettonBalance } from "@ton-api/client";

export interface JettonRegistryData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  image: string;
  verified: boolean;
  rateUsd: number;
}

export function getJettonRegistryData(_address: string): JettonRegistryData | null {
  return null;
}

export function enhanceJettonData(
  jetton: JettonBalance,
  _registryData?: JettonRegistryData
): JettonBalance & { jetton: typeof jetton.jetton & { verified?: boolean; description?: string } } {
  return {
    ...jetton,
    jetton: {
      ...jetton.jetton,
      verified: false,
      description: undefined,
    },
  };
}
