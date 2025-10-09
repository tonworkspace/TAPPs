// import { useTonConnectUI } from '@tonconnect/ui-react';
// import { toUserFriendlyAddress } from '@tonconnect/sdk';
// import { FC, useState, useEffect, useRef } from 'react';
// import { FaCoins, FaWallet, FaUserPlus } from 'react-icons/fa';
// import { BiNetworkChart } from 'react-icons/bi';
// import { AiOutlineHome } from 'react-icons/ai';
// import { TonConnectButton, } from '@tonconnect/ui-react';
// import { useAuth } from '@/hooks/useAuth';
// import { supabase } from '@/lib/supabaseClient';
// import { getTONPrice } from '@/lib/api';
// import GMPLeaderboard from '@/components/GMPLeaderboard';
// import { OnboardingScreen } from './OnboardingScreen';
// import { toNano, fromNano } from "ton";
// import TonWeb from 'tonweb';
// import { Button } from '@telegram-apps/telegram-ui';
// import { Snackbar } from '@telegram-apps/telegram-ui';
// import ReferralSystem from '@/components/ReferralSystem';
// import TokenLaunchpad from '@/components/TokenLaunchpad';
// import { WithdrawalInfoModal } from '@/components/WithdrawalInfoModal';
// import { BsCoin } from 'react-icons/bs';
// import { GiScrollUnfurled } from 'react-icons/gi';
// import SocialTasks from '@/components/SocialTasks';


// interface StatsCardProps {
//   title: string;
//   value: string | number;
//   subValue?: string;
//   icon: JSX.Element;
//   bgColor: string;
//   className?: string;
// }

// const StatsCard: FC<StatsCardProps> = ({ title, value, subValue, icon, bgColor, className }) => (
//   <div className={`bg-gradient-to-br from-[#0A0A0F] to-[#11131A] rounded-xl p-4 border border-green-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] ${className}`}>
//     <div className="flex items-center gap-4">
//       <div className={`${bgColor} p-2.5 rounded-lg flex-shrink-0 bg-opacity-20`}>
//         {icon}
//       </div>
//       <div className="min-w-0">
//         <p className="text-xs text-green-300/60">{title}</p>
//         <p className="text-sm font-semibold text-white mt-1 truncate">{value}</p>
//         {subValue && <p className="text-[10px] text-green-300/40 mt-0.5">{subValue}</p>}
//       </div>
//     </div>
//   </div>
// );

// // // Update the renderROIStats function
// // const renderROIStats = (currentROI: number) => {
// //   const dailyRate = currentROI * 100;
// //   const weeklyRate = dailyRate * 7;
// //   const monthlyRate = dailyRate * 30;
// //   const annualRate = dailyRate * 365;

// //   return (
// //     <div className="bg-white/5 rounded-lg p-3">
// //       <div className="flex items-center gap-1.5 mb-1">
// //         <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
// //         </svg>
// //         <span className="text-xs text-white/40">Earning Rates</span>
// //       </div>
// //       <div className="space-y-1">
// //         <div className="flex items-center justify-between">
// //           <span className="text-sm text-white/60">Daily</span>
// //           <span className="text-sm font-semibold text-green-400">
// //             +{dailyRate.toFixed(2)}%
// //           </span>
// //         </div>
// //         <div className="flex items-center justify-between">
// //           <span className="text-sm text-white/60">Weekly</span>
// //           <span className="text-sm font-semibold text-green-400">
// //             +{weeklyRate.toFixed(2)}%
// //           </span>
// //         </div>
// //         <div className="flex items-center justify-between">
// //           <span className="text-sm text-white/60">Monthly</span>
// //           <span className="text-sm font-semibold text-green-400">
// //             +{monthlyRate.toFixed(2)}%
// //           </span>
// //         </div>
// //         <div className="flex items-center justify-between">
// //           <span className="text-sm text-white/60">Annual</span>
// //           <span className="text-sm font-semibold text-green-400">
// //             +{annualRate.toFixed(2)}%
// //           </span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };


// type CardType = 'stats' | 'activity' | 'community';

// // Add this type definition at the top of the file
// type ActivityType = 
//   | 'deposit' 
//   | 'withdrawal' 
//   | 'stake' 
//   | 'redeposit' 
//   | 'nova_reward' 
//   | 'nova_income'
//   | 'offline_reward'
//   | 'earnings_update'
//   | 'claim'
//   | 'transfer'
//   | 'reward'
//   | 'bonus'
//   | 'top_up'; // Add this new type

// // Add these interfaces
// interface Activity {
//   id: string;
//   user_id: string;
//   type: ActivityType;
//   amount: number;
//   status: string;
//   created_at: string;
// }

// // // Add this new component
// // const RankBadge: FC<{ rank: string }> = ({ rank }) => {
// //   const getRankColor = (rank: string): string => {
// //     switch (rank) {
// //       case 'Novice': return 'bg-gray-500/20 text-gray-400';
// //       case 'Ambassador': return 'bg-green-500/20 text-green-400';
// //       case 'Warrior': return 'bg-blue-500/20 text-blue-400';
// //       case 'Master': return 'bg-purple-500/20 text-purple-400';
// //       case 'Cryptomogul': return 'bg-yellow-500/20 text-yellow-400';
// //       case 'TON Baron': return 'bg-orange-500/20 text-orange-400';
// //       case 'Tycoon': return 'bg-red-500/20 text-red-400';
// //       case 'TON Elite': return 'bg-pink-500/20 text-pink-400';
// //       case 'Final Boss': return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-400';
// //       default: return 'bg-gray-500/20 text-gray-400';
// //     }
// //   };

// //   return (
// //     <div className={`px-3 py-1 rounded-full ${getRankColor(rank)} font-medium text-xs`}>
// //       {rank}
// //     </div>
// //   );
// // };

// // Add these constants for both networks
// const MAINNET_DEPOSIT_ADDRESS = 'UQASkbQTNxOa_N3hIN_mpE5aHlHG9OzG5pSFv-RMt7q-fmsB';
// const TESTNET_DEPOSIT_ADDRESS = 'UQASkbQTNxOa_N3hIN_mpE5aHlHG9OzG5pSFv-RMt7q-fmsB';

// const isMainnet = true; // You can toggle this for testing

// // Use the appropriate address based on network
// const DEPOSIT_ADDRESS = isMainnet ? MAINNET_DEPOSIT_ADDRESS : TESTNET_DEPOSIT_ADDRESS;

// // Constants for both networks
// const MAINNET_API_KEY = '26197ebc36a041a5546d69739da830635ed339c0d8274bdd72027ccbff4f4234';
// const TESTNET_API_KEY = 'd682d9b65115976e52f63713d6dd59567e47eaaa1dc6067fe8a89d537dd29c2c';

// // Use toncenter.com as HTTP API endpoint to interact with TON blockchain
// const tonweb = isMainnet ?
//     new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: MAINNET_API_KEY})) :
//     new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {apiKey: TESTNET_API_KEY}));



// // Add this near the top with other constants
// const NETWORK_NAME = isMainnet ? 'Mainnet' : 'Testnet';

// // Helper function to generate unique ID
// const generateUniqueId = async () => {
//   let attempts = 0;
//   const maxAttempts = 5;
  
//   while (attempts < maxAttempts) {
//     // Generate a random ID between 1 and 999999
//     const id = Math.floor(Math.random() * 999999) + 1;
    
//     // Check if ID exists
//     const { error } = await supabase
//       .from('deposits')
//       .select('id')
//       .eq('id', id)
//       .single();
      
//     if (error && error.code === 'PGRST116') {  // No rows returned
//       return id;  // Return as number, not string
//     }
    
//     attempts++;
//   }
  
//   throw new Error('Could not generate unique deposit ID');
// };

// // Add these types and interfaces near other interfaces
// interface SnackbarConfig {
//   message: string;
//   description?: string;
//   duration?: number;
// }

// // Add these constants near other constants
// const SNACKBAR_DURATION = 5000; // 5 seconds

// // Add these new interfaces
// interface LocalEarningState {
//   lastUpdate: number;
//   currentEarnings: number;
//   baseEarningRate: number;
//   isActive: boolean;
//   startDate?: number;
// }

// // Add these constants
// const EARNINGS_SYNC_INTERVAL = 60000; // Sync with server every 60 seconds
// const EARNINGS_STORAGE_KEY = 'userEarnings';
// const EARNINGS_UPDATE_INTERVAL = 1000; // Update UI every second

// // Add this interface near other interfaces
// interface OfflineEarnings {
//   lastActiveTimestamp: number;
//   baseEarningRate: number;
// }

// // Add this constant near other constants
// const OFFLINE_EARNINGS_KEY = 'offline_earnings_state';

// // Add this constant near other constants
// const TOTAL_EARNED_KEY = 'total_earned_state';

// // Add these constants at the top
// const LOCK_PERIOD_DAYS = 100;
// const LOCK_PERIOD_MS = LOCK_PERIOD_DAYS * 24 * 60 * 60 * 1000;

// // Update the calculateStakingProgress function
// const calculateStakingProgress = (depositDate: Date | string | null): number => {
//   if (!depositDate) return 0;
  
//   // Convert string to Date if necessary
//   const startDate = typeof depositDate === 'string' ? new Date(depositDate) : depositDate;
  
//   // Validate the date
//   if (isNaN(startDate.getTime())) return 0;

//   const now = Date.now();
//   const startTime = startDate.getTime();
//   const endTime = startTime + LOCK_PERIOD_MS;
  
//   // Handle edge cases
//   if (now >= endTime) return 100;
//   if (now <= startTime) return 0;
  
//   // Calculate progress
//   const progress = ((now - startTime) / (endTime - startTime)) * 100;
//   return Math.min(Math.max(progress, 0), 100); // Ensure between 0 and 100
// };

// // Add these helper functions
// const saveOfflineEarnings = (state: OfflineEarnings) => {
//   localStorage.setItem(OFFLINE_EARNINGS_KEY, JSON.stringify(state));
// };

// const loadOfflineEarnings = (): OfflineEarnings | null => {
//   const stored = localStorage.getItem(OFFLINE_EARNINGS_KEY);
//   return stored ? JSON.parse(stored) : null;
// };

// const loadTotalEarned = (): number => {
//   const stored = localStorage.getItem(TOTAL_EARNED_KEY);
//   return stored ? parseFloat(stored) : 0;
// };

// // Add these constants at the top
// // const USER_SESSION_KEY = 'userSession';
// const EARNINGS_KEY_PREFIX = 'userEarnings_';
// const LAST_SYNC_PREFIX = 'lastSync_';

// // // Add session management functions
// // const saveUserSession = (userId: number) => {
// //   localStorage.setItem(USER_SESSION_KEY, userId.toString());
// // };

// // const getUserSession = (): number | null => {
// //   const session = localStorage.getItem(USER_SESSION_KEY);
// //   return session ? Number(session) : null;
// // };

// // const clearUserSession = () => {
// //   const userId = getUserSession();
// //   if (userId) {
// //     localStorage.removeItem(USER_SESSION_KEY);
// //     localStorage.removeItem(`${EARNINGS_KEY_PREFIX}${userId}`);
// //     localStorage.removeItem(`${LAST_SYNC_PREFIX}${userId}`);
// //   }
// // };

// // Update storage keys to be user-specific
// const getUserEarningsKey = (userId: number) => `${EARNINGS_KEY_PREFIX}${userId}`;
// const getUserSyncKey = (userId: number) => `${LAST_SYNC_PREFIX}${userId}`;

// // Update syncEarningsToDatabase
// const syncEarningsToDatabase = async (userId: number, earnings: number) => {
//   try {
//     const lastSync = localStorage.getItem(getUserSyncKey(userId));
//     const now = Date.now();
    
//     if (!lastSync || (now - Number(lastSync)) > SYNC_INTERVAL) {
//       await supabase
//         .from('user_earnings')
//         .upsert({
//           user_id: userId,
//           current_earnings: earnings,
//           last_update: new Date().toISOString()
//         }, {
//           onConflict: 'user_id'
//         });
      
//       localStorage.setItem(getUserSyncKey(userId), now.toString());
//     }
//   } catch (error) {
//     console.error('Silent sync error:', error);
//   }
// };


// export const IndexPage: FC = () => {

//   const [currentTab, setCurrentTab] = useState('home');
//   const [showDepositModal, setShowDepositModal] = useState(false);
//   const { user, isLoading, error, updateUserData } = useAuth();
//   // const userAddress = useTonAddress();
//   const [userFriendlyAddress, setUserFriendlyAddress] = useState<string | null>(null);
//   const tonConnectUI = useTonConnectUI();
  
//   useEffect(() => {
//     const [tonConnect] = tonConnectUI;
//     if (tonConnect.account) {
//       const rawAddress = tonConnect.account.address;
//       const friendlyAddress = toUserFriendlyAddress(rawAddress);
//       setUserFriendlyAddress(friendlyAddress);
//     }
//   }, [tonConnectUI]);

//   const [isWithdrawing,] = useState(false);
//   const [activeCard, setActiveCard] = useState<CardType>('stats');
//   const [currentROI, ] = useState<number>(0.01); // 1% daily default
//   const [tonPrice, setTonPrice] = useState<number>(2.5);
//   const [showOnboarding, setShowOnboarding] = useState(false);

//   // Add state for activities
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [isLoadingActivities, setIsLoadingActivities] = useState(false);

//   const [depositStatus, setDepositStatus] = useState('idle');

//   // Add these state variables near the top with other state declarations
//   const [walletBalance, setWalletBalance] = useState<string>('0');
//   const [isLoadingBalance, setIsLoadingBalance] = useState(true);

//   // Add these state variables
//   const [isSnackbarVisible, setSnackbarVisible] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarDescription, setSnackbarDescription] = useState('');
//   const snackbarTimeoutRef = useRef<NodeJS.Timeout>();

//   // Add this state for custom amount
//   const [customAmount, setCustomAmount] = useState('');



//   // Update the earning system in the IndexPage component
//   const [earningState, setEarningState] = useState<LocalEarningState>({
//     lastUpdate: Date.now(),
//     currentEarnings: 0,
//     baseEarningRate: 0,
//     isActive: false,
//   });

//   // Add function to save earning state to localStorage
//   const saveEarningState = (state: LocalEarningState) => {
//     try {
//       localStorage.setItem(EARNINGS_STORAGE_KEY, JSON.stringify(state));
//     } catch (error) {
//       console.error('Error saving earning state:', error);
//     }
//   };

//   // // Add function to load earning state from localStorage
//   // const loadEarningState = (): LocalEarningState | null => {
//   //   try {
//   //     const stored = localStorage.getItem(EARNINGS_STORAGE_KEY);
//   //     if (stored) {
//   //       const parsed = JSON.parse(stored);
//   //       // Validate the loaded state
//   //       if (parsed && typeof parsed === 'object' && 
//   //           'lastUpdate' in parsed && 'currentEarnings' in parsed && 
//   //           'baseEarningRate' in parsed && 'isActive' in parsed) {
//   //         return parsed;
//   //       }
//   //     }
//   //   } catch (error) {
//   //     console.error('Error loading earning state:', error);
//   //   }
//   //   return null;
//   // };

//   // Update earnings effect
//   useEffect(() => {
//     if (!user?.id || !user.balance) return;

//     // // Save user session
//     // saveUserSession(user.id);

//     // Load saved earnings from localStorage with user-specific key
//     const savedEarnings = localStorage.getItem(getUserEarningsKey(user.id));
//     const initialEarnings = savedEarnings ? JSON.parse(savedEarnings) : {
//       currentEarnings: 0,
//       lastUpdate: Date.now(),
//       baseEarningRate: calculateEarningRate(user.balance, currentROI),
//       isActive: user.balance > 0
//     };

//     setEarningState(initialEarnings);

//     const earningsInterval = setInterval(() => {
//       setEarningState(prevState => {
//         const now = Date.now();
//         const secondsElapsed = (now - prevState.lastUpdate) / 1000;
//         const newEarnings = prevState.currentEarnings + (prevState.baseEarningRate * secondsElapsed);
        
//         const newState = {
//           ...prevState,
//           lastUpdate: now,
//           currentEarnings: newEarnings
//         };
        
//         // Save to user-specific localStorage key
//         localStorage.setItem(getUserEarningsKey(user.id!), JSON.stringify(newState));
        
//         // Stealth sync to database
//         syncEarningsToDatabase(user.id!, newEarnings);
        
//         return newState;
//       });
//     }, EARNINGS_UPDATE_INTERVAL);

//     return () => {
//       clearInterval(earningsInterval);
//       // Save final state before unmounting
//       const finalState = earningState;
//       localStorage.setItem(getUserEarningsKey(user.id), JSON.stringify(finalState));
      
//       // Final sync with server using IIFE
//       (async () => {
//         try {
//           await supabase
//             .from('user_earnings')
//             .upsert({
//               user_id: user.id,
//               current_earnings: finalState.currentEarnings,
//               last_update: new Date().toISOString()
//             }, {
//               onConflict: 'user_id'
//             });
//           console.log('Final earnings sync completed');
//         } catch (err) {
//           console.error('Error in final earnings sync:', err);
//         }
//       })();
//     };
//   }, [user?.id, user?.balance, currentROI]);

//   // Add this utility function
//   const showSnackbar = ({ message, description = '', duration = SNACKBAR_DURATION }: SnackbarConfig) => {
//     if (snackbarTimeoutRef.current) {
//       clearTimeout(snackbarTimeoutRef.current);
//     }

//     setSnackbarMessage(message);
//     setSnackbarDescription(description);
//     setSnackbarVisible(true);

//     snackbarTimeoutRef.current = setTimeout(() => {
//       setSnackbarVisible(false);
//     }, duration);
//   };

//   // Add this effect to fetch and update the wallet balance
//   useEffect(() => {
//     const fetchWalletBalance = async () => {
//       const [tonConnect] = tonConnectUI;
//       if (!tonConnect.account) {
//         setWalletBalance('0');
//         setIsLoadingBalance(false);
//         return;
//       }

//       try {
//         const balance = await tonweb.getBalance(tonConnect.account.address);
//         const balanceInTON = fromNano(balance);
//         setWalletBalance(balanceInTON);
//       } catch (error) {
//         console.error('Error fetching wallet balance:', error);
//         setWalletBalance('0');
//       } finally {
//         setIsLoadingBalance(false);
//       }
//     };

//     fetchWalletBalance();
//     // Update balance every 30 seconds
//     const intervalId = setInterval(fetchWalletBalance, 30000);

//     return () => clearInterval(intervalId);
//   }, [tonConnectUI]);

// // Add this function to calculate earnings rate based on user's balance and ROI
// const calculateEarningRate = (balance: number, baseROI: number) => {
//   // Enhanced ROI based on stake amount
//   let adjustedROI = baseROI;
//   if (balance >= 100) {
//     adjustedROI *= 1.5; // 50% bonus for 100+ TON
//   } else if (balance >= 50) {
//     adjustedROI *= 1.25; // 25% bonus for 50-99 TON
//   } else if (balance >= 10) {
//     adjustedROI *= 1.1; // 10% bonus for 10-49 TON
//   }
  
//   // Convert daily ROI to per-second rate
//   return (balance * adjustedROI) / 86400;
// };

// // Update handleDeposit to use proper number handling
// const handleDeposit = async (amount: number) => {
//   try {
//     // Validate amount
//     if (amount < 1) {
//       showSnackbar({ 
//         message: 'Invalid Amount', 
//         description: 'Minimum deposit amount is 1 TON' 
//       });
//       return;
//     }

//     // Validate user and wallet connection
//     if (!user?.id || !userFriendlyAddress) {
//       showSnackbar({ 
//         message: 'Wallet Not Connected', 
//         description: 'Please connect your wallet first' 
//       });
//       return;
//     }

//     // Check wallet balance
//     const walletBalanceNum = Number(walletBalance);
//     if (walletBalanceNum < amount) {
//       showSnackbar({
//         message: 'Insufficient Balance',
//         description: `Your wallet balance is ${walletBalanceNum.toFixed(2)} TON`
//       });
//       return;
//     }

//     setDepositStatus('pending');
//     const amountInNano = toNano(amount.toString());
//     const depositId = await generateUniqueId();
    
//     // Determine if this is a new user or a top-up
//     const isNewUser = !user.balance || user.balance === 0;
    
//     // Store current earnings state before deposit
//     const previousEarnings = isNewUser ? 0 : Number(earningState.currentEarnings.toFixed(8));
//     const previousState = {
//       ...earningState,
//       currentEarnings: previousEarnings,
//       startDate: isNewUser ? Date.now() : earningState.startDate,
//       lastUpdate: Date.now()
//     };
    
//     // Save current earning state
//     localStorage.setItem(EARNINGS_STORAGE_KEY, JSON.stringify(previousState));
    
//     // Record pending deposit
//     const { error: pendingError } = await supabase
//       .from('deposits')
//       .insert([{
//         id: depositId,
//         user_id: user.id,
//         amount: amount,
//         amount_nano: amountInNano.toString(),
//         status: 'pending',
//         created_at: new Date().toISOString()
//       }]);

//     if (pendingError) throw pendingError;

//     // Create and send transaction
//     const transaction = {
//       validUntil: Math.floor(Date.now() / 1000) + 60 * 20,
//       messages: [
//         {
//           address: DEPOSIT_ADDRESS,
//           amount: amountInNano.toString(),
//         },
//       ],
//     };

//     const [tonConnect] = tonConnectUI;
//     const result = await tonConnect.sendTransaction(transaction);

//     if (result) {
//       // Update deposit status
//       const { error: updateError } = await supabase
//         .from('deposits')
//         .update({ 
//           status: 'confirmed',
//           tx_hash: result.boc
//         })
//         .eq('id', depositId);

//       if (updateError) throw updateError;

//       // Update user balance using RPC
//       const { error: balanceError } = await supabase.rpc('update_user_deposit', {
//         p_user_id: user.id,
//         p_amount: amount,
//         p_deposit_id: depositId
//       });

//       if (balanceError) throw balanceError;

//       // Fetch updated user data
//       const { data: updatedUser } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', user.id)
//         .single();

//       if (updatedUser) {
//         // Update user data in context
//         updateUserData(updatedUser);

//         // Calculate new base rate with updated balance
//         const newBaseEarningRate = calculateEarningRate(updatedUser.balance, currentROI);
        
//         // Set new state with preserved earnings for top-ups
//         const newState = {
//           ...previousState,
//           baseEarningRate: newBaseEarningRate,
//           isActive: true,
//           currentEarnings: previousEarnings, // Preserve previous earnings for top-ups
//           lastUpdate: Date.now()
//         };

//         setEarningState(newState);
//         localStorage.setItem(EARNINGS_STORAGE_KEY, JSON.stringify(newState));

//         // Update earnings in database
//         await supabase
//           .from('user_earnings')
//           .upsert({
//             user_id: user.id,
//             current_earnings: previousEarnings,
//             last_update: new Date().toISOString(),
//             start_date: isNewUser ? new Date().toISOString() : undefined // Only set start_date for new users
//           }, {
//             onConflict: 'user_id'
//           });

//         showSnackbar({ 
//           message: isNewUser ? 'First Deposit Successful' : 'Top-up Successful', 
//           description: isNewUser
//             ? `Deposited ${amount.toFixed(2)} TON\nStaking journey begins!`
//             : `Deposited ${amount.toFixed(2)} TON\nCurrent earnings preserved: ${previousEarnings.toFixed(8)} TON`
//         });
//       }

//       setDepositStatus('success');
//       setShowDepositModal(false);
//     }
//   } catch (error) {
//     console.error('Deposit failed:', error);
//     setDepositStatus('error');
    
//     // Restore previous state on error
//     const savedState = localStorage.getItem(EARNINGS_STORAGE_KEY);
//     if (savedState) {
//       setEarningState(JSON.parse(savedState));
//     }
    
//     showSnackbar({ 
//       message: 'Deposit Failed', 
//       description: 'Please try again later' 
//     });
//   } finally {
//     setCustomAmount('');
//   }
// };


//   // Add this function to format earnings display
//   const formatEarnings = (amount: number): string => {
//     if (amount >= 1) {
//       return amount.toFixed(7);
//     } else {
//       return amount.toFixed(7);
//     }
//   };

//   // Update the earnings display in your JSX
//   const renderEarningsSection = () => (
//     <div className="flex items-center gap-2">
//       {user?.balance && user.balance > 0 ? (
//         <>
//           <div className="flex items-center gap-1.5">
//             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
//             <span className="text-xs text-blue-500">
//               +{formatEarnings(earningState.baseEarningRate)} TON/sec
//             </span>
//           </div>
//           <span className="text-xs text-white/40">
//             ({(earningState.baseEarningRate * 86400).toFixed(6)} TON/day)
//           </span>
//         </>
//       ) : (
//         <span className="text-xs text-white/40">
//           Deposit TON to start earning
//         </span>
//       )}
//     </div>
//   );

//   // Add effect to fetch and subscribe to activities
//   useEffect(() => {
//     const fetchActivities = async () => {
//       if (!user?.id) return;

//       setIsLoadingActivities(true);
//       try {
//         const { data, error } = await supabase
//           .from('activities')
//           .select('*')
//           .eq('user_id', user.id)
//           .order('created_at', { ascending: false })
//           .limit(10);

//         if (error) throw error;
//         setActivities(data || []);
//       } catch (error) {
//         console.error('Error fetching activities:', error);
//       } finally {
//         setIsLoadingActivities(false);
//       }
//     };

//     // Only fetch if activities tab is active
//     if (activeCard === 'activity') {
//       fetchActivities();

//       // Set up real-time subscription
//       const subscription = supabase
//         .channel('activities-channel')
//         .on(
//           'postgres_changes',
//           {
//             event: '*',
//             schema: 'public',
//             table: 'activities',
//             filter: `user_id=eq.${user?.id}`
//           },
//           (payload) => {
//             // Handle different types of changes
//             if (payload.eventType === 'INSERT') {
//               setActivities(prev => [payload.new as Activity, ...prev].slice(0, 10));
//             } else if (payload.eventType === 'UPDATE') {
//               setActivities(prev => 
//                 prev.map(activity => 
//                   activity.id === payload.new.id ? payload.new as Activity : activity
//                 )
//               );
//             } else if (payload.eventType === 'DELETE') {
//               setActivities(prev => 
//                 prev.filter(activity => activity.id !== payload.old.id)
//               );
//             }
//           }
//         )
//         .subscribe();

//         // Cleanup subscription
//         return () => {
//           supabase.removeChannel(subscription);
//         };
//       }
//     }, [user?.id, activeCard]);

//   // Helper function to format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     }).format(date);
//   };

//    // Update the activity card content
//  const renderActivityCard = () => (
//   <div className="relative">
//     {/* Header */}
//     <div className="flex items-center justify-between mb-4">
//       <div className="flex items-center gap-2">
//         <div className="w-8 h-8 relative">
//           <div className="absolute inset-0 bg-blue-500/20 rounded-lg rotate-45 animate-pulse" />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//         </div>
//         <div className="pixel-corners bg-[#2a2f4c] px-3 py-1">
//           <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Recent Activity</span>
//         </div>
//       </div>
//     </div>

//     {/* Activity List */}
//     <div className="space-y-3">
//       {isLoadingActivities ? (
//         <div className="flex items-center justify-center py-8">
//           <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       ) : activities.length > 0 ? (
//         activities.map((activity) => (
//           <div key={activity.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
//             <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
//               {getActivityIcon(activity.type)}
//             </div>
//             <div className="flex-1">
//               <div className="text-sm text-white">{getActivityDescription(activity)}</div>
//               <div className="text-xs text-white/40">{formatDate(activity.created_at)}</div>
//             </div>
//             <div className="text-right">
//   <div className={`text-sm font-medium ${
//     activity.type === 'nova_reward' 
//       ? 'text-purple-400' 
//       : 'text-white'
//   }`}>
//     {activity.amount.toFixed(9)} {activity.type === 'nova_reward' ? 'NOVA' : 'TON'}
//   </div>
//   <div className="text-xs text-white/40">{activity.status}</div>
// </div>
//           </div>
//         ))
//       ) : (
//         <div className="text-center py-8 text-white/40">
//           No recent activity
//         </div>
//       )}
//     </div>
//   </div>
// );

//   // Activity card content
//   const getActivityIcon = (type: Activity['type']) => {
//     switch (type) {
//       case 'deposit':
//         return <FaCoins className="w-4 h-4 text-blue-400" />;
//       case 'withdrawal':
//         return <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//         </svg>;
//       case 'stake':
//         return <BiNetworkChart className="w-4 h-4 text-purple-400" />;
//       case 'redeposit':
//         return <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//         </svg>;
//       case 'nova_reward':
//         return <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>;
//       case 'nova_income':
//         return <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//         </svg>;
//       case 'offline_reward':
//         return <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//         </svg>;
//       case 'earnings_update':
//         return <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//         </svg>;
//       case 'claim':
//         return <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//         </svg>;
//       case 'transfer':
//         return <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//         </svg>;
//       case 'reward':
//         return <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//         </svg>;
//       case 'bonus':
//         return <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//         </svg>;
//       default:
//         return null;
//     }
//   };

//   // Add useEffect to fetch price
//   useEffect(() => {
//     const fetchPrice = async () => {
//       const price = await getTONPrice();
//       setTonPrice(price);
//     };

//     fetchPrice();

//     // Update price every 60 seconds
//     const interval = setInterval(fetchPrice, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (user && !isLoading) {
//       const hasSeenOnboarding = localStorage.getItem(`onboarding_${user.telegram_id}`);
//       const isNewUser = user.total_deposit === 0;

//       if (!hasSeenOnboarding || isNewUser) {
//         setShowOnboarding(true);
//         const timer = setTimeout(() => {
//           setShowOnboarding(false);
//           localStorage.setItem(`onboarding_${user.telegram_id}`, 'true');
//         }, 14000); // 2s loading + (4 steps × 3s)
//         return () => clearTimeout(timer);
//       }
//     }
//   }, [user, isLoading]);

//   // Add this effect to handle offline earnings
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') {
//         // App became visible, calculate offline earnings
//         const offlineState = loadOfflineEarnings();
//         if (offlineState && earningState.isActive) {
//           const now = Date.now();
//           const secondsElapsed = (now - offlineState.lastActiveTimestamp) / 1000;
//           const offlineEarnings = offlineState.baseEarningRate * secondsElapsed;

//           if (offlineEarnings > 0) {
//             setEarningState(prev => ({
//               ...prev,
//               currentEarnings: prev.currentEarnings + offlineEarnings,
//               lastUpdate: now
//             }));

//             showSnackbar({
//               message: 'Offline Earnings Added',
//               description: `You earned ${offlineEarnings.toFixed(8)} TON while offline`
//             });
//           }
//         }
//       } else {
//         // App is going to background, save current state
//         if (earningState.isActive) {
//           saveOfflineEarnings({
//             lastActiveTimestamp: Date.now(),
//             baseEarningRate: earningState.baseEarningRate
//           });
//         }
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [earningState]);

//   // Update the earning effect to include offline earnings
//   useEffect(() => {
//     if (!user?.id || !user.balance) return;

//     const initializeEarningState = async () => {
//       try {
//         // Fetch current earnings from server
//         const { data: serverData } = await supabase
//           .from('user_earnings')
//           .select('current_earnings, last_update, start_date')
//           .eq('user_id', user.id)
//           .single();

//         const now = Date.now();
//         const newRate = calculateEarningRate(user.balance, currentROI);
        
//         // Load saved earnings from localStorage
//         const savedEarnings = localStorage.getItem(getUserEarningsKey(user.id));
//         const localEarnings = savedEarnings ? JSON.parse(savedEarnings).currentEarnings : 0;
        
//         if (serverData) {
//           const startDate = new Date(serverData.start_date).getTime();
//           const lastUpdateTime = new Date(serverData.last_update).getTime();
//           const secondsElapsed = (now - lastUpdateTime) / 1000;
          
//           // Use the higher value between server and local storage to prevent resets
//           const baseEarnings = Math.max(serverData.current_earnings, localEarnings);
//           const accumulatedEarnings = (newRate * secondsElapsed) + baseEarnings;

//           const newState = {
//             lastUpdate: now,
//             currentEarnings: accumulatedEarnings,
//             baseEarningRate: newRate,
//             isActive: user.balance > 0,
//             startDate: startDate
//           };
          
//           setEarningState(newState);
//           saveEarningState(newState);
          
//           // Sync with server to ensure consistency
//           await supabase
//             .from('user_earnings')
//             .upsert({
//               user_id: user.id,
//               current_earnings: accumulatedEarnings,
//               last_update: new Date(now).toISOString(),
//               start_date: new Date(startDate).toISOString()
//             }, {
//               onConflict: 'user_id'
//             });

//         } else {
//           // Initialize new earning state, preserving any existing earnings
//           const newState = {
//             lastUpdate: now,
//             currentEarnings: localEarnings, // Use any existing local earnings
//             baseEarningRate: newRate,
//             isActive: user.balance > 0,
//             startDate: now
//           };

//           // Create initial server record with preserved earnings
//           await supabase
//             .from('user_earnings')
//             .insert({
//               user_id: user.id,
//               current_earnings: localEarnings, // Preserve existing earnings
//               last_update: new Date(now).toISOString(),
//               start_date: new Date(now).toISOString()
//             });

//           setEarningState(newState);
//           saveEarningState(newState);
//         }

//         // Set up periodic sync
//         const syncInterval = setInterval(async () => {
//           const currentState = JSON.parse(localStorage.getItem(getUserEarningsKey(user.id)) || '{}');
//           if (currentState.currentEarnings) {
//             await supabase
//               .from('user_earnings')
//               .upsert({
//                 user_id: user.id,
//                 current_earnings: currentState.currentEarnings,
//                 last_update: new Date().toISOString()
//               }, {
//                 onConflict: 'user_id'
//               });
//           }
//         }, EARNINGS_SYNC_INTERVAL);

//         return () => clearInterval(syncInterval);

//       } catch (error) {
//         console.error('Error initializing earning state:', error);
//       }
//     };

//     initializeEarningState();

//     // Set up earnings calculation interval
//     const earningsInterval = setInterval(() => {
//       setEarningState(prevState => {
//         const now = Date.now();
//         const secondsElapsed = (now - prevState.lastUpdate) / 1000;
//         const newEarnings = prevState.currentEarnings + (prevState.baseEarningRate * secondsElapsed);
        
//         const newState = {
//           ...prevState,
//           lastUpdate: now,
//           currentEarnings: newEarnings
//         };
        
//         // Save to localStorage with user-specific key
//         localStorage.setItem(getUserEarningsKey(user.id!), JSON.stringify(newState));
        
//         return newState;
//       });
//     }, EARNINGS_UPDATE_INTERVAL);

//     return () => {
//       clearInterval(earningsInterval);
//       // Save final state before unmounting
//       const finalState = earningState;
//       localStorage.setItem(getUserEarningsKey(user.id), JSON.stringify(finalState));
      
//       // Final sync with server using IIFE
//       (async () => {
//         try {
//           await supabase
//             .from('user_earnings')
//             .upsert({
//               user_id: user.id,
//               current_earnings: finalState.currentEarnings,
//               last_update: new Date().toISOString()
//             }, {
//               onConflict: 'user_id'
//             });
//           console.log('Final earnings sync completed');
//         } catch (err) {
//           console.error('Error in final earnings sync:', err);
//         }
//       })();
//     };
//   }, [user?.id, user?.balance, currentROI]);

//   // Add this state
//   const [showOfflineRewardsModal, setShowOfflineRewardsModal] = useState(false);
//   const [offlineRewardsAmount, setOfflineRewardsAmount] = useState(0);

//   // Update the offline earnings handling
//   useEffect(() => {
//     if (!user?.id || !user.balance) return;

//     // Load offline earnings on mount
//     const offlineState = loadOfflineEarnings();
//     if (offlineState && earningState.isActive) {
//       const now = Date.now();
//       const secondsElapsed = (now - offlineState.lastActiveTimestamp) / 1000;
//       const offlineEarnings = offlineState.baseEarningRate * secondsElapsed;

//       if (offlineEarnings > 0) {
//         setOfflineRewardsAmount(offlineEarnings);
//         setShowOfflineRewardsModal(true);
//       }
//     }

//     // Clear offline earnings state
//     localStorage.removeItem(OFFLINE_EARNINGS_KEY);
//   }, [user?.id, user?.balance, currentROI]);

//   // Update handleClaimOfflineRewards
//   const handleClaimOfflineRewards = async () => {
//     if (!user?.id) return;

//     try {
//       const savedEarnings = localStorage.getItem(getUserEarningsKey(user.id));
//       const currentEarnings = savedEarnings 
//         ? JSON.parse(savedEarnings).currentEarnings 
//         : 0;

//       const newEarnings = currentEarnings + offlineRewardsAmount;
//       const newNovaBalance = (user.total_sbt || 0) + (offlineRewardsAmount * 0.1);

//       // Update local storage first with user-specific key
//       const newEarningState = {
//         ...earningState,
//         currentEarnings: newEarnings,
//         lastUpdate: Date.now()
//       };
//       localStorage.setItem(getUserEarningsKey(user.id), JSON.stringify(newEarningState));
//       setEarningState(newEarningState);

//       // Silent database updates
//       await Promise.all([
//         supabase
//           .from('users')
//           .update({ 
//             total_sbt: newNovaBalance,
//             total_earned: newEarnings
//           })
//           .eq('id', user.id),
        
//         supabase
//           .from('user_earnings')
//           .upsert({
//             user_id: user.id,
//             current_earnings: newEarnings,
//             last_update: new Date().toISOString()
//           }, {
//             onConflict: 'user_id'
//           }),

//         supabase
//           .from('activities')
//           .insert({
//             user_id: user.id,
//             type: 'nova_income',
//             amount: offlineRewardsAmount,
//             status: 'completed',
//             created_at: new Date().toISOString()
//           })
//       ]);

//       showSnackbar({
//         message: 'Rewards Claimed',
//         description: `Added ${offlineRewardsAmount.toFixed(8)} TON + ${(offlineRewardsAmount * 0.1).toFixed(8)} NOVA`
//       });

//       setShowOfflineRewardsModal(false);
//       setOfflineRewardsAmount(0);
//     } catch (error) {
//       console.error('Error claiming rewards:', error);
//       showSnackbar({
//         message: 'Claim Failed',
//         description: 'Please try again later'
//       });
//     }
//   };

//   // Add this state for live progress
//   const [, setStakingProgress] = useState(0);

//   // Add this effect for live progress updates
//   useEffect(() => {
//     if (user?.last_deposit_date) {
//       setStakingProgress(calculateStakingProgress(user.last_deposit_date));
//     }
//   }, [user?.last_deposit_date]);

//   // Add this helper function to calculate potential earnings
//   const calculatePotentialEarnings = (balance: number): number => {
//     let totalEarnings = 0;
//     let currentROI = 0.01; // Starting at 1%
    
//     // Calculate for 100 days with ROI increasing every 5 days
//     for (let day = 1; day <= 100; day++) {
//       // Increase ROI by 0.5% every 5 days
//       if (day % 5 === 0) {
//         currentROI += 0.005; // Add 0.5%
//       }
      
//       // Add daily earnings
//       totalEarnings += balance * currentROI;
//     }
    
//     return totalEarnings;
//   };

//   // Add state
//   const [showWithdrawalInfo, setShowWithdrawalInfo] = useState(false);


//   // Add new state variables at the top with other state declarations
//   const [isInitializing, setIsInitializing] = useState(true);
//   // const [isNewUser, setNewUser] = useState(false);

//   // Update the earnings initialization effect
//   useEffect(() => {
//     if (!user?.id || !user.balance) {
//       setIsInitializing(false);
//       return;
//     }

//     const initializeEarningState = async () => {
//       try {
//         setIsInitializing(true);

//         // Check if user exists in user_earnings
//         const { data: serverData } = await supabase
//           .from('user_earnings')
//           .select('current_earnings, last_update, start_date')
//           .eq('user_id', user.id)
//           .single();

//         const now = Date.now();
//         const newRate = calculateEarningRate(user.balance, currentROI);
        
//         if (serverData) {
//           // Existing user logic - preserve earnings on top-up
//           const startDate = new Date(serverData.start_date).getTime();
//           const lastUpdateTime = new Date(serverData.last_update).getTime();
//           const secondsElapsed = (now - lastUpdateTime) / 1000;
          
//           // Preserve existing earnings and add new accumulated earnings
//           const baseEarnings = serverData.current_earnings || 0;
//           const accumulatedEarnings = (newRate * secondsElapsed) + baseEarnings;

//           // Update earnings state with preserved earnings
//           setEarningState({
//             lastUpdate: now,
//             currentEarnings: accumulatedEarnings,
//             baseEarningRate: newRate,
//             isActive: user.balance > 0,
//             startDate: startDate // Keep original start date
//           });

//           // Update database with new earnings
//           await supabase
//             .from('user_earnings')
//             .update({
//               current_earnings: accumulatedEarnings,
//               last_update: new Date(now).toISOString()
//               // Don't update start_date to preserve original staking start
//             })
//             .eq('user_id', user.id);

//         } else {
//           // New user logic - start with 0 earnings
//           const newState = {
//             lastUpdate: now,
//             currentEarnings: 0,
//             baseEarningRate: newRate,
//             isActive: user.balance > 0,
//             startDate: now
//           };

//           // Initialize new user in database
//           await supabase
//             .from('user_earnings')
//             .insert({
//               user_id: user.id,
//               current_earnings: 0,
//               last_update: new Date(now).toISOString(),
//               start_date: new Date(now).toISOString()
//             });

//           setEarningState(newState);
//         }
//       } catch (error) {
//         console.error('Error initializing earning state:', error);
//       } finally {
//         setIsInitializing(false);
//       }
//     };

//     initializeEarningState();
    
//     // Set up earnings calculation interval
//     const earningsInterval = setInterval(() => {
//       setEarningState(prevState => {
//         const now = Date.now();
//         const secondsElapsed = (now - prevState.lastUpdate) / 1000;
        
//         // Calculate new earnings based on current rate and elapsed time
//         const newEarnings = prevState.currentEarnings + (prevState.baseEarningRate * secondsElapsed);
        
//         const newState = {
//           ...prevState,
//           lastUpdate: now,
//           currentEarnings: newEarnings,
//           baseEarningRate: calculateEarningRate(user.balance, currentROI) // Update rate based on new balance
//         };
        
//         // Save to localStorage
//         localStorage.setItem(getUserEarningsKey(user.id), JSON.stringify(newState));
        
//         return newState;
//       });
//     }, EARNINGS_UPDATE_INTERVAL);

//     return () => clearInterval(earningsInterval);
//   }, [user?.id, user?.balance, currentROI]);

//   // Add state for managing withdrawal modal and loading state
//   const [isRestaking, setIsRestaking] = useState(false);

//   // Update handleRestake function
//   const handleRestake = async () => {
//     if (isRestaking) return; // Prevent double clicks
    
//     try {
//       setIsRestaking(true);
//       const totalAmount = (user?.balance || 0) + earningState.currentEarnings;
      
//       const { error } = await supabase.rpc('update_user_restake', {
//         p_user_id: user?.id,
//         p_amount: totalAmount,
//         p_deposit_date: new Date().toISOString()
//       });

//       if (error) throw error;

//       // Reset earnings state
//       setEarningState({
//         lastUpdate: Date.now(),
//         currentEarnings: 0,
//         baseEarningRate: calculateEarningRate(totalAmount, currentROI),
//         isActive: true,
//         startDate: Date.now()
//       });

//       // Update user data
//       if (user) {
//         updateUserData({
//           ...user,
//           balance: totalAmount,
//           last_deposit_date: new Date().toISOString()
//         });
//       }

//       showSnackbar({
//         message: 'Restake Successful',
//         description: `Restaked ${totalAmount.toFixed(8)} TON`
//       });
//     } catch (error) {
//       console.error('Restake failed:', error);
//       showSnackbar({
//         message: 'Restake Failed',
//         description: 'Please try again later'
//       });
//     } finally {
//       setIsRestaking(false);
//       setShowWithdrawalInfo(false); // Close modal after operation completes
//     }
//   };

//   // Update the main return statement to handle loading, new user, and no stake states
//   if (isLoading || isInitializing) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#0A0A0F]">
//         <div className="text-center">
//           <div className="w-16 h-16 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-blue-400">{isInitializing ? 'Initializing your account...' : 'Loading...'}</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#0A0A0F]">
//         {/* Error message component */}
//       </div>
//     );
//   }

//   // Show onboarding for new users or users with no balance
//   if (user && (!user.balance || user.balance === 0)) {
//     return <OnboardingScreen />;
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-[#0A0A0F] text-white antialiased mb-[3.7rem]">
//       {!isLoading && user && showOnboarding && <OnboardingScreen />}
//       {/* Header */}
//       <div className="px-2 py-4 flex justify-between items-center sticky top-0 bg-gradient-to-b from-black via-black/95 to-black/90 backdrop-blur-xl z-50 border-b border-white/5">
//         <div className="flex items-center gap-4">
//           {/* User Profile Section */}
//           <div className="flex items-center gap-3">
//             {/* Avatar with Animated Border */}
//             <div className="relative">
//               <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-75 blur-sm animate-gradient-slow"></div>
//               <div className="relative">
//                 <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/10 bg-gradient-to-br from-[#1a1c2e] to-[#0d0f1d]">
//                   <img 
//                     src="https://xelene.me/telegram.gif" 
//                     alt="" 
//                     className="w-full h-full object-cover"
//                   />
//                   {/* Online Status Indicator */}
//                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
//                 </div>
//               </div>
//             </div>

//             {/* User Info */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium text-white">
//                   {user?.username ? `@${user.username}` : '@username'}
//                 </span>
//                 {/* Verified Badge - if needed */}
//                 <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="flex items-center gap-2">
//                 {/* User Name */}
//                 <span className="text-xs text-white/60 truncate max-w-[120px]">
//                   {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'User Name'}
//                 </span>
//                 {user?.rank && (
//                   <div className="pixel-corners bg-blue-500/20 px-2 py-0.5 hidden">
//                     <span className="text-[10px] font-medium text-blue-400 uppercase tracking-wider">
//                       {user.rank}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Section with Connect Button and Optional Menu */}
//         <div className="flex items-center gap-3">
//           {/* Optional Network Status */}
//           <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
//             <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
//             <span className="text-xs text-white/60">Mainnet</span>
//           </div>

//           {/* Connect Button with Custom Styling */}
//           <TonConnectButton />
//         </div>
//       </div>

//       {/* Network Status Bar */}
//       <div className="flex items-center justify-between gap-2 px-4 py-2 bg-[#1A1B1E]/50 border-b border-white/5">
//         {/* Wallet Balance */}
//         <div className="flex items-center gap-2">
//           <div className="px-2 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
//             <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//             </svg>
//             {isLoadingBalance ? (
//               <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
//             ) : (
//               <span className="text-xs font-medium text-white/80">
//                 {Number(walletBalance).toFixed(2)} TON
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Network Info - Existing Code */}
//         <div className="flex items-center gap-2 text-xs text-white/60">
//           <span className="hidden sm:inline">Connected to:</span>
//           {/* Blockchain Badge */}
//           <div className="px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-1.5">
//             <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
//             </svg>
//             <span className="text-xs font-medium text-blue-400">
//               <span className="hidden sm:inline">TON Blockchain</span>
//               <span className="sm:hidden">TON</span>
//             </span>
//           </div>
          
//           {/* Network Badge */}
//           <div className={`px-2 py-1 rounded-full flex items-center gap-1.5 ${
//             isMainnet 
//               ? 'bg-green-500/10 border border-green-500/20' 
//               : 'bg-yellow-500/10 border border-yellow-500/20'
//           }`}>
//             <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
//               isMainnet ? 'bg-green-400' : 'bg-yellow-400'
//             }`} />
//             <span className={`text-xs font-medium ${
//               isMainnet ? 'text-green-400' : 'text-yellow-400'
//             }`}>
//               {NETWORK_NAME}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1">
//         {currentTab === 'home' && (
//           <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
        
//              {/* Stake Card */}
//              <div className="relative shadow-xl relative overflow-visible">
//               {/* Balance Display with Game UI */}
//               <div className="relative p-4 rounded-lg bg-black/30 border border-green-500/20 backdrop-blur-sm">
//               <div className="absolute inset-0 bg-grid-green/[0.02] bg-[length:20px_20px]" />
//               <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent" />

//                 {/* Animated Corner Decorations */}
//                 <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-400/50" />
//                 <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-green-400/50" />
//                 <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-green-400/50" />
//                 <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-green-400/50" />
                
//                 {/* Animated Background Grid */}
//                 <div className="absolute inset-0 bg-grid-green/[0.02] bg-[length:20px_20px] animate-grid-flow opacity-50" />
                
//                 <div className="relative z-10">
//                   {/* Balance Amount with Glow Effect */}
//                   <div className="flex items-baseline justify-between gap-2 mb-3">
//                     <div className="space-y-1">
//                     <div className="flex justify-between items-center mb-3">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
//                   <span className="text-sm font-medium text-white/80">My Staked</span>
//                 </div>
//               </div>
//                       <div className="flex items-baseline gap-2">
//                         <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
//                           {user?.balance?.toFixed(2) || '0.00'}
//                         </span>
//                         <span className="text-sm font-medium text-white/60">TON</span>
//                         <span className="pixel-corners bg-white/5 px-2 py-0.5">
//                           <span className="text-xs text-white/40">≈ ${((user?.balance ?? 0) * tonPrice).toFixed(2)}</span>
//                         </span>
//                       </div>
//                     </div>
//                     {user?.balance && user.balance > 0 ? (
//                    <button
//                    onClick={() => setShowDepositModal(true)}
//                    className="flex items-center gap-2 px-2 py-2 bg-blue-500/10 hover:bg-blue-500/20 
//                      border border-blue-500/30 rounded-lg transition-all duration-200"
//                  >
//                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping opacity-75" />
//                    <span className="text-sm font-medium text-blue-400">TOP UP</span>
//                  </button>
//                 ) : (
//                   <button
//                     onClick={() => setShowDepositModal(true)}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 
//                       border border-blue-500/30 rounded-lg transition-all duration-200"
//                   >
//                     <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping opacity-75" />
//                     <span className="text-xs font-medium text-blue-400">DEPOSIT</span>
//                   </button>
//                 )}
//                   </div>

//                   {/* Stake Status and Progress */}
//                   {user?.balance && user.balance > 0 ? (
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between text-xs text-white/60">
//                         <ReStakeCountdown depositDate={new Date(user.last_deposit_date || Date.now())} />
//                       </div>
                      
//                       {/* Progress Bar with Glow */}
//                       <div className="relative h-2 bg-blue-900/20 rounded-full overflow-hidden">
//                         <div className="absolute inset-0 bg-grid-blue/[0.05] bg-[length:8px_8px]" />
//                         <div 
//                           className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000
//                                     after:absolute after:inset-0 after:bg-green-400/20 after:blur-lg"
//                           style={{ width: `${calculateStakingProgress(user?.last_deposit_date || new Date())}%` }}
//                         />
//                       </div>

                     
//                     </div>
//                   ) : (
//                     <div className="text-sm text-white/40 flex items-center gap-2">
//                       <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                       </svg>
//                       Start staking to begin your journey
//                     </div>
//                   )}
//                 </div>

//               </div>
//             </div>

//             {/* Earnings Card */}
//             <div className="relative p-4 rounded-lg bg-black/30 border border-green-500/20 backdrop-blur-sm">
//                 {/* Animated Corner Decorations */}
//                 <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-400/50" />
//                 <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-green-400/50" />
//                 <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-green-400/50" />
//                 <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-green-400/50" />
//                               <div className="flex justify-between items-center mb-3">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
//                   <span className="text-sm font-medium text-white/80">Available Earnings</span>
//                 </div>
//                 <button
//                   onClick={() => setShowWithdrawalInfo(true)}
//                   className={`flex items-center gap-2 px-2 py-2 bg-green-500/10 hover:bg-green-500/20 
//                      border border-green-500/30 rounded-lg transition-all duration-200
//                     ${isWithdrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping opacity-75" />
//                   <span className="text-xs font-medium text-green-400">WITHDRAW</span>
//                 </button>
//               </div>

//               <div className="flex items-baseline mb-2 gap-2">
//                     <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
//                       {formatEarnings(earningState.currentEarnings)}
//                     </span>
//                     <span className="text-sm font-medium text-white/60">TON</span>
//                     <span className="pixel-corners bg-white/5 px-2 py-0.5">
//                       <span className="text-xs text-white/40">≈ ${(earningState.currentEarnings * tonPrice).toFixed(2)}</span>
//                     </span>
//                   </div>

//               {renderEarningsSection()}
//                {/* Add Progress Bar */}
//                {!user?.balance || user.balance <= 0 ? (
//                 <div className="mt-4 text-center text-white/40 text-sm">
//                   Start staking to see your earnings progress!
//                 </div>
//               ) : (
//                 <div className="mt-4">
                 
//                   {/* Add potential earnings info */}
//                   <div className="grid grid-cols-2 gap-2">
//                         {[
//                           { label: 'Potential Earnings', value: `${formatEarnings(calculatePotentialEarnings(user.balance))} TON`, highlight: true },
//                           { label: 'Nova Balance', value: `${(user.total_sbt ?? 0).toFixed(8)} NOVA` }
//                         ].map((stat, index) => (
//                           <div key={index} className="pixel-corners bg-black/30 p-2 border border-green-500/10">
//                             <div className="text-xs text-white/60">{stat.label}</div>
//                             <div className={`text-xs font-medium ${stat.highlight ? 'text-green-400' : 'text-white'} mt-1`}>
//                               {stat.value}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                 </div>
//               )}
//             </div>

           
//             {/* Card Navigation */}
//             <div className="flex items-center gap-2 px-1">
//               {/* Stats Button */}
//               <button
//                 onClick={() => setActiveCard('stats')}
//                 className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium 
//                   transition-all duration-300 overflow-hidden
//                   ${activeCard === 'stats'
//                     ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
//                     : 'bg-white/5 text-white/40 hover:text-white/80 hover:bg-white/10'
//                   }`}
//               >
//                 {/* Background Effects */}
//                 <div className={`absolute inset-0 bg-grid-white/[0.02] bg-[length:8px_8px] 
//                   transition-opacity duration-300
//                   ${activeCard === 'stats' ? 'opacity-100' : 'opacity-0'}`} 
//                 />
//                 <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 
//                   transition-opacity duration-300
//                   ${activeCard === 'stats' ? 'opacity-100' : 'opacity-0'}`} 
//                 />
                
//                 {/* Icon and Text Container */}
//                 <div className="relative flex items-center gap-2">
//                   {/* Animated Icon */}
//                   <div className={`w-4 h-4 rounded flex items-center justify-center
//                     transition-all duration-300 transform
//                     ${activeCard === 'stats' 
//                       ? 'scale-110 text-blue-400' 
//                       : 'text-white/40 group-hover:text-white/60'}`}
//                   >
//                     <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                         d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
//                     />
//                   </svg>
//                 </div>

//                 {/* Text with Glow Effect */}
//                 <span className={`relative transition-all duration-300
//                   ${activeCard === 'stats' 
//                     ? 'after:content-[""] after:absolute after:inset-0 after:bg-blue-400/20 after:blur-lg after:opacity-75'
//                     : ''}`}
//                 >
//                   Analytics
//                 </span>

//                 {/* Active Indicator Dot */}
//                 <div className={`absolute -right-1 -top-1 w-2 h-2 rounded-full 
//                   transition-all duration-300 transform
//                   ${activeCard === 'stats'
//                     ? 'bg-blue-400 scale-100 opacity-100'
//                     : 'scale-0 opacity-0'}`}
//                 />
//               </div>
//             </button>

//             {/* Activity Button */}
//             <button
//               onClick={() => setActiveCard('activity')}
//               className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium 
//                 transition-all duration-300 overflow-hidden
//                 ${activeCard === 'activity'
//                   ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 shadow-lg shadow-green-500/20'
//                   : 'bg-white/5 text-white/40 hover:text-white/80 hover:bg-white/10'
//                 }`}
//             >
//               {/* Background Effects */}
//               <div className={`absolute inset-0 bg-grid-white/[0.02] bg-[length:8px_8px] 
//                 transition-opacity duration-300
//                 ${activeCard === 'activity' ? 'opacity-100' : 'opacity-0'}`} 
//               />
//               <div className={`absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 
//                 transition-opacity duration-300
//                 ${activeCard === 'activity' ? 'opacity-100' : 'opacity-0'}`} 
//               />
              
//               {/* Icon and Text Container */}
//               <div className="relative flex items-center gap-2">
//                 {/* Animated Icon */}
//                 <div className={`w-4 h-4 rounded flex items-center justify-center
//                   transition-all duration-300 transform
//                   ${activeCard === 'activity' 
//                     ? 'scale-110 text-green-400' 
//                     : 'text-white/40 group-hover:text-white/60'}`}
//                 >
//                   <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                       d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
//                     />
//                   </svg>
//                 </div>

//                 {/* Text with Glow Effect */}
//                 <span className={`relative transition-all duration-300
//                   ${activeCard === 'activity' 
//                     ? 'after:content-[""] after:absolute after:inset-0 after:bg-green-400/20 after:blur-lg after:opacity-75'
//                     : ''}`}
//                 >
//                   Activity
//                 </span>

//                 {/* Active Indicator Dot */}
//                 <div className={`absolute -right-1 -top-1 w-2 h-2 rounded-full 
//                   transition-all duration-300 transform
//                   ${activeCard === 'activity'
//                     ? 'bg-green-400 scale-100 opacity-100'
//                     : 'scale-0 opacity-0'}`}
//                 />
//               </div>
//             </button>

//             {/* Community Button */}
//             <button
//               onClick={() => setActiveCard('community')}
//               className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium 
//                 transition-all duration-300 overflow-hidden
//                 ${activeCard === 'community'
//                   ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 shadow-lg shadow-purple-500/20'
//                   : 'bg-white/5 text-white/40 hover:text-white/80 hover:bg-white/10'
//                 }`}
//             >
//               {/* Background Effects */}
//               <div className={`absolute inset-0 bg-grid-white/[0.02] bg-[length:8px_8px] 
//                 transition-opacity duration-300
//                 ${activeCard === 'community' ? 'opacity-100' : 'opacity-0'}`} 
//               />
//               <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/10 
//                 transition-opacity duration-300
//                 ${activeCard === 'community' ? 'opacity-100' : 'opacity-0'}`} 
//               />
              
//               {/* Icon and Text Container */}
//               <div className="relative flex items-center gap-2">
//                 {/* Animated Icon */}
//                 <div className={`w-4 h-4 rounded flex items-center justify-center
//                   transition-all duration-300 transform
//                   ${activeCard === 'community' 
//                     ? 'scale-110 text-purple-400' 
//                     : 'text-white/40 group-hover:text-white/60'}`}
//                 >
//                   <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                       d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
//                     />
//                   </svg>
//                 </div>

//                 {/* Text with Glow Effect */}
//                 <span className={`relative transition-all duration-300
//                   ${activeCard === 'community' 
//                     ? 'after:content-[""] after:absolute after:inset-0 after:bg-purple-400/20 after:blur-lg after:opacity-75'
//                     : ''}`}
//                 >
//                   Community
//                 </span>

//                 {/* Active Indicator Dot */}
//                 <div className={`absolute -right-1 -top-1 w-2 h-2 rounded-full 
//                   transition-all duration-300 transform
//                   ${activeCard === 'community'
//                     ? 'bg-purple-400 scale-100 opacity-100'
//                     : 'scale-0 opacity-0'}`}
//                 />
//               </div>
//             </button>
//           </div>

//             {/* Card Content */}
        
//           {/* Card Content */}
//           <div className="space-y-6">
//             {activeCard === 'stats' && (
//               <>
//                 {/* Staking Details */}
//                 <div className="relative">
//                   <div className="grid grid-cols-2 gap-3">
//                   {/* Total Deposited */}
//                   <StatsCard
//                     title="Nova Power"
//                     value={`${user?.balance?.toFixed(2) ?? 0} TON`}
//                     subValue={`≈ $${((user?.balance ?? 0) * tonPrice).toFixed(2)}`}
//                     icon={<FaCoins className="w-4 h-4 text-blue-300" />}
//                     bgColor="bg-blue-500/20"
//                   />

//                   {/* Total Withdrawn */}
//                   <StatsCard
//                     title="Claimable"
//                     value={`${user?.total_withdrawn?.toFixed(2) ?? 0} TON`}
//                     subValue={`≈ $${((user?.total_withdrawn ?? 0) * tonPrice).toFixed(2)}`}
//                     icon={<svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>}
//                     bgColor="bg-green-500/20"
//                   />

//                   {/* Total Earned */}
//                   <StatsCard
//                     title="Earnings"
//                     value={`${(loadTotalEarned() + earningState.currentEarnings).toFixed(2)} TON`}
//                     subValue={`≈ $${((loadTotalEarned() + earningState.currentEarnings) * (tonPrice || 0)).toFixed(4)}`}
//                     icon={<svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>}
//                     bgColor="bg-yellow-500/20"
//                   />

//                   {/* Reputation Points */}
//                   <StatsCard
//                     title="Nova Token"
//                     value={`${user?.total_sbt?.toFixed(2) ?? 0} NOVA`}
//                     subValue={`Level ${Math.floor((user?.total_sbt ?? 0) / 100) + 1}`}
//                     icon={<svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                     </svg>}
//                     bgColor="bg-purple-500/20"
//                   />

//   <StatsCard
// title="Wallet Address"
// value={userFriendlyAddress || 'Not connected'}
// icon={<FaWallet />}
// bgColor="bg-purple-500/20"
// className="hidden" // Add this line
//                 />
//               </div>
//                 </div>
//               </>
//             )}

//             {activeCard === 'activity' && renderActivityCard()}

//             {activeCard === 'community' && (
//               <div className="space-y-4">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 relative">
//                       <div className="absolute inset-0 bg-purple-500/20 rounded-lg rotate-45 animate-pulse" />
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                             d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
//                           </svg>
//                       </div>
//                     </div>
//                     <div className="pixel-corners bg-[#2a2f4c] px-3 py-1">
//                       <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Community Updates</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Updates List */}
//                 <div className="space-y-4">
//                   {[
//                     {
//                       title: "Nova Staking Launch 🚀",
//                       date: "March 2024",
//                       description: "Experience the future of staking with enhanced rewards and community features.",
//                       status: "Live"
//                     },
//                     {
//                       title: "Community Rewards Program",
//                       date: "Coming Soon",
//                       description: "Earn extra rewards for active participation and community engagement.",
//                       status: "Upcoming"
//                     },
//                     {
//                       title: "Nova Token Integration",
//                       date: "In Development",
//                       description: "New utility features and governance capabilities coming to NOVA token holders.",
//                       status: "Development"
//                     }
//                   ].map((update, index) => (
//                     <div key={index} className="relative p-4 rounded-lg bg-black/30 border border-purple-500/20 backdrop-blur-sm">
//                       <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-purple-400/50" />
//                       <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-purple-400/50" />
//                       <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-purple-400/50" />
//                       <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-purple-400/50" />
                      
//                       <div className="flex justify-between items-start mb-2">
//                         <h3 className="text-lg font-medium text-white">{update.title}</h3>
//                         <span className={`pixel-corners px-2 py-0.5 text-xs font-medium
//                           ${update.status === 'Live' ? 'bg-green-500/20 text-green-400' :
//                             update.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400' :
//                             'bg-purple-500/20 text-purple-400'}`}>
//                           {update.status}
//                         </span>
//                       </div>
                      
//                       <p className="text-sm text-white/60 mb-2">{update.description}</p>
                      
//                       <div className="flex items-center gap-2 text-xs text-white/40">
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                             d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                         {update.date}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//           </div>
//         )}

//         {currentTab === 'network' && (
//           <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
//             <ReferralSystem 
//             />
//           </div>
//         )}

//         {currentTab === 'gmp' && (
//           <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
//             <GMPLeaderboard />
//           </div>
//         )}

//         {currentTab === 'tasks' && (
//           <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
//            <SocialTasks showSnackbar={showSnackbar}/>
//           </div>
//         )}

//         {currentTab === 'token' && (
//           <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
//             <TokenLaunchpad />
//           </div>
//         )}
//       </div>

//        {/* Deposit Modal */}
//     {showDepositModal && (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//         <div className="bg-gradient-to-b from-[#1a1c2e] to-[#0d0f1d] rounded-xl w-full max-w-md border-2 border-blue-500/20 shadow-xl shadow-blue-500/10">
//           <div className="p-4">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 relative">
//                   <div className="absolute inset-0 bg-blue-500/20 rounded-lg rotate-45 animate-pulse" />
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="pixel-corners bg-[#2a2f4c] px-3 py-1">
//                   <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
//                     {user?.balance && user.balance > 0 ? 'Top Up TON' : 'Deposit TON'}
//                   </span>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => {
//                   setShowDepositModal(false);
//                   setDepositStatus('idle');
//                   setCustomAmount('');
//                 }}
//                 className="text-white/60 hover:text-white"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {depositStatus === 'pending' ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
//                 <p className="text-white font-medium">Processing Deposit...</p>
//                 <p className="text-sm text-white/60 mt-2">Please wait while we confirm your transaction</p>
//               </div>
//             ) : (
//               <>
//                 {/* Quick Select Grid */}
//                 <div className="grid grid-cols-3 gap-2 mb-4">
//                   {[1, 5, 10, 50, 100, 500].map((amount) => (
//                     <button
//                       key={amount}
//                       onClick={() => {
//                         setCustomAmount(amount.toString());
//                         handleDeposit(amount);
//                       }}
//                       className="pixel-corners relative px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 
//                         border border-blue-500/30 group transition-all duration-200"
//                     >
//                       <div className="absolute inset-0 bg-grid-blue/[0.02] bg-[length:8px_8px] opacity-0 group-hover:opacity-100 transition-opacity" />
//                       <span className="text-sm font-medium text-blue-400">{amount} TON</span>
//                     </button>
//                   ))}
//                 </div>

//                 {/* Custom Amount Input */}
//                 <div className="space-y-3 mb-4">
//                   <div className="relative">
//                     <input
//                       type="number"
//                       placeholder="Enter custom amount"
//                       min="0.1"
//                       step="0.1"
//                       value={customAmount}
//                       onChange={(e) => {
//                         // Validate input to ensure it's a proper number
//                         const value = e.target.value;
//                         if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
//                           setCustomAmount(value);
//                         }
//                       }}
//                       className="w-full px-4 py-3 bg-blue-900/10 border border-blue-500/20 rounded-lg 
//                         text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
//                     />
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 text-sm">TON</div>
//                   </div>

//                   {/* Deposit Button */}
//                   <button
//                     onClick={() => {
//                       const amount = parseFloat(customAmount);
//                       if (!isNaN(amount) && amount >= 0.1) {
//                         handleDeposit(amount);
//                       } else {
//                         showSnackbar({ 
//                           message: 'Invalid Amount', 
//                           description: 'Please enter a valid amount (minimum 0.1 TON).' 
//                         });
//                       }
//                     }}
//                     disabled={!customAmount || parseFloat(customAmount) < 0.1}
//                     className={`w-full py-3 pixel-corners font-medium transition-all duration-200 
//                       ${!customAmount || parseFloat(customAmount) < 0.1
//                         ? 'bg-blue-500/50 text-white/50 cursor-not-allowed'
//                         : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
//                       }`}
//                   >
//                     {user?.balance && user.balance > 0 
//                       ? `Top Up ${customAmount ? `${parseFloat(customAmount).toFixed(2)} TON` : 'TON'}`
//                       : `Deposit ${customAmount ? `${parseFloat(customAmount).toFixed(2)} TON` : 'TON'}`}
//                   </button>
//                 </div>

//                 {/* Earnings Preview */}
//                 {customAmount && parseFloat(customAmount) >= 1 && (
//                   <div className="bg-blue-900/10 rounded-lg p-3 border border-blue-500/20 space-y-3">
//                     {/* Basic Stake Info */}
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-white/60">Deposit Amount</span>
//                       <span className="text-white font-medium">{parseFloat(customAmount).toFixed(2)} TON</span>
//                     </div>

//                     {/* Daily Earnings */}
//                     <div className="pt-2 border-t border-blue-500/20">
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-white/60">Daily Earnings</span>
//                         <span className="text-green-400 font-medium">
//                           +{(parseFloat(customAmount) * currentROI).toFixed(6)} TON/day
//                         </span>
//                       </div>
//                     </div>

//                     {/* Potential Return */}
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-white/60">100-Day Return</span>
//                       <div className="text-right">
//                         <span className="text-blue-400 font-medium">
//                           {(parseFloat(customAmount) + calculateTotalEarnings(parseFloat(customAmount))).toFixed(2)} TON
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Info Footer */}
//                 <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
//                   <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <span>Minimum deposit: 1 TON • Lock period: 100 days</span>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     )}


//       {/* Withdrawal Info Modal */}
//       <WithdrawalInfoModal
//         isOpen={showWithdrawalInfo}
//         onClose={() => {
//           if (!isRestaking) {
//             setShowWithdrawalInfo(false);
//           }
//         }}
//         depositDate={user?.last_deposit_date || new Date()}
//         currentEarnings={earningState.currentEarnings}
//         stakedAmount={user?.balance || 0}
//         onRestake={handleRestake}
//       />

//       {/* Offline Rewards Modal */}
//       {showOfflineRewardsModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
//           <div className="bg-black rounded-xl w-full max-w-md border border-blue-500/20">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-xl font-semibold text-white">Nova Income</h3>
//                 <button 
//                   onClick={() => setShowOfflineRewardsModal(false)}
//                   className="text-white/60 hover:text-white"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               <div className="text-center">
//                 <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                   </svg>
//                 </div>

//                 <h4 className="text-lg font-semibold text-white mb-2">
//                   New Rewards Available!
//                 </h4>
//                 <p className="text-sm text-white/60 mb-6">
//                   Your staking rewards are ready to be claimed
//                 </p>

//                 <div className="space-y-3 mb-6">
//                   <div className="bg-white/5 rounded-lg p-4">
//                     <div className="text-sm text-white/60 mb-1">TON Earnings</div>
//                     <div className="text-2xl font-bold text-blue-400">
//                       +{offlineRewardsAmount.toFixed(9)} TON
//                     </div>
//                   </div>

//                   <div className="bg-white/5 rounded-lg p-4">
//                     <div className="text-sm text-white/60 mb-1">NOVA Rewards</div>
//                     <div className="text-2xl font-bold text-purple-400">
//                       +{(offlineRewardsAmount * 0.1).toFixed(9)} NOVA
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleClaimOfflineRewards}
//                   className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-200 shadow-lg shadow-purple-500/25"
//                 >
//                   Claim All Rewards
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bottom Navigation */}
//       <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-blue-500/20 safe-area-pb">
//         <div className="max-w-lg mx-auto px-2 md:px-4">
//           <div className="grid grid-cols-4 items-center">
//             {[
//               { id: 'home', text: 'Home', Icon: AiOutlineHome },
//               { id: 'tasks', text: 'Tasks', Icon: GiScrollUnfurled },
//               { id: 'network', text: 'Invite', Icon: FaUserPlus },
//               { id: 'token', text: 'Token', Icon: BsCoin }
//             ].map(({ id, text, Icon }) => (
//               <button 
//                 key={id} 
//                 onClick={() => setCurrentTab(id)}
//                 className={`flex flex-col items-center py-3 md:py-4 w-full transition-all duration-300 ${
//                   currentTab === id ? 'text-blue-400' : 'text-gray-500'
//                 }`}
//               >
//                 <Icon size={18} className="mb-1" />
//                 <span className="text-[10px] md:text-xs font-medium tracking-wide truncate max-w-[64px] text-center">
//                   {text}
//                   </span>
//               </button>
//             ))}
//           </div>
//                 </div>
//               </div>

//         {/* Add Snackbar component before closing div */}
//         {isSnackbarVisible && (
//           <Snackbar
//             onClose={() => {
//               setSnackbarVisible(false);
//               if (snackbarTimeoutRef.current) {
//                 clearTimeout(snackbarTimeoutRef.current);
//               }
//             }}
//             duration={SNACKBAR_DURATION}
//             description={snackbarDescription}
//             after={
//               <Button 
//                 size="s" 
//                 onClick={() => {
//                   setSnackbarVisible(false);
//                   if (snackbarTimeoutRef.current) {
//                     clearTimeout(snackbarTimeoutRef.current);
//                   }
//                 }}
//               >
//                 Close
//               </Button>
//             }
//             className="snackbar-top"
//           >
//             {snackbarMessage}
//           </Snackbar>
//         )}
//       </div>
//   );
// };

//   // Update the ReStakeCountdown component
//   const ReStakeCountdown: FC<{ depositDate: Date }> = ({ depositDate }) => {
//     const [timeLeft, setTimeLeft] = useState<string>('');
//     const [isLocked, setIsLocked] = useState(true);

//     useEffect(() => {
//       const calculateTimeLeft = () => {
//         const now = Date.now();
//         const startTime = depositDate.getTime();
//         const endTime = startTime + LOCK_PERIOD_MS;
//         const remaining = endTime - now;

//         if (remaining <= 0) {
//           setIsLocked(false);
//           setTimeLeft('Unlocked');
//           return;
//         }

//         // Calculate remaining time
//         const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

//         setTimeLeft(`${days}d ${hours}h ${minutes}m`);
//         setIsLocked(true);
//       };

//       calculateTimeLeft();
//       const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

//       return () => clearInterval(interval);
//     }, [depositDate]);

//     return (
//       <div className="flex items-center gap-2">
//         <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
//         <span className="text-xs">
//           {isLocked ? (
//             <>
//               <span className="text-white/60">Locked for: </span>
//               <span className="text-white/80 font-medium">{timeLeft}</span>
//             </>
//           ) : (
//             <span className="text-green-400">Ready for withdrawal</span>
//           )}
//         </span>
//       </div>
//     );
//   };

// const calculateTotalEarnings = (amount: number): number => {
//   let totalEarnings = 0;
//   let currentROI = 0.01; // Start at 1%
  
//   // Calculate earnings for each day up to 100 days
//   for (let day = 1; day <= 100; day++) {
//     // Update ROI every 5 days
//     if (day > 1 && day % 5 === 1) {
//       currentROI = Math.min(currentROI + 0.005, 0.11); // Increase by 0.5%, max 11%
//     }
    
//     // Add daily earnings
//     totalEarnings += amount * currentROI;
//   }
  
//   return totalEarnings;
// };

// const getActivityDescription = (activity: Activity): string => {
//   switch (activity.type) {
//     case 'deposit':
//       return `Initial deposit of ${activity.amount.toFixed(2)} TON`;
//     case 'top_up':
//       return `Added ${activity.amount.toFixed(2)} TON to stake`;
//     case 'withdrawal':
//       return `Withdrew ${activity.amount.toFixed(2)} TON`;
//     case 'stake':
//       return `Staked ${activity.amount.toFixed(2)} TON`;
//     case 'redeposit':
//       return `Redeposited ${activity.amount.toFixed(2)} TON`;
//     case 'nova_reward':
//       return `Received ${activity.amount.toFixed(2)} NOVA tokens`;
//     case 'nova_income':
//       return `Earned ${activity.amount.toFixed(2)} TON`;
//     case 'offline_reward':
//       return `Collected ${activity.amount.toFixed(2)} TON offline earnings`;
//     case 'earnings_update':
//       return `Earnings updated: +${activity.amount.toFixed(6)} TON`;
//     case 'claim':
//       return `Claimed ${activity.amount.toFixed(2)} TON`;
//     case 'transfer':
//       return `Transferred ${activity.amount.toFixed(2)} TON`;
//     case 'reward':
//       return `Received ${activity.amount.toFixed(2)} TON reward`;
//     case 'bonus':
//       return `Received ${activity.amount.toFixed(2)} TON bonus`;
//     default:
//       return `${activity.type}: ${activity.amount.toFixed(2)} TON`;
//   }
// };

// const SYNC_INTERVAL = 60000; // Sync every minute

// // 