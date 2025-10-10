import jettonRegistryData from '../../public/jetton-registry.json';

export interface JettonRegistryEntry {
  verified: boolean;
  symbol: string;
  name: string;
  rateUsd: number;
  image?: string;
  decimals?: number;
  raw?: string;
  alias?: string;
}

export interface JettonRegistry {
  [address: string]: JettonRegistryEntry;
}

// Load the jetton registry data (excluding _meta)
export const jettonRegistry: JettonRegistry = Object.fromEntries(
  Object.entries(jettonRegistryData).filter(([key]) => key !== '_meta')
) as JettonRegistry;

/**
 * Get registry data for a jetton address
 * Supports both user-friendly and raw address formats
 */
export const getJettonRegistryData = (jettonAddress: string): JettonRegistryEntry | null => {
  // Try direct lookup first
  if (jettonRegistry[jettonAddress]) {
    return jettonRegistry[jettonAddress];
  }

  // Try to find by alias or raw address
  for (const [, data] of Object.entries(jettonRegistry)) {
    if (data.alias === jettonAddress || data.raw === jettonAddress) {
      return data;
    }
  }

  return null;
};

/**
 * Check if a jetton is verified in the registry
 */
export const isJettonVerified = (jettonAddress: string): boolean => {
  const registryData = getJettonRegistryData(jettonAddress);
  return registryData?.verified || false;
};

/**
 * Get USD price for a jetton
 */
export const getJettonUsdPrice = (jettonAddress: string): number => {
  const registryData = getJettonRegistryData(jettonAddress);
  return registryData?.rateUsd || 0;
};

/**
 * Get enhanced jetton data by combining on-chain and registry data
 */
export const enhanceJettonData = (jettonBalance: any, registryData?: JettonRegistryEntry) => {
  const jettonAddress = jettonBalance.jetton.address.toString();
  const registry = registryData || getJettonRegistryData(jettonAddress);
  
  return {
    ...jettonBalance,
    jetton: {
      ...jettonBalance.jetton,
      // Override with registry data if available
      name: registry?.name || jettonBalance.jetton.name,
      symbol: registry?.symbol || jettonBalance.jetton.symbol,
      image: registry?.image || jettonBalance.jetton.image,
      decimals: registry?.decimals || jettonBalance.jetton.decimals,
      // Add registry metadata
      verified: registry?.verified || false,
      rateUsd: registry?.rateUsd || 0,
    }
  };
};
