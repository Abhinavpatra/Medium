import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useSound } from "./use-sound";
import { click003Sound } from "../lib/click-003";
import { hoverTickSound } from "../lib/hover-tick";
import { select008Sound } from "../lib/select-008";
import { close001Sound } from "../lib/close-001";
import { open001Sound } from "../lib/open-001";
import { switchOnSound } from "../lib/switch-on";
import { switchOffSound } from "../lib/switch-off";
import { notificationPopSound } from "../lib/notification-pop";
import { successChimeSound } from "../lib/success-chime";
import { error001Sound } from "../lib/error-001";
import { confirmation001Sound } from "../lib/confirmation-001";

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playClick: () => void;
  playHover: () => void;
  playSelect: () => void;
  playOpen: () => void;
  playClose: () => void;
  playSwitchOn: () => void;
  playSwitchOff: () => void;
  playNotification: () => void;
  playSuccess: () => void;
  playError: () => void;
  playConfirmation: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [playClick] = useSound(click003Sound, { volume: 0.5, soundEnabled });
  const [playHover] = useSound(hoverTickSound, { volume: 0.08, soundEnabled });
  const [playSelect] = useSound(select008Sound, { volume: 0.4, soundEnabled });
  const [playClose] = useSound(close001Sound, { volume: 0.4, soundEnabled });
  const [playOpen] = useSound(open001Sound, { volume: 0.4, soundEnabled });
  const [playSwitchOn] = useSound(switchOnSound, { volume: 0.4, soundEnabled });
  const [playSwitchOff] = useSound(switchOffSound, { volume: 0.4, soundEnabled });
  const [playNotification] = useSound(notificationPopSound, { volume: 0.5, soundEnabled });
  const [playSuccess] = useSound(successChimeSound, { volume: 0.5, soundEnabled });
  const [playError] = useSound(error001Sound, { volume: 0.4, soundEnabled });
  const [playConfirmation] = useSound(confirmation001Sound, { volume: 0.5, soundEnabled });

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playClick,
        playHover,
        playSelect,
        playOpen,
        playClose,
        playSwitchOn,
        playSwitchOff,
        playNotification,
        playSuccess,
        playError,
        playConfirmation,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
}