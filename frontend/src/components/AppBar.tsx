import Avatar from "./Avatar";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { useSound } from "../hooks/use-sound";
import { useTheme } from "../hooks/use-theme";
import { select008Sound } from "../lib/select-008";
import { hoverTickSound } from "../lib/hover-tick";
import { click003Sound } from "../lib/click-003";
import { close004Sound } from "../lib/close-004";
import { switchOnSound } from "../lib/switch-on";
import { switchOffSound } from "../lib/switch-off";

export default function Appbar() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [playSelect] = useSound(select008Sound, { volume: 0.4 });
  const [playHover] = useSound(hoverTickSound, { volume: 0.08 });
  const [playClick] = useSound(click003Sound, { volume: 0.5 });
  const [playClose] = useSound(close004Sound, { volume: 0.4 });
  const [playSwitchOn] = useSound(switchOnSound, { volume: 0.4 });
  const [playSwitchOff] = useSound(switchOffSound, { volume: 0.4 });

  const handleLogout = () => {
    playClose();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/signin");
  };

  const handleThemeToggle = (e: React.MouseEvent) => {
    playClick();
    if (isDark) {
      playSwitchOff();
    } else {
      playSwitchOn();
    }
    toggleTheme(e);
  };

  return (
    <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <Link
        to={"/blogs"}
        onClick={() => playSelect()}
        onMouseEnter={() => playHover()}
        className="font-display text-2xl font-bold tracking-tight text-black dark:text-white hover:text-slate-500 dark:hover:text-slate-100 colors"
      >
        Medium
      </Link>
      <div className="flex items-center gap-6">
        <button
          onClick={handleThemeToggle}
          className="group p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-4 focus:ring-slate-200 relative w-10 h-10 flex items-center justify-center"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="bottom-10 right-10 left-0 m-auto w-fit whitespace-nowrap bg-slate-800 text-white dark:bg-white dark:text-black px-2.5 py-1 rounded-md text-xs font-semibold opacity-0 translate-y-0 group-hover:translate-y-10 group-hover:opacity-100 transition-all duration-400 pointer-events-none shadow-md">
            Toggle theme
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-500 h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 absolute"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-700 dark:text-yellow-400 h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 absolute"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
        <Link to={`/publish`}>
          <button
            type="button"
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="font-sans text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 px-5 py-2.5 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700"
          >
            New Story
          </button>
        </Link>

        <div className="flex items-center gap-4">
          {!loading && user && (
            <span className="text-slate-600 dark:text-slate-300 font-medium text-sm hidden sm:block">
              {user.name || "Anonymous"}
            </span>
          )}
          <Avatar size="big" name={user?.name || "A"} />

          <button
            onClick={handleLogout}
            onMouseEnter={() => playHover()}
            className="text-sm font-medium bg-red-200 hover:bg-red-400 dark:bg-red-900 dark:hover:bg-red-600 text-slate-900 dark:text-slate-100 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-red-200 dark:focus:ring-red-800"
            aria-label="Logout"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
