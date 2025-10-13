import { useState, useEffect } from 'react';

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

const SocialTasks = ({ showSnackbar }: Props) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [validatingTasks, setValidatingTasks] = useState<{ [key: number]: boolean }>({});
  const [timers, setTimers] = useState<{ [key: number]: number }>({});
  const [, setConfetti] = useState<number | null>(null);
  const [isClaimingAllRewards, setIsClaimingAllRewards] = useState(false);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [hasClaimedAllRewards, setHasClaimedAllRewards] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    setTasks([
      {
        id: 1,
        platform: 'Telegram',
        action: 'Join TAPPS Telegram Group',
        reward: 10000,
        link: 'https://t.me/TAPPs_Chat',
        isCompleted: false,
        description: 'Join our vibrant community and stay updated!'
      },
      {
        id: 2,
        platform: 'Telegram',
        action: 'Join TAPPS Telegram Channel',
        reward: 10000,
        link: 'https://t.me/TAPPs_News',
        isCompleted: false,
        description: 'Stay connected with the latest updates!'
      },
      {
        id: 3,
        platform: 'Twitter',
        action: 'Follow TAPPS on X/Twitter',
        reward: 10000,
        link: 'https://x.com/TAPP_Whale',
        isCompleted: false,
        description: 'Follow us on X for the latest news and updates!'
      },
      {
        id: 4,
        platform: 'Facebook',
        action: 'Like TAPPS Whale Facebook Page',
        reward: 10000,
        link: 'https://web.facebook.com/TAPPsWeb3',
        isCompleted: false,
        description: 'Show your support by liking our Facebook page!'
      },
    ]);
    setTimeout(() => setIsInitialLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const allCompleted = tasks.every(task => task.isCompleted);
      setAllTasksCompleted(allCompleted);
    }
  }, [tasks]);

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

  const handleTaskCompletion = async (taskId: number) => {
    setLoading(true);
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, isCompleted: true } : t
      ));

      setConfetti(taskId);
      setTimeout(() => setConfetti(null), 3000);

      showSnackbar({
        message: 'Task Completed!',
        description: `You earned ${task.reward.toLocaleString()} TAPPS tokens!`
      });
    } catch (error) {
      console.error('Error completing task:', error);
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
    setValidatingTasks(prev => ({ ...prev, [taskId]: true }));
    setTimers(prev => ({ ...prev, [taskId]: 30 }));
  };

  const getPlatformIcon = (platform: string) => {
    const iconClass = "w-5 h-5";
    switch (platform.toLowerCase()) {
      case 'telegram':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.154.232.17.326.016.094.036.308.02.475z"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const handleClaimAllRewards = async () => {
    if (!allTasksCompleted || hasClaimedAllRewards) return;
    setIsClaimingAllRewards(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConfetti(-1);
      setTimeout(() => setConfetti(null), 5000);
      showSnackbar({
        message: 'All Tasks Completed!',
        description: 'Congratulations! You earned a bonus of 25,000 TAPPS tokens!'
      });
      setHasClaimedAllRewards(true);
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
      <div className="space-y-6 bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl p-5 border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse"></div>
                  <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse"></div>
                <div className="flex gap-2 mt-4">
                  <div className="h-10 flex-1 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-10 flex-1 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className={compact ? "space-y-3" : "space-y-6"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Daily Social Tasks</h3>
              <p className="text-xs text-gray-500">Complete tasks to earn rewards</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {allTasksCompleted && !hasClaimedAllRewards && (
              <button
                onClick={handleClaimAllRewards}
                disabled={isClaimingAllRewards}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-colors"
              >
                {isClaimingAllRewards ? 'Claiming...' : 'Claim 25K Bonus'}
              </button>
            )}
            <button
              onClick={() => setCompact(v => !v)}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors"
            >
              {compact ? 'Expand' : 'Compact'}
            </button>
          </div>
        </div>

        {allTasksCompleted && !hasClaimedAllRewards && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">Bonus Available!</h4>
                <p className="text-xs text-gray-600">Claim your 25,000 TAPPs bonus for completing all tasks</p>
              </div>
            </div>
          </div>
        )}

        {allTasksCompleted && hasClaimedAllRewards && !compact && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">All Tasks Completed!</h4>
                <p className="text-xs text-gray-600">You've claimed your 25,000 TAPPS bonus reward.</p>
              </div>
            </div>
          </div>
        )}

        {tasks.filter(t => !t.isCompleted).length > 0 && !compact && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Boost Your Earnings</h4>
                <p className="text-xs text-gray-600">Complete {tasks.filter(t => !t.isCompleted).length} more task{tasks.filter(t => !t.isCompleted).length !== 1 ? 's' : ''} to unlock bonus rewards</p>
              </div>
            </div>
          </div>
        )}

        <div className={compact ? "space-y-2" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
          {tasks.map((task) => (
            <div
              key={task.id}
              className={compact
                ? "flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-gray-300 transition-colors"
                : "relative rounded-xl p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-sm"
              }
            >
              {compact ? (
                <>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.isCompleted ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      {getPlatformIcon(task.platform)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">{task.action}</div>
                      <div className="text-xs text-gray-500">{task.platform}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100 whitespace-nowrap font-medium">
                      +{task.reward.toLocaleString()}
                    </span>
                    {task.isCompleted ? (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100 font-medium">
                        Done
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => startTaskValidation(task.id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs border border-blue-200 font-medium transition-colors"
                        >
                          Visit
                        </a>
                        <button
                          onClick={() => handleTaskCompletion(task.id)}
                          disabled={loading || !validatingTasks[task.id] || timers[task.id] > 0}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                            validatingTasks[task.id] && timers[task.id] > 0
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : validatingTasks[task.id]
                              ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          {loading ? 'Verifying' : (validatingTasks[task.id] && timers[task.id] > 0) ? `${timers[task.id]}s` : validatingTasks[task.id] ? 'Claim' : 'Pending'}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${task.isCompleted ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {getPlatformIcon(task.platform)}
                      </div>
                      <span className="text-base font-semibold text-gray-900">{task.platform}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-green-50 border border-green-100">
                      <span className="text-sm font-semibold text-green-700">+{task.reward.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-900 font-medium mb-2">{task.action}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {task.isCompleted ? (
                        <button disabled className="w-full px-4 py-2.5 rounded-lg bg-green-50 text-green-700 border border-green-100 font-medium flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <span>Visit {task.platform}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <button
                            onClick={() => handleTaskCompletion(task.id)}
                            disabled={loading || !validatingTasks[task.id] || timers[task.id] > 0}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                              validatingTasks[task.id] && timers[task.id] > 0
                                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                : validatingTasks[task.id]
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                            }`}
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                                <span>Verifying</span>
                              </>
                            ) : validatingTasks[task.id] && timers[task.id] > 0 ? (
                              <>
                                <span>Checking</span>
                                <span className="tabular-nums">{timers[task.id]}s</span>
                              </>
                            ) : validatingTasks[task.id] ? (
                              <span>Claim Reward</span>
                            ) : (
                              <span>Not Claimed</span>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className={compact ? "p-3 rounded-xl border border-gray-200 bg-gray-50" : "p-4 bg-gray-50 rounded-xl border border-gray-200"}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Task Progress</span>
            <span className="text-sm font-semibold text-gray-900">{tasks.filter(t => t.isCompleted).length}/{tasks.length} Completed</span>
          </div>
          <div className={compact ? "h-1.5 bg-gray-200 rounded-full overflow-hidden" : "relative h-2 bg-gray-200 rounded-full overflow-hidden"}>
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-700"
              style={{ width: `${(tasks.filter(t => t.isCompleted).length / tasks.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialTasks;
