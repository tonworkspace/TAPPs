import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  userId?: number;
  onRewardClaimed: (amount: number) => void;
}

const DailyRewardCard = ({ userId, onRewardClaimed }: Props) => {
  const [streak, setStreak] = useState(0);
  const [lastClaimed, setLastClaimed] = useState<Date | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchRewardStatus = async () => {
      const { data, error } = await supabase
        .from('daily_rewards')
        .select('streak, last_claimed')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching daily reward status:', error);
      }

      if (data) {
        const lastClaimedDate = new Date(data.last_claimed);
        setStreak(data.streak);
        setLastClaimed(lastClaimedDate);
        const now = new Date();
        const diff = now.getTime() - lastClaimedDate.getTime();
        const hours = 24 - diff / (1000 * 60 * 60);
        if (hours <= 0) {
          setCanClaim(true);
        } else {
          setCanClaim(false);
        }
      } else {
        setCanClaim(true);
      }
      setIsLoading(false);
    };

    fetchRewardStatus();
  }, [userId]);

  useEffect(() => {
    if (canClaim || !lastClaimed) {
      setTimeRemaining('Claim now!');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - lastClaimed.getTime();
      const remaining = 24 * 60 * 60 * 1000 - diff;

      if (remaining <= 0) {
        setCanClaim(true);
        setTimeRemaining('Claim now!');
        clearInterval(interval);
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [canClaim, lastClaimed]);

  const handleClaim = async () => {
    if (!userId || !canClaim) return;

    const now = new Date();
    let newStreak = streak;

    if (lastClaimed) {
      const diff = now.getTime() - lastClaimed.getTime();
      if (diff > 24 * 60 * 60 * 1000 && diff < 48 * 60 * 60 * 1000) {
        newStreak++;
      } else if (diff >= 48 * 60 * 60 * 1000) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const reward = 1000 + (newStreak - 1) * 100;

    const { error } = await supabase
      .from('daily_rewards')
      .upsert({ user_id: userId, streak: newStreak, last_claimed: now.toISOString() }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error claiming reward:', error);
      return;
    }

    await supabase.rpc('increment_sbt', { user_id: userId, amount: reward });

    setStreak(newStreak);
    setLastClaimed(now);
    setCanClaim(false);
    onRewardClaimed(reward);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Daily Reward</h3>
            <p className="text-sm text-gray-600">Claim your daily Tapps!</p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100">
          <span className="text-sm font-semibold text-blue-700">Streak: {streak} day{streak !== 1 && 's'}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">Claim your daily reward to keep the streak going! The longer the streak, the bigger the reward. Don't miss a day for 30 days!</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(streak / 30) * 100}%` }}></div>
      </div>
      <button
        onClick={handleClaim}
        disabled={!canClaim}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
          canClaim
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 animate-pulse'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {canClaim ? 'Claim Reward' : `Next claim in: ${timeRemaining}`}
      </button>
    </div>
  );
};

export default DailyRewardCard;