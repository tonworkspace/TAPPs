import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import useAuth from '@/hooks/useAuth'
import { GiTrophyCup } from 'react-icons/gi'
import { FaCopy } from 'react-icons/fa'
import { novatoken } from '@/images'

// Update the interface to match your table structure
interface ReferralWithUsers {
  id: number;
  referrer_id: number;
  referred_id: number;
  status: 'active' | 'inactive';
  created_at: string;
  level: number;
  referrer: {
    username: string;
    telegram_id: number;
  };
  referred: {
    username: string;
    telegram_id: number;
    total_earned: number;
    total_deposit: number;
    rank: string;
    is_premium: boolean;
  };
  sbt_amount: number;
  total_sbt_earned: number;
}

// interface ReferralSummary {
//   total_referrals: number;
//   total_users: number;
//   active_referrals: number;
//   inactive_referrals: number;
//   conversion_rate: number;
// }

type ReferrerDataFromDB = {
  referrer_id: number;
  referrer: {
    username: string;
    total_earned: number;
    total_deposit: number;
    rank: string;
  } | null;
  status: string;
}

interface ReferrerStat {
  referrer_id: number;
  username: string;
  referral_count: number;
  active_referrals: number;
  total_earned: number;
  total_deposit: number;
  rank: string;
}


// Update the constant
const ACTIVE_REFERRAL_REWARD = 5; // 5 TAPPS per active referral

// Add proper type for tree state
interface TreeUser {
  id: number;
  username: string;
  created_at: string;
  is_active: boolean;
  is_premium: boolean;
}

interface TreeData {
  upline: TreeUser | null;
  downline: TreeUser[];
}

type ReferralWithUser = {
  referred: {
    id: number;
    username: string;
    created_at: string;
    is_active: boolean;
    is_premium: boolean;
  }
}

// Add this helper function near the top of the file
const isRecentlyJoined = (dateString: string): boolean => {
  const joinDate = new Date(dateString);
  const now = new Date();
  const daysDifference = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysDifference <= 7; // Consider users joined within last 7 days as recent
};

const ReferralSystem = () => {
  const [, setReferrals] = useState<ReferralWithUsers[]>([]);
  // const [referralSummary, setReferralSummary] = useState<ReferralSummary>({
  //   total_referrals: 0,
  //   total_users: 0,
  //   active_referrals: 0,
  //   inactive_referrals: 0,
  //   conversion_rate: 0
  // });
  const { user } = useAuth();
  const [referralLink, setReferralLink] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [, setTotalCount] = useState<number>(0);
  const [allReferrerStats, setAllReferrerStats] = useState<ReferrerStat[]>([]);
  const [userReferralCount, setUserReferralCount] = useState<number>(0);
  const [userActiveReferrals, setUserActiveReferrals] = useState<number>(0);

  // Add pagination state
  const [pageSize,] = useState<number>(50);
  const [, setIsLoadingMore] = useState<boolean>(false);

  // Add a new state for user's referrals
  const [userReferrals, setUserReferrals] = useState<ReferralWithUsers[]>([]);
  const [, setIsLoadingUserReferrals] = useState<boolean>(false);

  // Add a state to control visibility (optional)
  const [] = useState<boolean>(false);

  // Add state for active tab
  const [activeTab, setActiveTab] = useState<'my-referrals' | 'statistics'>('my-referrals');

  // Add state for showing all referrals modal
  const [showAllReferrals, setShowAllReferrals] = useState<boolean>(false);

  // Add new state for active referral rewards
  const [activeReferralReward, setActiveReferralReward] = useState<number>(0);

  const [tree, setTree] = useState<TreeData>({ upline: null, downline: [] });

  const [isTreeLoading, setIsTreeLoading] = useState(false);

  // UI state for apply-by-code
  const [applyCode, setApplyCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const loadTree = async () => {
    if (!user?.id) return;
    setIsTreeLoading(true);
    try {
      const data = await getReferralTree(user.id);
      setTree(data);
    } catch (error) {
      console.error('Error loading referral tree:', error);
    } finally {
      setIsTreeLoading(false);
    }
  };

  useEffect(() => {
    loadTree();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const subscription = supabase
      .channel('referral_tree_changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `referral_id=eq.${user.id}`
        },
        loadTree
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      console.log("User ID detected:", user.id);
      console.log("User object:", user);
      setReferralLink(`https://t.me/stakenova_bot?startapp=${user.telegram_id}`);
      setReferralCode(String(user.telegram_id || user.id));
    } else {
      console.log("No user ID available in first useEffect");
    }
  }, [user?.id]);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Starting loadData function");
        // First get the total count of all referrals
        const { count: totalReferralsCount, error: countError } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true });

        if (countError) throw countError;
        
        // // Get active referrals count
        // const { count: activeCount, error: activeError } = await supabase
        //   .from('referrals')
        //   .select('*', { count: 'exact', head: true })
        //   .eq('status', 'active');
          
        // if (activeError) throw activeError;
        
        // Get unique referrers count
        // const { data: uniqueReferrers, error: referrersError } = await supabase
        //   .from('referrals')
        //   .select('referrer_id')
        //   .limit(100000); // Set a high limit to get all records
          
        // if (referrersError) throw referrersError;
        
        // const uniqueReferrerCount = new Set(uniqueReferrers?.map(r => r.referrer_id)).size;
        
        // Calculate summary
        const totalCount = totalReferralsCount || 0;
        // const activeReferrals = activeCount || 0;
        // const inactiveReferrals = totalCount - activeReferrals;
        
        // const summary = {
        //   total_referrals: totalCount,
        //   total_users: uniqueReferrerCount,
        //   active_referrals: activeReferrals,
        //   inactive_referrals: inactiveReferrals,
        //   conversion_rate: totalCount ? 
        //     Math.round((activeReferrals / totalCount) * 100) : 0
        // };
        
        // setReferralSummary(summary);
        setTotalCount(totalCount);

        // Get current user's referral count if user exists
        if (user?.id) {
          console.log("Attempting to get user referrals in loadData for user ID:", user.id);
          const { data: userReferrals, error: userRefError } = await supabase
            .from('referrals')
            .select('id, status')
            .eq('referrer_id', user.id);
            
          if (userRefError) {
            console.error("Error fetching user referrals in loadData:", userRefError);
          }
          
          if (!userRefError && userReferrals) {
            console.log("User referrals found in loadData:", userReferrals.length);
            setUserReferralCount(userReferrals.length);
            setUserActiveReferrals(userReferrals.filter(r => r.status === 'active').length);
          } else {
            console.log("No user referrals found in loadData");
          }
        } else {
          console.log("No user ID available in loadData");
        }

        // Get referrer stats with counts
        const { data: referrerStatsData } = await supabase
          .from('referrals')
          .select(`
            referrer_id,
            referrer:users!referrer_id(
              username,
              total_earned,
              total_deposit,
              rank
            ),
            status
          `) as { data: ReferrerDataFromDB[] | null, error: any };

        if (!referrerStatsData) return { data: [] };
        const counts = referrerStatsData.reduce((acc: { [key: string]: any }, curr) => {
          const id = curr.referrer_id;
          if (!acc[id]) {
            acc[id] = {
              referrer_id: id,
              username: curr.referrer?.username,
              referral_count: 0,
              active_referrals: 0,
              total_earned: curr.referrer?.total_earned || 0,
              total_deposit: curr.referrer?.total_deposit || 0,
              rank: curr.referrer?.rank || 'NOVA_INITIATE'
            };
          }
          acc[id].referral_count++;
          if (curr.status === 'active') {
            acc[id].active_referrals++;
          }
          return acc;
        }, {});
        
        const referrerStats = Object.values(counts);
        setAllReferrerStats(referrerStats);

        // Then get the first page of data
        await loadReferralsPage(1);
      } catch (err) {
        console.error('Error in loadData:', err);
        setError(err instanceof Error ? err.message : 'Failed to load referrals');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Set up real-time subscription
    const subscription = supabase
      .channel('referrals_changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'referrals'
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);

  // Add a function to load a specific page of referrals
  const loadReferralsPage = async (page: number) => {
    setIsLoadingMore(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referrer:users!referrer_id(username, telegram_id),
          referred:users!referred_id(
            username,
            telegram_id,
            total_earned,
            total_deposit,
            rank,
            is_premium,
            is_active
          )
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      if (page === 1) {
        setReferrals(data || []);
      } else {
        setReferrals(prev => [...prev, ...(data || [])]);
      }
          } catch (err) {
      console.error('Error loading referrals page:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Update the reward calculation function
  const calculateActiveReferralReward = (referrals: ReferralWithUsers[]): number => {
    return referrals.reduce((total, referral) => {
      // Include both sbt_amount and total_sbt_earned
      const referralEarning = (referral.sbt_amount || 0) + (referral.total_sbt_earned || 0);

      if (referral.status === 'active') {
        // Premium users give 10 TAPPS, others give 5
        const baseReward = referral.referred?.is_premium ? 10 : ACTIVE_REFERRAL_REWARD;
        return total + baseReward + referralEarning;
      }
      return total + referralEarning;
    }, 0);
  };

  

  // Update the updateReferralStats function
  const updateReferralStats = (referrals: ReferralWithUsers[]) => {
    const activeCount = referrals.filter(r => r.status === 'active').length;
    setUserReferralCount(referrals.length);
    setUserActiveReferrals(activeCount);
    
    // Calculate reward based on premium status
    const reward = calculateActiveReferralReward(referrals);
    setActiveReferralReward(reward);
  };

  // Update loadUserReferrals to include SBT token tracking
  const loadUserReferrals = async () => {
    if (!user?.id) {
      console.log("No user ID available in loadUserReferrals");
      return;
    }
    
    setIsLoadingUserReferrals(true);
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referrer:users!referrer_id(
            username,
            telegram_id
          ),
          referred:users!referred_id(
            username,
            telegram_id,
            total_earned,
            total_deposit,
            rank,
            is_premium,
            is_active
          ),
          sbt_amount,
          total_sbt_earned
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching referrals:', error);
        throw error;
      }

      console.log("Fetched referrals:", data);
      setUserReferrals(data || []);
      updateReferralStats(data || []);

    } catch (err) {
      console.error('Error in loadUserReferrals:', err);
    } finally {
      setIsLoadingUserReferrals(false);
    }
  };

  // Call this function when the component loads
  useEffect(() => {
    if (user?.id) {
      console.log("Calling loadUserReferrals from useEffect for user ID:", user.id);
      loadUserReferrals();
    } else {
      console.log("No user ID available in loadUserReferrals useEffect");
    }
  }, [user?.id]);

  // Add a useEffect to log state changes
  useEffect(() => {
    console.log("userReferralCount changed:", userReferralCount);
    console.log("userActiveReferrals changed:", userActiveReferrals);
  }, [userReferralCount, userActiveReferrals]);

  
  // Function to get upline/downline
  const getReferralTree = async (userId: number): Promise<TreeData> => {
    try {
      // Get upline (who referred you)
      const { data: referralData } = await supabase
        .from('referrals')
        .select('referrer_id')
        .eq('referred_id', userId)
        .maybeSingle();

      let uplineData = null;
      if (referralData?.referrer_id) {
        const { data: upline } = await supabase
          .from('users')
          .select('id, username, created_at, is_active, is_premium')
          .eq('id', referralData.referrer_id)
          .single();
        uplineData = upline;
      }

      // Get downline (people you referred)
      const { data: downline } = await supabase
        .from('referrals')
        .select(`
          referred:users!referred_id(
            id,
            username,
            created_at,
            is_active,
            is_premium
          )
        `)
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false }) as { data: ReferralWithUser[] | null };

      return { 
        upline: uplineData,
        downline: (downline || []).map(({ referred }) => ({
          id: referred.id,
          username: referred.username,
          created_at: referred.created_at,
          is_active: referred.is_active,
          is_premium: referred.is_premium
        }))
      };
    } catch (error) {
      console.error('Error in getReferralTree:', error);
      return { upline: null, downline: [] };
    }
  };

  // Update the formatDate function to include "time ago" for recent joins
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

      if (diffDays === 0) {
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffTime / (1000 * 60));
          return `${diffMinutes} minutes ago`;
        }
        return `${diffHours} hours ago`;
      }
      if (diffDays < 7) {
        return `${diffDays} days ago`;
      }
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="p-2 rounded-lg space-y-6">
        {/* Tab Navigation Skeleton */}
        <div className="flex relative mb-4 relative bg-black/30 rounded-xl border border-blue-500/20 shadow-lg p-1">
          {/* Animated Corner Decorations */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-blue-400/50" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-blue-400/50" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-blue-400/50" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-blue-400/50" />
          
          <div className="flex-1 py-2 rounded-lg text-center bg-blue-500/20 animate-pulse h-10"></div>
          <div className="flex-1 py-2 rounded-lg text-center bg-blue-500/10 animate-pulse h-10 ml-1"></div>
        </div>
        
        {/* Header Skeleton */}
        <div className="mb-4 text-center">
          <div className="mb-2">
            <div className="h-8 w-64 bg-blue-500/20 rounded-md animate-pulse mx-auto"></div>
          </div>
          <div className="h-4 w-48 bg-blue-500/10 rounded-md animate-pulse mx-auto"></div>
        </div>
        
        {/* Stats Card Skeleton */}
        <div className="relative backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl
          bg-gradient-to-b from-[#1a1c2e]/80 to-[#0d0f1d]/80">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400/80" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400/80" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400/80" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400/80" />

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Active Referrals Card Skeleton */}
            <div className="flex items-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex-1">
                <div className="h-3 w-24 bg-blue-500/20 rounded-md animate-pulse mb-2"></div>
                <div className="h-6 w-12 bg-blue-500/30 rounded-md animate-pulse"></div>
              </div>
              <div className="bg-blue-500/20 p-2.5 rounded-xl w-10 h-10 animate-pulse"></div>
            </div>

            {/* NOVA Rewards Card Skeleton */}
            <div className="flex items-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex-1">
                <div className="h-3 w-24 bg-green-500/20 rounded-md animate-pulse mb-2"></div>
                <div className="flex items-baseline gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 animate-pulse"></div>
                  <div className="h-6 w-12 bg-green-500/30 rounded-md animate-pulse"></div>
                  <div className="h-4 w-10 bg-green-500/20 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Referral Link Card Skeleton */}
        <div className="relative backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl
          bg-gradient-to-b from-[#1a1c2e]/80 to-[#0d0f1d]/80">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400/80" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400/80" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400/80" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400/80" />

          <div className="h-3 w-32 bg-blue-500/20 rounded-md animate-pulse mb-2"></div>
          <div className="flex items-center bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="h-5 w-full bg-blue-500/20 rounded-md animate-pulse"></div>
            <div className="ml-2 bg-blue-500/20 p-2 rounded-lg w-8 h-8 animate-pulse"></div>
          </div>
        </div>
        
        {/* Referral Network Card Skeleton */}
        <div className="relative backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl
          bg-gradient-to-b from-[#1a1c2e]/80 to-[#0d0f1d]/80">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400/80" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400/80" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400/80" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400/80" />

          <div className="h-6 w-40 bg-blue-500/20 rounded-md animate-pulse mb-4"></div>
          
          <div className="space-y-6">
            {/* Upline Section Skeleton */}
            <div>
              <div className="h-4 w-24 bg-blue-500/20 rounded-md animate-pulse mb-2"></div>
              <div className="bg-gray-800/40 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-5 w-32 bg-blue-500/20 rounded-md animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-blue-500/10 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Downline Section Skeleton */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 w-24 bg-blue-500/20 rounded-md animate-pulse"></div>
                <div className="h-3 w-16 bg-blue-500/10 rounded-md animate-pulse"></div>
              </div>
              
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-800/40 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full animate-pulse"></div>
                        <div>
                          <div className="h-5 w-32 bg-blue-500/20 rounded-md animate-pulse mb-2"></div>
                          <div className="h-4 w-24 bg-blue-500/10 rounded-md animate-pulse"></div>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-full h-6 w-16 bg-green-500/10 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 rounded-lg">
      <div className="mx-auto">
        {/* Tab Navigation */}         
        <div className="flex relative mb-4 bg-white rounded-xl border border-slate-200 shadow-sm p-1">
         {/* Animated Corner Decorations */}
         <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-blue-400/50" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-blue-400/50" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-blue-400/50" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-blue-400/50" />
          
          <button
            onClick={() => setActiveTab('my-referrals')}
            className={`flex-1 py-2 rounded-lg text-center transition-all ${
              activeTab === 'my-referrals'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Referrals
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex-1 py-2 rounded-lg text-center transition-all ${
              activeTab === 'statistics'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Global Ranks
          </button>
        </div>

        {activeTab === 'my-referrals' ? (
          <>
            {/* Invite & Apply */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Referral Link</div>
                    <div className="text-sm text-slate-900 truncate max-w-[240px] sm:max-w-none">{referralLink || 'Loading link...'}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => navigator.clipboard.writeText(referralLink)} className="px-3 py-1.5 rounded-md text-xs bg-slate-100 border border-slate-200 text-slate-700">Copy</button>
                      <button onClick={async()=>{try{if((navigator as any).share){await (navigator as any).share({title:'TAPPs Invite',text:`Join TAPPs with my link: ${referralLink}`,url:referralLink});}else{await navigator.clipboard.writeText(referralLink);}}catch{}}} className="px-3 py-1.5 rounded-md text-xs bg-blue-600 text-white">Share</button>
              </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Code</div>
                    <div className="text-lg font-semibold text-slate-900">{referralCode}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Have a Code?</div>
                <div className="flex items-center gap-2">
                  <input onChange={(e)=>{(e as any).target&&setApplyCode((e as any).target.value)}} placeholder="Enter referral code" className="flex-1 px-3 py-2 rounded-md border border-slate-200 text-sm outline-none focus:border-blue-400" />
                  <button onClick={async()=>{if(!user?.id||!applyCode.trim())return;try{setIsApplying(true);if(applyCode===String(user.telegram_id)||applyCode===String(user.id)){alert('You cannot use your own code.');return;}const { data: existing } = await supabase.from('referrals').select('*').eq('referred_id', user.id).maybeSingle();if(existing){alert('Referral already set.');return;}const codeNum=Number(applyCode);const { data: referrer } = await supabase.from('users').select('id').or(`telegram_id.eq.${codeNum},id.eq.${codeNum}`).maybeSingle();if(!referrer){alert('Invalid referral code.');return;}const { error: insertErr } = await supabase.from('referrals').insert({ referrer_id: referrer.id, referred_id: user.id, status: 'active' });if(insertErr)throw insertErr;alert('Referral code applied!');}catch(e){console.error(e);alert('Failed to apply code');}finally{setIsApplying(false);}}} className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm disabled:opacity-60" disabled={isApplying}>{isApplying ? 'Applying…' : 'Apply'}</button>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="relative rounded-2xl p-6 border border-slate-200 shadow-sm bg-white">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400/80" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400/80" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400/80" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400/80" />

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Active Referrals Card */}
                <div className="flex items-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs mb-1">Active Referrals</p>
                    <p className="text-2xl font-bold text-blue-500">{userActiveReferrals}</p>
                  </div>
                  <div className="bg-blue-500/20 p-2.5 rounded-xl">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>

                {/* NOVA Rewards Card */}
                <div className="flex items-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs mb-1">Referral Reward</p>
                    <div className="flex items-baseline gap-2">
                      {/* Token Icon */}
                      <div className="relative w-6 h-6 flex-shrink-0">
                        <img 
                          src={novatoken} 
                          alt="NOVA Token"
                          className="w-full h-full object-contain"
                          style={{ filter: 'drop-shadow(0 0 4px rgba(74, 222, 128, 0.2))' }}
                        />
                      </div>
                      
                      {/* Amount */}
                      <p className="text-2xl font-bold text-green-500">{activeReferralReward.toFixed(2)}</p>

                      {/* Token Name */}
                      <span className="text-sm font-medium text-green-500/80">TAPPS</span>
                    </div>
                  </div>
                 
                </div>
              </div>
            </div>

            {/* Referral Link Card */}
            <div className="relative backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mt-4
              bg-gradient-to-b from-[#1a1c2e]/80 to-[#0d0f1d]/80 group hover:scale-[1.01] transition-all duration-300">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400/80" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400/80" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400/80" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400/80" />

              <p className="text-xs text-slate-600 mb-2">Your Referral Link:</p>
              <div className="flex items-center bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-slate-900 text-sm flex-1">
                  {referralLink || 'Loading link...'}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(referralLink)}
                  className="ml-2 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                >
                  <FaCopy className="text-blue-700 text-sm" />
                </button>
              </div>
            </div>

            {/* Referral Network Card */}
            <div className="relative rounded-2xl p-6 border border-slate-200 shadow-sm mt-4 bg-white">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400/80" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400/80" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400/80" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400/80" />

              <h3 className="text-lg font-semibold mb-4">Referral Network</h3>
              
              {isTreeLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Upline Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Referred By</h4>
                    {tree.upline ? (
                      <div className="bg-gray-800/40 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <span className="text-blue-400 font-medium">
                              {tree.upline.username?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium">{tree.upline.username}</p>
                              {isRecentlyJoined(tree.upline.created_at) && (
                                <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full animate-pulse">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              Joined {formatDate(tree.upline.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No upline</p>
                    )}
                  </div>

                  {/* Downline Section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-400">Your Referrals</h4>
                      <span className="text-xs text-gray-400">{tree.downline.length} total</span>
                    </div>
                    
                    {tree.downline.length > 0 ? (
                      <div className="space-y-2">
                        {tree.downline.slice(0, 5).map((user) => (
                          <div key={user.id} className="bg-gray-800/40 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                  <span className="text-blue-400 font-medium">
                                    {user.username?.[0]?.toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-white font-medium">{user.username}</p>
                                    {isRecentlyJoined(user.created_at) && (
                                      <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full animate-pulse">
                                        New
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-400">
                                    Joined {formatDate(user.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs ${
                                user.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                              }`}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                          </div>
                        ))}

                        {tree.downline.length > 5 && (
                          <div className="text-center mt-2">
                            <button 
                              onClick={() => setShowAllReferrals(true)}
                              className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
                            >
                              <span>See all {tree.downline.length} referrals</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-4xl mb-2">👻</div>
                        <p className="text-gray-400 text-sm">Share your link to get started!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Statistics Tab Content
          <div className="space-y-6">
            {/* Stats Header */}
            <div className="text-center mb-4">
              <div className="mb-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 
                  bg-clip-text text-transparent">🏆 GLOBAL RANKINGS 🏆</span>
              </div>
              <p className="text-gray-400 text-sm">Global network and top performers</p>
            </div>

            {/* Leaderboard */}
            <div className="relative p-4 rounded-xl border border-blue-500/20 bg-black/30 backdrop-blur-sm shadow-lg rounded-xl p-4 mt-4">
          {/* Animated Corner Decorations */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-blue-400/50" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-blue-400/50" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-blue-400/50" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-blue-400/50" />
                        <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <GiTrophyCup className="text-yellow-500 text-2xl" />
                  <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Leaderboard
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Live</span>
                </div>
              </div>

              {/* Mobile View (Card Layout) */}
              <div className="md:hidden space-y-4">
                {allReferrerStats
                  .sort((a, b) => b.active_referrals - a.active_referrals)
                  .slice(0, 10)
                  .map((referrer, index) => (
                    <div 
                      key={referrer.referrer_id}
                      className={`relative p-4 rounded-lg border transition-all duration-300 hover:scale-102 ${
                        index === 0 
                          ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20' 
                          : index === 1 
                          ? 'bg-gradient-to-br from-gray-400/10 to-gray-500/10 border-gray-400/20'
                          : index === 2 
                          ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20'
                          : 'bg-gray-800/40 border-gray-700/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{referrer.username}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              referrer.active_referrals > 0 
                                ? 'bg-green-500/10 text-green-400' 
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {referrer.active_referrals > 0 ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between text-sm">
                            <span className="text-gray-400">Active Referrals:</span>
                            <span className="text-green-400 font-medium">{referrer.active_referrals}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Desktop View (Table Layout) */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-gray-400">
                      <th className="pb-4 text-left w-16">Rank</th>
                      <th className="pb-4 text-left">Player</th>
                      <th className="pb-4 text-right">Referrals</th>
                      <th className="pb-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allReferrerStats
                      .sort((a, b) => b.active_referrals - a.active_referrals)
                      .slice(0, 10)
                      .map((referrer, index) => (
                        <tr 
                          key={referrer.referrer_id}
                          className={`border-b border-gray-700/30 last:border-0 transition-all duration-300 hover:bg-white/5 ${
                            index === 0 ? 'bg-yellow-500/5' : 
                            index === 1 ? 'bg-gray-400/5' : 
                            index === 2 ? 'bg-orange-500/5' : ''
                          }`}
                        >
                          <td className="py-4">
                            <div className="flex items-center">
                              {index < 3 ? (
                                <span className="text-2xl">
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </span>
                              ) : (
                                <span className="text-gray-400 font-bold">#{index + 1}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{referrer.username}</span>
                              {referrer.rank && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400">
                                  {referrer.rank}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-green-400 font-bold">{referrer.active_referrals}</span>
                          </td>
                          <td className="py-4 text-right">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              referrer.active_referrals > 0 
                                ? 'bg-green-500/10 text-green-400' 
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {referrer.active_referrals > 0 ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal for All Referrals */}
      {showAllReferrals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative p-4 rounded-xl border border-blue-500/20 bg-black/30 backdrop-blur-sm shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Animated Corner Decorations */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-blue-400/50" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-blue-400/50" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-blue-400/50" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-blue-400/50" />
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Your Referral Network</h3>
              <button 
                onClick={() => setShowAllReferrals(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {userReferrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg mb-2 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white relative">
                      {referral.referred?.username?.charAt(0).toUpperCase() || '?'}
                      {referral.referred?.is_premium && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white">
                        {referral.referred?.username || 'Unknown User'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {referral.referred?.username ? (
                          <a 
                            href={`https://t.me/${referral.referred.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View Profile
                          </a>
                        ) : 'No Telegram ID'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 px-3 py-1.5 rounded-full">
                      <span className="text-blue-500 text-xs font-bold">
                        {referral.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {referral.referred?.is_premium && (
                      <div className="bg-yellow-500/10 px-3 py-1.5 rounded-full">
                        <span className="text-yellow-500 text-xs font-bold">
                          Premium
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;