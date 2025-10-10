import { useState, useEffect, useMemo } from 'react';
import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Address, toNano } from "@ton/core";
import { 
  Download, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Shield,
  Zap,
  Globe,
  Star,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  PlusCircle,
  Wallet,
  X
} from 'lucide-react';
import { JettonBalance } from "@ton-api/client";
import { SendJettonModal } from "./SendJettonModal";
import { JettonDetailModal } from "./JettonDetailModal";
import { isValidAddress } from '../utility/address';
import { formatTonValue, formatTokenAmount } from "../utility/format";
import { toDecimals } from "../utility/decimals";
import ta from "../utility/tonapi";
import { getJettonRegistryData, enhanceJettonData } from "../utils/jettonRegistry";


const TonWallet = () => {
  // Simplified single-view wallet UI
  const [tonBalance, setTonBalance] = useState<string>("0.00");
  const [jettons, setJettons] = useState<JettonBalance[]>([]);
  const [selectedJetton, setSelectedJetton] = useState<JettonBalance | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isJettonDetailOpen, setIsJettonDetailOpen] = useState(false);
  const [isLoadingTON, setIsLoadingTON] = useState(true);
  const [isLoadingJettons, setIsLoadingJettons] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);
  // Removed search/filter for compact UI
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [tonUsdPrice, setTonUsdPrice] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const connectedAddressString = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const connectedAddress = useMemo(() => {
    return isValidAddress(connectedAddressString)
      ? Address.parse(connectedAddressString)
      : null;
  }, [connectedAddressString]);

  // Fetch TON balance
  useEffect(() => {
    if (!connectedAddress) {
      setTonBalance("0.00");
      setIsLoadingTON(false);
      return;
    }

    setIsLoadingTON(true);
    ta.accounts
      .getAccount(connectedAddress)
      .then((info) => {
        const balance = formatTonValue(info.balance.toString());
        setTonBalance(balance);
      })
      .catch((e) => {
        console.error("Failed to fetch TON balance:", e);
        setTonBalance("0.00");
      })
      .finally(() => {
        setIsLoadingTON(false);
      });
  }, [connectedAddress]);

  // Fetch jettons
  useEffect(() => {
    if (!connectedAddress) {
      setJettons([]);
      return;
    }

    setIsLoadingJettons(true);
    ta.accounts.getAccountJettonsBalances(connectedAddress)
      .then(balanceInfo => {
        setJettons(balanceInfo.balances || []);
      })
      .catch(error => {
        console.error('Error loading jettons:', error);
        setJettons([]);
      })
      .finally(() => {
        setIsLoadingJettons(false);
      });
  }, [connectedAddress]);

  // Fetch TON -> USD price
  useEffect(() => {
    let isCancelled = false;
    const fetchPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
        if (!res.ok) return;
        const data = await res.json();
        const price = data?.['the-open-network']?.usd ?? 0;
        if (!isCancelled) setTonUsdPrice(Number(price) || 0);
      } catch (_) {
        // ignore
      }
    };
    fetchPrice();
    const id = setInterval(fetchPrice, 60_000);
    return () => { isCancelled = true; clearInterval(id); };
  }, []);

  // Calculate portfolio value (TON + verified jettons, USD)
  useEffect(() => {
    const tonAmount = parseFloat(tonBalance || '0');
    let totalValue = tonAmount * tonUsdPrice;
    
    // Add verified jetton values
    jettons.forEach(jetton => {
      const registryData = getJettonRegistryData(jetton.jetton.address.toString());
      if (registryData?.verified && registryData.rateUsd > 0) {
        const jettonAmount = parseFloat(toDecimals(jetton.balance, jetton.jetton.decimals));
        totalValue += jettonAmount * registryData.rateUsd;
      }
    });
    
    setPortfolioValue(totalValue);
  }, [tonBalance, tonUsdPrice, jettons]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh TON balance
      if (connectedAddress) {
        const info = await ta.accounts.getAccount(connectedAddress);
        setTonBalance(formatTonValue(info.balance.toString()));
      }
      
      // Refresh jettons
      if (connectedAddress) {
        const balanceInfo = await ta.accounts.getAccountJettonsBalances(connectedAddress);
        setJettons(balanceInfo.balances || []);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyAddress = async () => {
    if (!connectedAddressString) return;
    
    try {
      await navigator.clipboard.writeText(connectedAddressString);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleJettonClick = (jetton: JettonBalance) => {
    setSelectedJetton(jetton);
    setIsJettonDetailOpen(true);
  };

  const handleReceiveFromDetail = () => {
    setIsReceiveModalOpen(true);
  };

  // Directly show all jettons in list
  const allJettons = jettons;

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string, hide: boolean = false) => {
    if (hide) return '••••••';
    if (balance.startsWith('$')) return balance;
    const [i, f = ''] = balance.split('.');
    const reconstructed = BigInt(i + (f ? f : ''));
    const decimals = f.length;
    return formatTokenAmount(reconstructed, decimals, { maxDecimals: 6, trimInsignificant: true, smartCompactWords: true });
  };

  if (!connectedAddress) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-6">Connect your TON wallet to manage your digital assets</p>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <TonConnectButton className="relative !min-h-[48px] !px-6 !py-3" />
            </div>
          </div>

          {/* Features */}
          <div className="p-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Wallet Features</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Secure", desc: "Your keys, your crypto" },
                { icon: Zap, title: "Fast", desc: "Lightning quick" },
                { icon: Globe, title: "Multi-chain", desc: "TON ecosystem" },
                { icon: Star, title: "Jettons", desc: "Token management" }
              ].map((feature, index) => (
                <div key={index} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                  <feature.icon className="w-6 h-6 text-blue-400 mb-2" />
                  <h4 className="text-sm font-medium text-white">{feature.title}</h4>
                  <p className="text-xs text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-2">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Top Header and Balance */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-300">TAPPs Wallet</h2>
              <div className="mt-2 text-4xl font-bold text-white">
                {formatBalance(`$${portfolioValue.toFixed(2)}`, hideBalances)}
              </div>
              <p className="mt-1 text-sm text-slate-400">{formatAddress(connectedAddressString)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHideBalances(!hideBalances)}
                className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
                title={hideBalances ? 'Show balances' : 'Hide balances'}
              >
                {hideBalances ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => window.open('https://tonkeeper.com', '_blank')}
              className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-300 hover:bg-slate-700/60 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-xs">Buy</span>
            </button>
            <button
              onClick={() => setIsSendModalOpen(true)}
              className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-300 hover:bg-slate-700/60 transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
              <span className="text-xs">Send</span>
            </button>
            <button
              onClick={() => setIsReceiveModalOpen(true)}
              className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-300 hover:bg-slate-700/60 transition-colors"
            >
              <ArrowDownLeft className="w-5 h-5" />
              <span className="text-xs">Receive</span>
            </button>
            <button
              onClick={() => window.open('https://dedust.io', '_blank')}
              className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-300 hover:bg-slate-700/60 transition-colors"
            >
              <ArrowLeftRight className="w-5 h-5" />
              <span className="text-xs">Swap</span>
            </button>
          </div>
        </div>

        {/* Assets List */}
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {/* TON Row */}
            <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">TON</h4>
                  <p className="text-xs text-slate-400">$ {(tonUsdPrice || 0).toFixed(2)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  {isLoadingTON ? '...' : formatBalance(tonBalance, hideBalances)}
                </div>
                <p className="text-xs text-slate-400">${(parseFloat(tonBalance || '0') * (tonUsdPrice || 0)).toFixed(2)}</p>
              </div>
            </div>

            {/* Jettons */}
            {isLoadingJettons ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 animate-pulse">
                    <div className="h-5 w-28 bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 w-16 bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              allJettons.map((jetton) => {
                const registryData = getJettonRegistryData(jetton.jetton.address.toString());
                const enhancedJetton = enhanceJettonData(jetton, registryData || undefined);
                const jettonAmount = parseFloat(toDecimals(jetton.balance, jetton.jetton.decimals));
                const usdValue = registryData?.verified && registryData.rateUsd > 0 
                  ? jettonAmount * registryData.rateUsd 
                  : 0;

                return (
                  <button
                    key={jetton.jetton.address.toString()}
                    onClick={() => handleJettonClick(jetton)}
                    className="w-full flex items-center justify-between p-4 bg-slate-800/60 rounded-xl border border-slate-700 hover:border-slate-600 hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center overflow-hidden">
                        {enhancedJetton.jetton.image ? (
                          <img
                            src={enhancedJetton.jetton.image}
                            alt={enhancedJetton.jetton.name}
                            className="w-8 h-8 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://via.placeholder.com/32/6366f1/ffffff?text=${enhancedJetton.jetton.symbol?.[0] || '?'}`
                            }}
                          />
                        ) : (
                          <span className="text-white font-bold">{enhancedJetton.jetton.symbol?.[0] || '?'}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium">{enhancedJetton.jetton.name}</h4>
                          {enhancedJetton.jetton.verified && (
                            <Shield className="w-3 h-3 text-green-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {enhancedJetton.jetton.verified ? 
                            `Verified • $${(registryData?.rateUsd || 0).toFixed(6)}` : 
                            'Unverified Token'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {formatBalance(toDecimals(jetton.balance, jetton.jetton.decimals), hideBalances)}
                      </div>
                      <p className="text-xs text-slate-400">
                        ${usdValue.toFixed(2)}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Send TON Modal */}
      {isSendModalOpen && connectedAddress && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsSendModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 rounded-2xl max-w-md w-full overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Send TON</h2>
                    <p className="text-sm text-slate-400">Available: {tonBalance} TON</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSendModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const address = (form.elements.namedItem('address') as HTMLInputElement).value;
              const amount = (form.elements.namedItem('amount') as HTMLInputElement).value;
              
              try {
                const transaction = {
                  validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
                  messages: [
                    {
                      address: address,
                      amount: toNano(amount).toString(),
                    },
                  ],
                };

                await tonConnectUI.sendTransaction(transaction);
                setIsSendModalOpen(false);
              } catch (error) {
                console.error('Failed to send TON:', error);
              }
            }}>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm text-slate-300 mb-2 font-medium">
                    Recipient Address
                  </label>
                  <input
                    name="address"
                    type="text"
                    placeholder="Enter TON address"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2 font-medium">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      name="amount"
                      type="number"
                      step="0.000000001"
                      min="0"
                      placeholder="0.0"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.querySelector('input[name="amount"]') as HTMLInputElement;
                          input.value = tonBalance;
                        }}
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium px-2 py-1 bg-blue-500/10 rounded-md hover:bg-blue-500/20 transition-all"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-700 bg-slate-800/70">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsSendModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-slate-600 rounded-xl text-slate-300 hover:bg-slate-700 transition-all duration-300 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 rounded-xl text-white text-sm font-medium flex items-center justify-center space-x-2 transition-all duration-300"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Send TON</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jetton Detail Modal */}
      {selectedJetton && isJettonDetailOpen && (
        <JettonDetailModal
          jetton={selectedJetton}
          onClose={() => {
            setIsJettonDetailOpen(false);
            setSelectedJetton(null);
          }}
          onSend={(jetton) => {
            setIsJettonDetailOpen(false);
            setSelectedJetton(jetton);
            setIsSendModalOpen(true);
          }}
          onReceive={handleReceiveFromDetail}
        />
      )}

      {/* Send Jetton Modal */}
      {selectedJetton && connectedAddress && isSendModalOpen && (
        <SendJettonModal
          jetton={selectedJetton}
          senderAddress={connectedAddress}
          onClose={() => {
            setSelectedJetton(null);
            setIsSendModalOpen(false);
          }}
        />
      )}

      {/* Receive Modal */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsReceiveModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 rounded-2xl max-w-md w-full overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Download className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Receive TON</h2>
                    <p className="text-sm text-slate-400">Share your address to receive funds</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsReceiveModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-2xl mb-4 inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${connectedAddressString}`}
                    alt="Wallet Address QR Code"
                    className="w-32 h-32"
                  />
                </div>
                
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-4">
                  <p className="text-sm text-slate-400 mb-2">Your TON Address</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-mono text-sm break-all flex-1">{connectedAddressString}</p>
                    <button
                      onClick={handleCopyAddress}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                    >
                      {copySuccess ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-slate-400">
                  Share this address to receive TON and other tokens in your wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TonWallet;