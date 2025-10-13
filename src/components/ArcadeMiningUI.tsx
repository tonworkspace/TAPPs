import { useState, useEffect } from 'react';
import { supabase, ensureUserHasSponsorCode } from '../lib/supabaseClient';

interface ArcadeMiningUIProps {
  balanceTon: number;
  tonPrice: number;
  currentEarningsTon: number;
  isClaiming: boolean;
  claimCooldown: number;
  cooldownText: string;
  onClaim: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw?: () => void;
  potentialEarningsTon: number;
  airdropBalanceNova: number;
  totalWithdrawnTon: number;
  activities?: Array<{ id: string; type: string; amount: number; status: string; created_at: string; }>; 
  isLoadingActivities?: boolean;
  userId?: number;
  userUsername?: string;
  referralCode?: string;
}

// A compact, arcade-style mining UI that preserves existing actions
export default function ArcadeMiningUI(props: ArcadeMiningUIProps) {
  const {
    balanceTon,
    tonPrice,
    currentEarningsTon,
    isClaiming,
    claimCooldown,
    cooldownText,
    onClaim,
    onOpenDeposit,
    // onOpenWithdraw,
    airdropBalanceNova,
    potentialEarningsTon,
    totalWithdrawnTon,
    userId,
    userUsername,
    referralCode,
  } = props;

  const [activeTab, setActiveTab] = useState<'mining' | 'activity' | 'referral'>('mining');
  const [sponsorCode, setSponsorCode] = useState<string>('');
  const [sponsorInfo, setSponsorInfo] = useState<{username: string, code: string} | null>(null);
  const [referralStats, setReferralStats] = useState<{active: number, total: number}>({active: 0, total: 0});

  const isStaked = Number(balanceTon) > 0;
  const canClaim = isStaked && !isClaiming && currentEarningsTon > 0 && claimCooldown <= 0;

  // Load referral data
  useEffect(() => {
    const loadReferralData = async () => {
      if (!userId) return;

      try {
        // Get user's sponsor code
        const code = await ensureUserHasSponsorCode(userId, userUsername);
        setSponsorCode(code);

        // Get sponsor information
        const { data: user } = await supabase
          .from('users')
          .select('sponsor_id, sponsor:users!referrer_id(username, sponsor_code)')
          .eq('id', userId)
          .single();

        if (user?.sponsor) {
          const sponsorData = Array.isArray(user.sponsor) ? user.sponsor[0] : user.sponsor;
          if (sponsorData && sponsorData.username) {
            setSponsorInfo({
              username: sponsorData.username,
              code: sponsorData.sponsor_code || 'N/A'
            });
          }
        }

        // Get referral stats
        const { data: referrals } = await supabase
          .from('referrals')
          .select('status')
          .eq('sponsor_id', userId);

        if (referrals) {
          const active = referrals.filter(r => r.status === 'active').length;
          setReferralStats({ active, total: referrals.length });
        }
      } catch (error) {
        console.error('Error loading referral data:', error);
      }
    };

    loadReferralData();
  }, [userId, userUsername]);

  return (
    <div className="relative overflow-visible">
      
      <div className="relative p-4 rounded-15 bg-white border-2 border-slate-300 shadow-sm" style={{borderImage: 'linear-gradient(90deg, #e2e8f0, #cbd5e1, #94a3b8, #cbd5e1, #e2e8f0) 1'}}>
        <div className="relative">
          {/* Compact Header Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${isStaked ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold tracking-wide uppercase">MINING POWER</div>
                <div className="text-lg font-bold text-slate-900">
                  {balanceTon?.toFixed(2) || '0.00'} <span className="text-slate-600 text-base font-medium">TON</span>
                </div>
              </div>
            </div>
            <button
              onClick={onOpenDeposit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-semibold">START MINING</span>
            </button>
          </div>

          {/* Compact Tabs */}
          <div className="flex items-center justify-center mb-4">
            <div className="inline-flex p-1 rounded-lg bg-slate-100">
              <button
                onClick={() => setActiveTab('mining')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${activeTab === 'mining' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
              >
                Mining
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${activeTab === 'activity' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
              >
                Activity
              </button>
              <button
                onClick={() => setActiveTab('referral')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${activeTab === 'referral' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
              >
                Invite
              </button>
            </div>
          </div>

          {/* Compact Earnings Display */}
          {activeTab === 'mining' && (
          <div className="flex items-center justify-center py-4">
            <div className="relative w-40 h-40">
              {/* Simple rings */}
              <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
              <div className="absolute inset-2 rounded-full border border-blue-200" />
              
              {/* Clean background */}
              <div className="absolute inset-0 rounded-full bg-slate-50" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-slate-900 text-2xl font-black mb-1 tracking-tight">
                  {currentEarningsTon.toFixed(6)}
                </div>
                <div className="text-blue-600 text-sm font-bold mb-1 tracking-wider uppercase">
                  TAPPS JETTONS
                </div>
                <div className="text-emerald-600 text-sm font-semibold">
                  ≈ ${(currentEarningsTon * tonPrice).toFixed(2)}
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isStaked ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <div className={`text-xs font-bold tracking-wide ${isStaked ? 'text-emerald-600' : 'text-slate-500'}`}>{isStaked ? 'Active' : 'Inactive'}</div>
                </div>
              </div>
            </div>
          </div>
          )}

          {activeTab === 'activity' && (
            <div className="mt-4 mb-4 space-y-3">
              {props.isLoadingActivities ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : props.activities && props.activities.length > 0 ? (
                props.activities.slice(0, 10).map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-900 capitalize font-medium">{a.type.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900">{typeof a.amount === 'number' ? a.amount.toFixed(6) : a.amount} {a.type === 'nova_reward' ? 'TAPPS' : 'TON'}</div>
                      <div className="text-xs text-slate-500">{a.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">No recent activity</div>
              )}
            </div>
          )}

          {activeTab === 'referral' && (
            <div className="mt-4 mb-4 space-y-4">
              {/* Your Sponsor Code */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="text-sm font-bold text-slate-700 mb-2">🎯 My Sponsor Code</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-slate-300">
                    <span className="text-lg font-bold text-blue-600">{ referralCode || sponsorCode || 'Loading...'}</span>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(referralCode || sponsorCode);
                        alert('Sponsor code copied!');
                      } catch (error) {
                        alert('Failed to copy code');
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Your Sponsor */}
              {sponsorInfo && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-sm font-bold text-slate-700 mb-2">👆 Your Sponsor</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        {sponsorInfo.username?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="text-slate-900 font-medium">{sponsorInfo.username}</div>
                      <div className="text-xs text-slate-500">Code: {sponsorInfo.code}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Referral Stats */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="text-sm font-bold text-slate-700 mb-3">📊 My Network</div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{referralStats.active}</div>
                    <div className="text-xs text-slate-500">Active Team</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Not staked prompt */}
          {!isStaked && (
            <div className="mb-6">
              <div className="relative w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="relative flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-800 text-sm font-medium">Deposit TON to start mining</div>
                    <div className="text-slate-600 text-xs">Stake TON to activate real-time earnings</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          

          {/* Compact Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg p-3 bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-bold tracking-wide uppercase mb-1">Claimable</div>
              <div className="text-slate-900 font-bold text-sm">
                  {totalWithdrawnTon.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-slate-500 text-xs font-semibold">TAPPs</div>
            </div>
            
            <div className="rounded-lg p-3 bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-bold tracking-wide uppercase mb-1">Airdrop</div>
              <div className="text-slate-900 font-bold text-sm">
                  {Number(airdropBalanceNova ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-slate-500 text-xs font-semibold">TAPPs</div>
            </div>
            
            <div className="rounded-lg p-3 bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-bold tracking-wide uppercase mb-1">Potential</div>
              <div className="text-slate-900 font-bold text-sm">
                  {potentialEarningsTon.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-slate-500 text-xs font-semibold">TAPPs</div>
            </div>
          </div>

          {/* Compact Action Buttons */}
          <div className="space-y-2">
          <button
              onClick={isStaked ? onClaim : onOpenDeposit}
              disabled={isStaked ? !canClaim : false}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                (isStaked && canClaim) 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {isStaked ? (
                  isClaiming ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                      <span>Claiming...</span>
                    </>
                  ) : claimCooldown > 0 ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{cooldownText}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Claim Rewards</span>
                    </>
                  )
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Deposit to Start Mining</span>
                  </>
                )}
              </div>
            </button>
            {/* {isStaked && (
              <button
                onClick={onOpenWithdraw}
                disabled={!onOpenWithdraw || totalWithdrawnTon <= 0}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                  onOpenWithdraw && totalWithdrawnTon > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  <span>Withdraw TAPPS</span>
                </div>
              </button>
            )} */}
          </div>

          {/* Compact Footer Info */}
          <div className="mt-4">
            <div className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-slate-900 text-sm font-bold">Real-time Mining</div>
                  <div className="text-slate-600 text-xs font-semibold">Calculated every second</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


