import { FC, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalWithdrawnTon: number;
  onSuccess?: () => void;
}

export const WithdrawModal: FC<WithdrawModalProps> = ({ isOpen, onClose, totalWithdrawnTon, onSuccess }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState(user?.wallet_address || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      setError('');

      const withdrawAmount = parseFloat(amount);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        throw new Error('Invalid withdrawal amount');
      }

      if (withdrawAmount < 1) {
        throw new Error('Minimum withdrawal amount is 1 TON');
      }

      if (withdrawAmount > totalWithdrawnTon) {
        throw new Error('Insufficient balance');
      }

      if (!withdrawalAddress || withdrawalAddress.trim().length === 0) {
        throw new Error('Please enter a valid withdrawal address');
      }

      // Basic TON address validation (should start with UQ, EQ, or 0:)
      const tonAddressRegex = /^(UQ|EQ|0:)[A-Za-z0-9_-]{47}$/;
      if (!tonAddressRegex.test(withdrawalAddress.trim())) {
        throw new Error('Please enter a valid TON wallet address');
      }

      // Create withdrawal request
      const { error: withdrawError } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user?.id,
          amount: withdrawAmount,
          wallet_amount: withdrawAmount, // This maps to the actual schema
          status: 'PENDING',
          created_at: new Date().toISOString()
        });

      if (withdrawError) throw withdrawError;

      // For now, we'll just create the withdrawal request
      // The actual balance deduction should be handled by the admin panel
      // or a separate process that processes pending withdrawals
      
      // Reset form
      setAmount('');
      setWithdrawalAddress(user?.wallet_address || '');
      
      // Show success and close modal
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to process withdrawal');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#0A0A1F] to-[#141428] rounded-2xl p-6 w-full max-w-md border-2 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.15)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
            Withdraw Funds
          </h3>
          <button 
            onClick={onClose}
            className="text-indigo-300/60 hover:text-indigo-300 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Balance Display */}
          <div className="bg-black/40 rounded-xl p-4 border border-indigo-500/20">
            <div className="text-sm text-white/60 mb-1">Available Balance</div>
            <div className="text-2xl font-bold text-white">{totalWithdrawnTon.toFixed(6)} TON</div>
            <div className="text-xs text-white/40 mt-1">Minimum withdrawal: 1 TON</div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">Withdrawal Amount</label>
            <input
              type="number"
              step="0.001"
              min="1"
              max={totalWithdrawnTon}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              className="w-full bg-black/40 border border-indigo-500/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
            />
            <div className="flex justify-between mt-1">
              <button 
                onClick={() => setAmount((totalWithdrawnTon * 0.25).toFixed(3))}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                25%
              </button>
              <button 
                onClick={() => setAmount((totalWithdrawnTon * 0.5).toFixed(3))}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                50%
              </button>
              <button 
                onClick={() => setAmount((totalWithdrawnTon * 0.75).toFixed(3))}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                75%
              </button>
              <button 
                onClick={() => setAmount(totalWithdrawnTon.toFixed(6))}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Max
              </button>
            </div>
          </div>

          {/* Wallet Address Input */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">Withdrawal Address</label>
            <input
              type="text"
              value={withdrawalAddress}
              onChange={(e) => setWithdrawalAddress(e.target.value)}
              placeholder="Enter TON wallet address (UQ, EQ, or 0:)"
              className="w-full bg-black/40 border border-indigo-500/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <div className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleWithdraw}
              disabled={isLoading || !amount || !withdrawalAddress}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Submit Withdrawal'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal; 