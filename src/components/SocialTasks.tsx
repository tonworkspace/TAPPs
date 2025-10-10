import React, { useState, useEffect } from 'react';
import { FaTelegram, FaTwitter, FaMedium, FaFacebook, FaYoutube } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';
import useAuth from '@/hooks/useAuth';

interface Task {
  id: number;
  platform: string;
  action: string;
  reward: number;
  link: string;
  isCompleted: boolean;
  validationTimer?: number;
  description: string;
}

interface Props {
  showSnackbar: (config: { message: string; description?: string }) => void;
}

const SocialTasks: React.FC<Props> = ({ showSnackbar }) => {
  const { user, updateUserData } = useAuth();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [validatingTasks, setValidatingTasks] = useState<{ [key: number]: boolean }>({});
  const [timers, setTimers] = useState<{ [key: number]: number }>({});
  const [confetti, setConfetti] = useState<number | null>(null);
  const [isClaimingAllRewards, setIsClaimingAllRewards] = useState(false);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [hasClaimedAllRewards, setHasClaimedAllRewards] = useState(false);
  const [compact, setCompact] = useState(true);

  useEffect(() => {
    setTasks([
      {
        id: 1,
        platform: 'Telegram',
        action: 'Join StakeNova Telegram Group',
        reward: 100,
        link: 'https://t.me/StakeNova_Community',
        isCompleted: false,
        description: 'Join our vibrant community and stay updated!'
      },
      {
        id: 2,
        platform: 'Telegram',
        action: 'Join StakeNova Telegram Channel',
        reward: 500,
        link: 'https://t.me/StakeNova_Channel',
        isCompleted: false,
        description: 'Stay connected with the latest updates!'
      },
      {
        id: 3,
        platform: 'Twitter',
        action: 'Follow StakeNova on X',
        reward:100,
        link: 'https://x.com/StakeNova_web3',
        isCompleted: false,
        description: 'Follow us on X for the latest news and updates!'
      },
      {
        id: 4,
        platform: 'Facebook',
        action: 'Like StakeNova Facebook Page',
        reward: 250,
        link: 'https://www.facebook.com/stakenovacommunity',
        isCompleted: false,
        description: 'Show your support by liking our Facebook page!'
      },
      {
        id: 5,
        platform: 'Medium',
        action: 'Follow StakeNova Medium Blog',
        reward: 500,
        link: 'https://medium.com/@stakenova',
        isCompleted: false,
        description: 'Stay informed with our Medium blog!'
      },
      {
        id: 6,
        platform: 'Youtube',
        action: 'Subscribe to StakeNova Youtube Channel',
        reward: 500,
        link: 'https://www.youtube.com/@StakeNova_Community',
        isCompleted: false,
        description: 'Subscribe to our YouTube channel for video content!'
      }
    ]);
  }, []);

  useEffect(() => {
    if (user?.id) {
      const loadSavedState = async () => {
        try {
          const [savedValidatingTasks, completedTasksResponse] = await Promise.all([
            JSON.parse(localStorage.getItem('validatingTasks') || '{}'),
            supabase
              .from('completed_tasks')
              .select('task_id')
              .eq('user_id', user.id)
          ]);

          setValidatingTasks(savedValidatingTasks);
          
          if (completedTasksResponse.data) {
            const updatedTasks = tasks.map(task => ({
              ...task,
              isCompleted: completedTasksResponse.data!.some(ct => ct.task_id === task.id)
            }));
            
            setTasks(updatedTasks);
            
            // Check if all tasks are completed
            const allCompleted = updatedTasks.every(task => task.isCompleted);
            setAllTasksCompleted(allCompleted);
          }
          
          // Check if user has already claimed the all-tasks reward from localStorage
          setHasClaimedAllRewards(localStorage.getItem('hasClaimedAllTasksBonus') === 'true');
          
        } catch (error) {
          console.error('Error loading saved state:', error);
        } finally {
          setIsInitialLoading(false);
        }
      };

      loadSavedState();
    }
  }, [user?.id, tasks.length]);

  // Update allTasksCompleted whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      const allCompleted = tasks.every(task => task.isCompleted);
      setAllTasksCompleted(allCompleted);
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('validatingTasks', JSON.stringify(validatingTasks));
  }, [validatingTasks]);

  const handleTaskCompletion = async (taskId: number) => {
    setLoading(true);
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      // Check if task is already completed in the database first
      const { data: completionCheck, error: checkError } = await supabase
        .from('completed_tasks')
        .select('*')
        .eq('user_id', user?.id)
        .eq('task_id', taskId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is expected
        throw checkError;
      }

      if (completionCheck) {
        showSnackbar({
          message: 'Task Already Completed',
          description: 'You have already completed this task.'
        });
        return;
      }

      // Get current user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_sbt')
        .eq('id', user?.id)
        .single();
      
      if (userError) {
        throw userError;
      }

      // Update local state first
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, isCompleted: true } : t
      ));

      // Then update database
      const [completionResult, userUpdateResult] = await Promise.all([
        supabase
          .from('completed_tasks')
          .insert([{
            user_id: user?.id,
            task_id: taskId,
            completed_at: new Date().toISOString()
          }]),

        supabase
          .from('users')
          .update({ 
            total_sbt: (userData.total_sbt || 0) + task.reward
          })
          .eq('id', user?.id)
      ]);

      if (completionResult.error) throw completionResult.error;
      if (userUpdateResult.error) throw userUpdateResult.error;

      // Immediately reflect new airdrop balance in UI
      try {
        const newTotal = (userData.total_sbt || 0) + task.reward;
        await updateUserData({ total_sbt: newTotal });
      } catch (e) {
        // Non-blocking: UI will still catch up via realtime subscription
      }

      // Show success animation and message
      setConfetti(taskId);
      setTimeout(() => setConfetti(null), 3000);

      showSnackbar({
        message: '🎉 Task Completed!',
        description: `Awesome! You earned ${task.reward} NOVA tokens!`
      });

      // Check if all tasks are now completed
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, isCompleted: true } : t
      );
      const allCompleted = updatedTasks.every(t => t.isCompleted);
      setAllTasksCompleted(allCompleted);

    } catch (error) {
      console.error('Error completing task:', error);
      // Revert local state on error
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, isCompleted: false } : t
      ));
      showSnackbar({
        message: 'Error',
        description: 'Failed to complete task. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const startTaskValidation = (taskId: number) => {
    const validationState = { [taskId]: true };
    setValidatingTasks(prev => ({ ...prev, ...validationState }));
    setTimers(prev => ({ ...prev, [taskId]: 30 }));
    localStorage.setItem('validatingTasks', JSON.stringify(validationState));
  };

  useEffect(() => {
    const activeTimers = Object.entries(timers).filter(([_, time]) => time > 0);
    
    const intervalIds = activeTimers.map(([taskId, _]) => {
      const timer = setInterval(() => {
        setTimers(prev => {
          const newTime = (prev[Number(taskId)] || 0) - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            return { ...prev, [taskId]: 0 };
          }
          return { ...prev, [taskId]: newTime };
        });
      }, 1000);
      
      return timer;
    });

    return () => {
      intervalIds.forEach(id => clearInterval(id));
    };
  }, [timers]);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'telegram':
        return <FaTelegram className="w-5 h-5" />;
      case 'twitter':
        return <FaTwitter className="w-5 h-5" />;
      case 'facebook':
        return <FaFacebook className="w-5 h-5" />;
      case 'youtube':
        return <FaYoutube className="w-5 h-5" />;
      case 'medium':
        return <FaMedium className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleClaimAllRewards = async () => {
    if (!allTasksCompleted || hasClaimedAllRewards || !user?.id) return;
    
    setIsClaimingAllRewards(true);
    try {
      // Check if the user has already claimed the bonus from localStorage
      if (localStorage.getItem('hasClaimedAllTasksBonus') === 'true') {
        showSnackbar({
          message: 'Already Claimed',
          description: 'You have already claimed the bonus reward for completing all tasks.'
        });
        setHasClaimedAllRewards(true);
        return;
      }
      
      // Add server-side verification that all tasks are actually completed
      const { data: completedTasksCheck, error: checkError } = await supabase
        .from('completed_tasks')
        .select('task_id')
        .eq('user_id', user.id);
      
      if (checkError) throw checkError;
      
      // Verify all tasks are completed on the server side
      const allTaskIds = tasks.map(t => t.id);
      const completedTaskIds = completedTasksCheck?.map(ct => ct.task_id) || [];
      const allTasksCompleted = allTaskIds.every(id => completedTaskIds.includes(id));
      
      if (!allTasksCompleted) {
        showSnackbar({
          message: 'Verification Failed',
          description: 'Server verification shows not all tasks are completed. Please complete all tasks first.'
        });
        return;
      }
      
      // Check if bonus was already claimed in the database by looking for a special completed_tasks entry
      const { data: bonusCheck, error: bonusCheckError } = await supabase
        .from('completed_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', -1) // Using -1 as a special task_id to represent the bonus
        .single();
      
      if (bonusCheckError && bonusCheckError.code !== 'PGRST116') throw bonusCheckError;
      
      if (bonusCheck) {
        showSnackbar({
          message: 'Already Claimed',
          description: 'Our records show you have already claimed this bonus.'
        });
        setHasClaimedAllRewards(true);
        localStorage.setItem('hasClaimedAllTasksBonus', 'true');
        return;
      }
      
      // Get current user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_sbt')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        throw userError;
      }
      
      // Add bonus reward (25,000 NOVA)
      const bonusReward = 25000;
      
      // Update user's NOVA balance
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          total_sbt: (userData.total_sbt || 0) + bonusReward
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;

      // Immediately reflect new airdrop balance in UI
      try {
        const newTotal = (userData.total_sbt || 0) + bonusReward;
        await updateUserData({ total_sbt: newTotal });
      } catch (e) {
        // Non-blocking if fails
      }
      
      // Record this bonus claim in the completed_tasks table with a special task_id
      await supabase
        .from('completed_tasks')
        .insert([{
          user_id: user.id,
          task_id: -1, // Special task_id to represent the bonus
          completed_at: new Date().toISOString(),
          notes: 'Completed all social tasks bonus'
        }]);
      
      // Show success message with confetti
      setConfetti(-1); // Special value for all-tasks completion
      setTimeout(() => setConfetti(null), 5000);
      
      showSnackbar({
        message: '🎉 All Tasks Completed!',
        description: `Congratulations! You earned a bonus of ${bonusReward.toLocaleString()} NOVA tokens!`
      });
      
      // Mark as claimed in local state and localStorage
      setHasClaimedAllRewards(true);
      localStorage.setItem('hasClaimedAllTasksBonus', 'true');
      
    } catch (error) {
      console.error('Error claiming all rewards:', error);
      showSnackbar({
        message: 'Error',
        description: 'Failed to claim bonus reward. Please try again.'
      });
    } finally {
      setIsClaimingAllRewards(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse"></div>
          <div className="h-8 w-24 bg-slate-200 rounded-md animate-pulse"></div>
        </div>
        
        {/* Task card skeletons */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
                  <div>
                    <div className="h-5 w-32 bg-slate-200 rounded-md animate-pulse mb-1"></div>
                    <div className="h-4 w-24 bg-slate-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
                <div className="h-8 w-20 bg-slate-200 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress bar skeleton */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 w-24 bg-slate-200 rounded-md animate-pulse"></div>
            <div className="h-4 w-20 bg-slate-200 rounded-md animate-pulse"></div>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-slate-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Social Tasks</h2>
            <p className="text-sm text-slate-600">
              {tasks.filter(t => !t.isCompleted).length > 0 ? `${tasks.filter(t => !t.isCompleted).length} tasks remaining` : 'All tasks completed!'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setCompact(v => !v)}
          className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          {compact ? 'Expand' : 'Compact'}
        </button>
      </div>

      {/* Claim All Rewards Button */}
      {allTasksCompleted && !hasClaimedAllRewards && (
        <div className="mb-4">
          <button
            onClick={handleClaimAllRewards}
            disabled={isClaimingAllRewards}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 shadow-md shadow-blue-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold">Claim Bonus Reward!</div>
                <div className="text-sm font-medium text-blue-200">+25,000 TAPPS</div>
              </div>
            </div>
            <div>
              {isClaimingAllRewards ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Already Claimed Message */}
      {allTasksCompleted && hasClaimedAllRewards && (
        <div className="mb-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-800">All Tasks Completed!</h4>
              <p className="text-xs text-emerald-700">You've claimed your 25,000 TAPPS bonus reward.</p>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className={compact ? "space-y-2" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={compact
              ? `flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3`
              : `relative bg-white rounded-xl p-5 border-2 ${task.isCompleted ? 'border-emerald-200' : 'border-slate-200'} shadow-sm transition-all duration-300`}
          >
            {compact ? (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 ${task.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100'}`}>
                    {getPlatformIcon(task.platform)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-slate-800 font-medium truncate">{task.action}</div>
                    <div className="text-xs text-slate-500 truncate">{task.platform}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 font-medium whitespace-nowrap">+{task.reward} TAPPS</span>
                  {task.isCompleted ? (
                    <span className="text-xs px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 font-medium">Done</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <a
                        href={task.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => startTaskValidation(task.id)}
                        className="px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 hover:bg-slate-200"
                      >
                        Open
                      </a>
                      <button
                        onClick={() => handleTaskCompletion(task.id)}
                        disabled={loading || !validatingTasks[task.id] || timers[task.id] > 0}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium border ${validatingTasks[task.id] && timers[task.id] > 0
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : validatingTasks[task.id]
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {loading ? '...' : (validatingTasks[task.id] && timers[task.id] > 0) ? `${timers[task.id]}s` : validatingTasks[task.id] ? 'Claim' : 'Verify'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 ${task.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100'}`}>
                      {getPlatformIcon(task.platform)}
                    </div>
                    <span className="text-lg font-semibold text-slate-900">{task.platform}</span>
                  </div>
                  <div className="px-3 py-1 rounded-md bg-emerald-100">
                    <span className="text-sm font-semibold text-emerald-700">+{task.reward} TAPPS</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-slate-800 font-semibold mb-1">{task.action}</h3>
                    <p className="text-sm text-slate-600">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    {task.isCompleted ? (
                      <button disabled className="w-full px-4 py-2.5 rounded-lg bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </button>
                    ) : (
                      <>
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => startTaskValidation(task.id)}
                          className="flex-1 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <span>Visit {task.platform}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <button
                          onClick={() => handleTaskCompletion(task.id)}
                          disabled={loading || !validatingTasks[task.id] || timers[task.id] > 0}
                          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${validatingTasks[task.id] && timers[task.id] > 0 ? 'bg-yellow-100 text-yellow-800' : validatingTasks[task.id] ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-500'}`}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                              <span>Verifying</span>
                            </>
                          ) : validatingTasks[task.id] && timers[task.id] > 0 ? (
                            <>
                              <span>Checking...</span>
                              <span className="tabular-nums">{timers[task.id]}s</span>
                            </>
                          ) : validatingTasks[task.id] ? (
                            <span>Claim Reward</span>
                          ) : (
                            <span>Verify</span>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {confetti === task.id && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                    {/* Simplified confetti effect */}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">Task Progress</span>
          <span className="text-sm font-medium text-slate-900">{tasks.filter(t => t.isCompleted).length}/{tasks.length} Completed</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-700"
            style={{ width: `${(tasks.filter(t => t.isCompleted).length / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Confetti for all tasks completion */}
      {confetti === -1 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {/* Simplified confetti effect */}
        </div>
      )}
    </div>
  );
};

export default SocialTasks; 