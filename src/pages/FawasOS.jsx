import { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Folder,
  Music2,
  Bot,
  Monitor,
  X,
  User,
  ArrowLeft,
  Minus,
  Maximize2,
  NotebookPen,
  Images,
  Settings2,
  Info,
} from "lucide-react";
import "./FawasOS.css";

const apps = [
  { id: "about", name: "About Me", icon: User },
  { id: "projects", name: "My Projects", icon: Folder },
  { id: "terminal", name: "Terminal", icon: Terminal },
  { id: "sound", name: "Sound Studio", icon: Music2 },
  { id: "assistant", name: "Ask Fawas", icon: Bot },
  { id: "notes", name: "Notes", icon: NotebookPen },
  { id: "gallery", name: "Gallery", icon: Images },
  { id: "settings", name: "Settings", icon: Settings2 },
  { id: "system", name: "System Info", icon: Info },
];

function FawasOS() {
  const [openApps, setOpenApps] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [windowPositions, setWindowPositions] = useState({});
  const dragRef = useRef(null);
  const [time, setTime] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [audioTracks, setAudioTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [osTheme, setOsTheme] = useState(
    localStorage.getItem("fawas-os-theme") || "purple",
  );

  useEffect(() => {
    localStorage.setItem("fawas-os-theme", osTheme);
  }, [osTheme]);
  const [wallpaper, setWallpaper] = useState(
    () => localStorage.getItem("fawas-os-wallpaper") || "default",
  );

  useEffect(() => {
    localStorage.setItem("fawas-os-wallpaper", wallpaper);
  }, [wallpaper]);
  const [notes, setNotes] = useState(
    () => localStorage.getItem("fawas-os-notes") || "",
  );

  useEffect(() => {
    localStorage.setItem("fawas-os-notes", notes);
  }, [notes]);
  // ASK FAWAS AI
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! I'm Ask Fawas AI. 👋 Ask me about Fawas, his projects, skills or anything you'd like to know.",
    },
  ]);

  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [chatMessages, chatLoading]);
  const [minimizedApps, setMinimizedApps] = useState([]);
  const [maximizedApps, setMaximizedApps] = useState([]);
  const handleDragStart = (e, id) => {
    if (e.target.closest("button")) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    const position = windowPositions[id] || { x: 0, y: 0 };

    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    };

    setActiveApp(id);
  };

  const handleDragMove = (e) => {
    if (!dragRef.current) return;

    const { id, startX, startY, originX, originY } = dragRef.current;

    setWindowPositions((prev) => ({
      ...prev,
      [id]: {
        x: originX + e.clientX - startX,
        y: originY + e.clientY - startY,
      },
    }));
  };

  const handleDragEnd = () => {
    dragRef.current = null;
  };

  useEffect(() => {
    const updateClock = () => {
      setTime(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date()),
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (id) => {
    if (!openApps.includes(id)) {
      setOpenApps((prev) => [...prev, id]);
    }

    setMinimizedApps((prev) => prev.filter((app) => app !== id));
    setActiveApp(id);
  };

  const minimizeApp = (id) => {
    setMinimizedApps((prev) => [...prev.filter((app) => app !== id), id]);
    setActiveApp(null);
  };
  const maximizeApp = (id) => {
    setMaximizedApps((prev) =>
      prev.includes(id) ? prev.filter((app) => app !== id) : [...prev, id],
    );

    setActiveApp(id);
  };
  const closeApp = (id) => {
    setOpenApps((prev) => prev.filter((app) => app !== id));
    setActiveApp(null);
  };
  const handleAudioUpload = (e) => {
    const files = Array.from(e.target.files || []);

    const newTracks = files
      .filter((file) => file.type.startsWith("audio/"))
      .map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));

    setAudioTracks((prev) => [...prev, ...newTracks]);
    e.target.value = "";
  };
  const renderContent = (id) => {
    switch (id) {
      case "about":
        return (
          <>
            <h2>
              MOHD FAWAS<span>.</span>
            </h2>
            <p>Developer · Creative Technologist · Digital Creator</p>
            <p>Building meaningful digital experiences.</p>
          </>
        );

      case "projects":
        return (
          <>
            <h2>MY PROJECTS</h2>
            <div className="os-project">
              <strong>SKILLORA</strong>
              <p>Campus skill-sharing platform.</p>
              <a
                href="https://skillora-hazel-six.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                OPEN PROJECT ↗
              </a>
            </div>
            <div className="os-project">
              <strong>CALCORA</strong>
              <p>Modern collection of digital utilities.</p>
              <a
                href="https://calcora.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                OPEN PROJECT ↗
              </a>
            </div>
          </>
        );

      case "terminal":
        return (
          <>
            <h2>FAWAS TERMINAL</h2>
            <p>System initialized successfully.</p>
            <p className="os-terminal-line">root@fawas:~$ welcome</p>
            <p>Welcome to FAWAS OS®.</p>
            <p className="os-terminal-line">root@fawas:~$ status</p>
            <p>ALL SYSTEMS OPERATIONAL.</p>
          </>
        );

      case "sound":
        return (
          <div className="os-sound-studio os-player-pro">
            <div className="os-player-visual">
              <div className="os-player-wave">
                {Array.from({ length: 35 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      "--bar-height": `${12 + Math.abs(Math.sin(i * 0.55)) * 65}px`,
                    }}
                  />
                ))}
              </div>

              <div className="os-player-art">
                <div className="os-player-art-inner">
                  <span>☾</span>
                  <div className="os-art-horizon" />
                  <div className="os-art-palms">♣</div>
                </div>
              </div>
            </div>

            <div className="os-player-track-info">
              <div className="os-player-track-title">
                <span className="os-player-live-dot" />
                <h2>
                  {audioTracks.length > 0
                    ? audioTracks[currentTrack]?.name
                    : "NO TRACK SELECTED"}
                </h2>
              </div>
              <p>
                FAWAS OS <span>•</span> SOUND STUDIO
              </p>
            </div>

            <label className="os-audio-upload os-player-upload">
              + ADD YOUR MUSIC
              <input
                type="file"
                accept="audio/*"
                multiple
                onChange={handleAudioUpload}
                hidden
              />
            </label>

            {audioTracks.length > 0 && (
              <>
                <audio
                  key={audioTracks[currentTrack]?.url}
                  ref={audioRef}
                  src={audioTracks[currentTrack]?.url}
                  onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.target.duration)}
                  onEnded={() => {
                    if (currentTrack < audioTracks.length - 1) {
                      setCurrentTrack((prev) => prev + 1);
                      setIsPlaying(true);
                    } else {
                      setIsPlaying(false);
                    }
                  }}
                />

                <div className="os-player-progress">
                  <span>
                    {Math.floor(currentTime / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {Math.floor(currentTime % 60)
                      .toString()
                      .padStart(2, "0")}
                  </span>

                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={Math.min(currentTime, duration || 0)}
                    onChange={(e) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Number(e.target.value);
                        setCurrentTime(Number(e.target.value));
                      }
                    }}
                  />

                  <span>
                    {Math.floor(duration / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {Math.floor(duration % 60)
                      .toString()
                      .padStart(2, "0")}
                  </span>
                </div>

                <div className="os-player-buttons">
                  <button
                    title="Previous"
                    disabled={currentTrack === 0}
                    onClick={() => {
                      setCurrentTrack((prev) => Math.max(0, prev - 1));
                      setIsPlaying(false);
                    }}
                  >
                    |◀
                  </button>

                  <button
                    className="os-player-main-button"
                    title={isPlaying ? "Pause" : "Play"}
                    onClick={async () => {
                      if (!audioRef.current) return;

                      if (isPlaying) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        audioRef.current.volume = volume;
                        await audioRef.current.play();
                        setIsPlaying(true);
                      }
                    }}
                  >
                    {isPlaying ? "Ⅱ" : "▶"}
                  </button>

                  <button
                    title="Next"
                    disabled={currentTrack >= audioTracks.length - 1}
                    onClick={() => {
                      setCurrentTrack((prev) =>
                        Math.min(audioTracks.length - 1, prev + 1),
                      );
                      setIsPlaying(false);
                    }}
                  >
                    ▶|
                  </button>
                </div>

                <div className="os-player-volume">
                  <span>◖</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => {
                      const nextVolume = Number(e.target.value);
                      setVolume(nextVolume);
                      if (audioRef.current) {
                        audioRef.current.volume = nextVolume;
                      }
                    }}
                  />
                  <span>◖))</span>
                </div>

                <div className="os-player-playlist">
                  <div className="os-player-playlist-heading">
                    <h3>UP NEXT</h3>
                    <span>{audioTracks.length} TRACKS</span>
                  </div>

                  {audioTracks.map((track, index) => (
                    <button
                      className={`os-player-track ${
                        currentTrack === index ? "active" : ""
                      }`}
                      key={`${track.name}-${index}`}
                      onClick={async () => {
                        setCurrentTrack(index);
                        setIsPlaying(true);

                        setTimeout(async () => {
                          if (audioRef.current) {
                            audioRef.current.volume = volume;
                            await audioRef.current.play();
                          }
                        }, 150);
                      }}
                    >
                      <span className="os-track-number">
                        {currentTrack === index
                          ? "♫"
                          : String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="os-track-name">{track.name}</span>
                      <span className="os-track-arrow">↗</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {audioTracks.length === 0 && (
              <p className="os-player-empty">
                Your music collection is waiting. Add your first track.
              </p>
            )}
          </div>
        );

      case "notes":
        return (
          <>
            <h2>MY NOTES</h2>

            <textarea
              className="os-notes-editor"
              placeholder="Write your thoughts here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <p className="os-notes-status">
              <span>●</span> SAVED AUTOMATICALLY
            </p>
          </>
        );
      case "gallery":
        return (
          <>
            <h2>MY GALLERY</h2>
            <p>Your personal visual collection.</p>

            <div className="os-gallery-grid">
              <img
                src="/fawas.png"
                alt="Fawas portrait"
                onClick={() => setSelectedImage("/fawas.png")}
              />
              <img
                src="/skillora-home.png"
                alt="Skillora"
                onClick={() => setSelectedImage("/skillora-home.png")}
              />
              <img
                src="/skillora-dashboard.png"
                alt="Skillora dashboard"
                onClick={() => setSelectedImage("/skillora-dashboard.png")}
              />
            </div>
          </>
        );
      case "settings":
        return (
          <>
            <h2>FAWAS OS SETTINGS</h2>
            <p>Personalize your digital environment.</p>

            <h3>ACCENT THEME</h3>

            <div className="os-theme-options">
              <button onClick={() => setOsTheme("purple")}>PURPLE</button>
              <button onClick={() => setOsTheme("blue")}>BLUE</button>
              <button onClick={() => setOsTheme("red")}>RED</button>
            </div>

            <p>Selected theme: {osTheme.toUpperCase()}</p>
            <h3>DESKTOP WALLPAPER</h3>

            <div className="os-theme-options">
              <button onClick={() => setWallpaper("default")}>DEFAULT</button>

              <button onClick={() => setWallpaper("midnight")}>MIDNIGHT</button>

              <button onClick={() => setWallpaper("nebula")}>NEBULA</button>
            </div>

            <p>Selected wallpaper: {wallpaper.toUpperCase()}</p>
          </>
        );
      case "system":
        return (
          <>
            <h2>SYSTEM INFORMATION</h2>
            <p>FAWAS OS · PERSONAL DIGITAL ENVIRONMENT</p>

            <div className="os-system-grid">
              <div className="os-system-card">
                <span>OPERATING SYSTEM</span>
                <h3>FAWAS OS®</h3>
                <p>Version 1.0.0</p>
              </div>

              <div className="os-system-card">
                <span>SYSTEM STATUS</span>
                <h3 className="os-online">● ONLINE</h3>
                <p>All systems operational</p>
              </div>

              <div className="os-system-card">
                <span>INSTALLED APPS</span>
                <h3>{apps.length}</h3>
                <p>Applications available</p>
              </div>

              <div className="os-system-card">
                <span>ACTIVE THEME</span>
                <h3>{osTheme.toUpperCase()}</h3>
                <p>{wallpaper.toUpperCase()} wallpaper</p>
              </div>
            </div>
          </>
        );
      case "assistant":
        return (
          <div className="os-chat">
            <div className="os-chat-messages">
              {chatMessages.map((message, index) => (
                <div key={index} className={`os-chat-message ${message.role}`}>
                  {message.content}
                </div>
              ))}

              {chatLoading && (
                <div className="os-chat-message assistant">Thinking...</div>
              )}

              <div ref={chatEndRef} />
            </div>

            <form
              className="os-chat-input"
              onSubmit={async (e) => {
                e.preventDefault();

                const message = chatInput.trim();
                if (!message || chatLoading) return;

                const history = chatMessages;

                setChatMessages((prev) => [
                  ...prev,
                  { role: "user", content: message },
                ]);

                setChatInput("");
                setChatLoading(true);

                try {
                  const response = await fetch(
                    "https://mohd-fawas-portfolio.onrender.com/api/chat",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        message,
                        history,
                      }),
                    },
                  );

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.error || "AI request failed");
                  }

                  setChatMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.reply },
                  ]);
                } catch (error) {
                  setChatMessages((prev) => [
                    ...prev,
                    {
                      role: "assistant",
                      content:
                        "Sorry! I couldn't connect to my AI brain. Please try again.",
                    },
                  ]);
                  console.error(error);
                } finally {
                  setChatLoading(false);
                }
              }}
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Fawas anything..."
              />
              <button type="submit" disabled={!chatInput.trim() || chatLoading}>
                Send
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className={`fawas-os theme-${osTheme}`}>
      <header className="os-topbar">
        <span className="os-brand">✳ FAWAS OS®</span>
        <span className="os-system">SYSTEM ONLINE</span>
        <span>{time}</span>
      </header>

      <div className={`os-desktop wallpaper-${wallpaper}`}>
        <div className="os-welcome">
          <span>PERSONAL DIGITAL ENVIRONMENT / 001</span>
          <h1>
            WELCOME<span>.</span>
          </h1>
          <p>Think. Build. Create.</p>
        </div>

        <div className="os-icons">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                className="os-icon"
                key={app.id}
                onClick={() => openApp(app.id)}
              >
                <Icon size={28} />
                <span>{app.name}</span>
              </button>
            );
          })}
        </div>

        <a href="/" className="os-back-portfolio">
          <ArrowLeft size={16} />
          BACK TO PORTFOLIO
        </a>

        {openApps.map((id) => {
          const app = apps.find((item) => item.id === id);
          const Icon = app.icon;

          return (
            <section
              className={`os-window ${activeApp === id ? "os-window-active" : ""} ${maximizedApps.includes(id) ? "os-window-maximized" : ""}`}
              key={id}
              style={{
                transform: maximizedApps.includes(id)
                  ? "none"
                  : `translate(${windowPositions[id]?.x || 0}px, ${windowPositions[id]?.y || 0}px)`,
                zIndex: activeApp === id ? 10 : 2,
                display: minimizedApps.includes(id) ? "none" : "block",
              }}
              onClick={() => setActiveApp(id)}
            >
              <div
                className="os-window-title"
                onPointerDown={(e) => handleDragStart(e, id)}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
                onPointerCancel={handleDragEnd}
                style={{
                  cursor: "grab",
                  touchAction: "none",
                  userSelect: "none",
                }}
              >
                <span>
                  <Icon size={15} /> {app.name}
                </span>
                <div>
                  <button
                    onClick={() => minimizeApp(id)}
                    aria-label="Minimize window"
                  >
                    <Minus size={16} />
                  </button>

                  <button
                    onClick={() => maximizeApp(id)}
                    aria-label="Maximize window"
                  >
                    <Maximize2 size={16} />
                  </button>
                  <button
                    onClick={() => closeApp(id)}
                    aria-label="Close window"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="os-window-content">{renderContent(id)}</div>
            </section>
          );
        })}
      </div>

      <footer className="os-taskbar">
        <div className="os-task-brand">
          <Monitor size={19} /> FAWAS
        </div>

        <div className="os-task-apps">
          {openApps.map((id) => {
            const app = apps.find((item) => item.id === id);
            const Icon = app.icon;
            return (
              <button key={id} onClick={() => setActiveApp(id)}>
                <Icon size={19} />
              </button>
            );
          })}
        </div>

        <div className="os-task-right">
          <span>ONLINE</span>
          <span>{time}</span>
        </div>
      </footer>
      {selectedImage && (
        <div
          className="os-gallery-viewer"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="os-gallery-close"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>

          <img
            src={selectedImage}
            alt="Gallery preview"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}

export default FawasOS;
