import React, { FC, useState, useEffect } from 'react';
import { FaRocket, FaChartLine, FaUsers, FaGem } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

interface OnboardingStep {
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
}

export const OnboardingScreen: FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shouldShow, setShouldShow] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const steps: OnboardingStep[] = [
    {
      icon: <FaRocket className="w-12 h-12" />,
      title: `Welcome to Stakenova${user?.first_name ? ` ${user.first_name}` : ''}!`,
      description: "Embark on an epic journey through the Staking Universe",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <FaChartLine className="w-12 h-12" />,
      title: "Stellar Rewards",
      description: "Watch your TON balance grow like exploding supernovas",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <FaUsers className="w-12 h-12" />,
      title: "Cosmic Community",
      description: "Join fellow astronauts in your mission to prosperity",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <FaGem className="w-12 h-12" />,
      title: "Galactic Benefits",
      description: "Unlock rare treasures and celestial bonuses",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShouldShow(false);
    }
  };

  const handleSkip = () => {
    setShouldShow(false);
  };

  useEffect(() => {
    if (!user) return;

    const hasSeenOnboarding = localStorage.getItem(`onboarding_${user.id}`);
    if (!hasSeenOnboarding && user.total_deposit === 0) {
      setShouldShow(true);
      localStorage.setItem(`onboarding_${user.id}`, 'true');
    }

    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, [user]);

  useEffect(() => {
    if (loading || !autoAdvance) return;

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
    }, 3000);

    return () => clearInterval(stepInterval);
  }, [loading, steps.length, autoAdvance]);

  useEffect(() => {
    const handleUserInteraction = () => {
      setAutoAdvance(false);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  if (!user || !shouldShow) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0F] bg-opacity-98 backdrop-blur-sm p-4">
      <div className="relative max-w-md w-full px-6 py-8 rounded-2xl bg-[#12121A]/50 backdrop-blur-md border border-white/10">
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle opacity-80" style={{ top: '10%', left: '20%' }} />
          <div className="absolute w-2 h-2 bg-white rounded-full animate-twinkle delay-75 opacity-60" style={{ top: '30%', right: '25%' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle delay-150 opacity-70" style={{ bottom: '20%', left: '40%' }} />
          <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle delay-200 opacity-50" style={{ bottom: '40%', right: '15%' }} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse p-1.5">
                <div className="w-full h-full bg-[#0A0A0F] rounded-full flex items-center justify-center">
                  <FaRocket className="w-14 h-14 sm:w-16 sm:h-16 text-white animate-bounce" />
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {user?.total_deposit === 0 ? 'Preparing for Launch' : 'Welcome Back, Explorer!'}
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                {user?.total_deposit === 0 
                  ? 'Initializing your space journey...'
                  : 'Accessing your command center...'}
              </p>
            </div>
          </div>
        ) : (
          <div key={currentStep} className="text-center animate-float">
            <div className={`flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-to-r ${steps[currentStep].color} p-1.5 shadow-lg`}>
              <div className="w-full h-full bg-[#0A0A0F] rounded-full flex items-center justify-center">
                {React.cloneElement(steps[currentStep].icon as React.ReactElement, {
                  className: 'w-14 h-14 sm:w-16 sm:h-16 text-white'
                })}
              </div>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold mt-8 mb-4 bg-gradient-to-r ${steps[currentStep].color} bg-clip-text text-transparent`}>
              {steps[currentStep].title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 px-4">
              {steps[currentStep].description}
            </p>
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? `w-8 bg-gradient-to-r ${steps[currentStep].color}`
                      : 'w-2 bg-gray-600 hover:bg-gray-500 cursor-pointer'
                  }`}
                  onClick={() => {
                    setCurrentStep(index);
                    setAutoAdvance(false);
                  }}
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <button
                onClick={handleSkip}
                className="order-2 sm:order-1 px-8 py-3 text-base font-medium text-gray-400 hover:text-white transition-colors rounded-full border border-gray-700 hover:border-gray-500"
              >
                Skip Tour
              </button>
              <button
                onClick={handleContinue}
                className={`order-1 sm:order-2 px-8 py-3 rounded-full bg-gradient-to-r ${steps[currentStep].color} text-white font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all`}
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 