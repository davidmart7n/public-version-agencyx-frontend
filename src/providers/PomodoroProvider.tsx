import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type PomodoroContextType = {
  timeLeft: number;
  isRunning: boolean;
  workTime: number;
  breakTime: number;
  isWorkSession: boolean;
  isSoundEnabled: boolean;
  isAlarmActive: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setWorkTime: React.Dispatch<React.SetStateAction<number>>;
  setBreakTime: React.Dispatch<React.SetStateAction<number>>;
  setIsWorkSession: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setIsSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  handleAlarmClick: () => void;
};

const PomodoroContext = createContext<PomodoroContextType | null>(null);

export const PomodoroProvider = ({ children }: { children: React.ReactNode }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);

  // 🔓 Desbloquear audio al primer clic en el documento
  useEffect(() => {
    const prepareAudio = () => {
      const sound = new Audio('/morning_alarm.mp3');
      sound.muted = true;
      sound.play().catch(() => {});
      sound.pause();
      sound.muted = false;
      alarmSoundRef.current = sound;
      document.removeEventListener('click', prepareAudio);
    };

    document.addEventListener('click', prepareAudio);

    return () => {
      document.removeEventListener('click', prepareAudio);
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          if (isSoundEnabled && alarmSoundRef.current) {
            alarmSoundRef.current.loop = true;
            alarmSoundRef.current.play().catch((err) => console.log("Error reproduciendo sonido:", err));
            setIsAlarmActive(true);
          }
          setIsRunning(false);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isSoundEnabled]);

  const handleAlarmClick = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.pause();
      alarmSoundRef.current.currentTime = 0;
      setIsAlarmActive(false);
    }
  };

  return (
    <PomodoroContext.Provider
      value={{
        timeLeft,
        isRunning,
        workTime,
        breakTime,
        isWorkSession,
        isSoundEnabled,
        isAlarmActive,
        setIsRunning,
        setWorkTime,
        setBreakTime,
        setIsWorkSession,
        setTimeLeft,
        setIsSoundEnabled,
        handleAlarmClick,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) throw new Error("usePomodoro debe usarse dentro de PomodoroProvider");
  return context;
};
