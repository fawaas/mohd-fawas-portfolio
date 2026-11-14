import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Menu,
  X,
  Bot,
  Send,
  MessageCircle,
} from "lucide-react";
import Skillora from "./pages/Skillora";
import { useLocation } from "react-router-dom";
import "./App.css";
import FawasOS from "./pages/FawasOS";

const revealViewport = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -10% 0px",
};

const revealUp = {
  hidden: {
    opacity: 0,
    y: 45,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

const revealTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1],
};

// 3D ORB
function Orb() {
  const orb = useRef();

  useFrame((state, delta) => {
    if (!orb.current) return;

    const elapsed = state.clock.elapsedTime;

    const baseY = elapsed * 0.16;
    const baseX = Math.sin(elapsed * 0.2) * 0.15;

    const targetY = baseY + state.pointer.x * 0.55;
    const targetX = baseX + state.pointer.y * 0.35;

    const smoothness = 1 - Math.exp(-2.2 * delta);

    orb.current.rotation.y += (targetY - orb.current.rotation.y) * smoothness;

    orb.current.rotation.x += (targetX - orb.current.rotation.x) * smoothness;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={orb}>
        <mesh>
          <icosahedronGeometry args={[1.65, 5]} />
          <meshStandardMaterial
            color="#a78bfa"
            wireframe
            emissive="#6d28d9"
            emissiveIntensity={0.5}
          />
        </mesh>

        <mesh rotation={[1.1, 0.3, 0]}>
          <torusGeometry args={[2.05, 0.012, 16, 180]} />
          <meshBasicMaterial color="#a78bfa" />
        </mesh>

        <mesh rotation={[0.5, 1.2, 0]}>
          <torusGeometry args={[2.2, 0.008, 16, 180]} />
          <meshBasicMaterial color="#6366f1" />
        </mesh>
      </group>
    </Float>
  );
}
// MOVING PARTICLES
function MovingParticles() {
  const particles = useRef();

  useFrame((state, delta) => {
    if (!particles.current) return;

    const elapsed = state.clock.elapsedTime;
    const smoothness = 1 - Math.exp(-1.5 * delta);

    const targetX = state.pointer.y * 0.08;
    const targetY = state.pointer.x * 0.08;

    particles.current.rotation.x +=
      (targetX +
        Math.sin(elapsed * 0.12) * 0.025 -
        particles.current.rotation.x) *
      smoothness;

    particles.current.rotation.y +=
      (targetY + elapsed * 0.008 - particles.current.rotation.y) * smoothness;
  });

  return (
    <group ref={particles}>
      <Stars radius={80} depth={40} count={900} factor={3} fade />
    </group>
  );
}
// HERO SCENE
function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 4, 4]} intensity={3} color="#a78bfa" />
      <pointLight position={[-4, -3, 2]} intensity={2} color="#4f46e5" />
      <MovingParticles />
      <Orb />
    </Canvas>
  );
}

// MAIN APP
function App() {
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setLocalTime(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const location = useLocation();
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState([
    "MOHD FAWAS® SYSTEM TERMINAL",
    "Type 'help' to explore available commands.",
  ]);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [activeArchive, setActiveArchive] = useState(null);
  const [introLoading, setIntroLoading] = useState(
    () => !sessionStorage.getItem("fawas-intro-played"),
  );
  const [showTitleBg, setShowTitleBg] = useState(false);
  const [activeContactAction, setActiveContactAction] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const [emailCopied, setEmailCopied] = useState(false);
  // PORTFOLIO CHATBOT
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm Ask Fawas AI. Ask me anything about Fawas, his projects, skills or work.",
    },
  ]);

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);
  const handlePortfolioChatSubmit = async (e) => {
    e.preventDefault();

    const message = chatInput.trim();
    if (!message || chatLoading) return;

    const history = chatMessages.slice(1);

    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, history }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Chat request failed");
      }

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Portfolio chatbot error:", error);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [cursorPosition, setCursorPosition] = useState({
    x: -100,
    y: -100,
  });

  const handleMouseMove = (e) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  if (location.pathname === "/skillora") {
    return <Skillora />;
  }
  if (location.pathname === "/fawas-os") {
    return <FawasOS />;
  }

  const toggleTitleBackground = () => {
    setShowTitleBg((previous) => !previous);
  };
  const handleTerminalSubmit = (e) => {
    e.preventDefault();

    const command = terminalInput.trim().toLowerCase();
    if (!command) return;

    const responses = {
      help: "AVAILABLE COMMANDS: about, projects, skills, contact, clear",
      about:
        "MOHD FAWAS — Developer & Creative Technologist. Building digital experiences.",
      projects: "PROJECTS: SKILLORA | CALCORA | MORE COMING SOON.",
      skills: "SKILLS: REACT, JAVASCRIPT, PYTHON, FLASK, POSTGRESQL, CSS.",
      contact: "LET'S CONNECT: itsmefawaas@gmail.com",
    };

    if (command === "clear") {
      setTerminalHistory([]);
    } else {
      setTerminalHistory((prev) => [
        ...prev,
        `visitor@fawas:~$ ${command}`,
        responses[command] || `Command not found: ${command}. Type 'help'.`,
      ]);
    }

    setTerminalInput("");
  };

  return (
    <main onMouseMove={handleMouseMove}>
      <AnimatePresence>
        {introLoading && (
          <motion.div
            className="intro-screen"
            initial={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              scale: 1.12,
              filter: "blur(18px)",
            }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="intro-content signal-intro">
              {/* THREE ORBITAL RINGS */}
              <motion.div
                className="signal-core"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
              >
                <span className="signal-core-light" />

                <motion.div
                  className="orbit orbit-one"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  className="orbit orbit-two"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  className="orbit orbit-three"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>

              {/* SIGNAL DETECTED */}
              <motion.p
                className="signal-status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                SIGNAL DETECTED / 001
              </motion.p>

              {/* IDENTITY REVEAL */}
              <motion.h1
                className="signal-identity"
                initial={{ opacity: 0, y: 25, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 1.7, duration: 1 }}
              >
                MOHD FAWAS<span>®</span>
              </motion.h1>

              {/* PURPLE SIGNAL SWEEP */}
              <div className="signal-sweep">
                <motion.div
                  className="signal-beam"
                  initial={{ x: "-110%" }}
                  animate={{ x: "110%" }}
                  transition={{ delay: 3, duration: 1, ease: "easeInOut" }}
                  onAnimationComplete={() => {
                    sessionStorage.setItem("fawas-intro-played", "true");
                    setIntroLoading(false);
                  }}
                />
              </div>

              <span className="signal-footer">ESTABLISHING CONNECTION</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="custom-cursor"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
        }}
      />

      {/* NAVIGATION */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

      <nav className="navbar">
        <a
          href="#"
          className="brand"
          onClick={() => {
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          FAWAS<span>®</span>
          <button
            className="secret-trigger"
            onClick={() => setArchiveOpen(true)}
            aria-label="Open secret archive"
          >
            ✳
          </button>
        </a>

        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            ABOUT
          </a>
          <a href="#work" onClick={() => setMenuOpen(false)}>
            WORK
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            CONTACT
          </a>
        </div>

        <div className="nav-actions">
          <a
            href="#contact"
            className="nav-contact"
            onClick={() => setMenuOpen(false)}
          >
            LET'S TALK <ArrowUpRight size={15} />
          </a>

          <a
            href="/fawas-os"
            className="nav-contact"
            onClick={() => setMenuOpen(false)}
          >
            ENTER FAWAS OS <ArrowUpRight size={15} />
          </a>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-top">
          <span>INDEPENDENT DEVELOPER</span>
          <span className="availability">
            <i /> AVAILABLE FOR OPPORTUNITIES
          </span>
          <a href="/fawas-os" className="mobile-os-link">
            ENTER FAWAS OS <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="hero-copy">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="eyebrow"
          >
            HELLO, I&apos;M MOHD FAWAS
          </motion.p>

          <div className="hero-title-wrap">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              onClick={toggleTitleBackground}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleTitleBackground();
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={showTitleBg}
              aria-label="Toggle creative words"
              style={{ cursor: "pointer" }}
            >
              BUILDING
              <br />
              <span>DIGITAL</span>
              <br />
              EXPERIENCES<span className="purple-dot">.</span>
            </motion.h1>

            <AnimatePresence>
              {showTitleBg && (
                <motion.div
                  className="title-background-text"
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.86 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  aria-hidden="true"
                >
                  CREATE
                  <br />
                  INSPIRE
                  <br />
                  INNOVATE
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            Developer. Creative Technologist. Digital Creator.
            <br />
            Turning ideas into meaningful digital experiences.
          </motion.p>
          <div className="hero-actions"></div>
          <motion.a
            href="#work"
            className="explore-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
          >
            EXPLORE MY WORK <ArrowUpRight size={17} />
          </motion.a>
        </div>

        <div className="orb-container">
          <HeroScene />
        </div>

        <div className="hero-bottom">
          <span>DESIGNING THE FUTURE / 2026</span>
          <span>
            SCROLL TO EXPLORE <ArrowDown size={14} />
          </span>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <motion.span
          className="section-label"
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={revealUp}
          transition={revealTransition}
        >
          01 / ABOUT ME
        </motion.span>

        <div className="about-layout">
          <motion.div
            className="about-content"
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            variants={revealUp}
            transition={revealTransition}
          >
            <p className="about-eyebrow">A LITTLE ABOUT ME</p>

            <h2>
              Curious mind.
              <br />
              <span>Creative thinking.</span>
              <br />
              Digital execution.
            </h2>

            <p className="about-description">
              I'm Mohd Fawas, a developer and creative technologist passionate
              about building modern websites and meaningful digital experiences.
              I enjoy turning ideas into digital products through design,
              technology and experimentation.
            </p>

            <div className="about-bottom">
              <span>THINK. CREATE. BUILD.</span>
              <span>BASED IN INDIA ↗</span>
            </div>
          </motion.div>

          <motion.div
            className="profile-interaction"
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="profile-photo">
              <img src="/fawas.png" alt="Mohd Fawas" />
            </div>
            <span className="profile-caption">MOHD FAWAS® — DEVELOPER</span>
          </motion.div>
        </div>
      </section>

      {/* ORA ECOSYSTEM */}
      <section className="work-section" id="work">
        <motion.span
          className="section-label"
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={revealUp}
          transition={revealTransition}
        >
          02 / THE ORA ECOSYSTEM
        </motion.span>

        <motion.div
          className="ora-intro"
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={revealUp}
          transition={revealTransition}
        >
          <h2>
            ORA<span>®</span>
          </h2>
          <h3>A NEW GENERATION OF DIGITAL PRODUCTS</h3>
          <p>Think beyond ordinary.</p>
          <span className="ora-description">
            Building meaningful digital products designed to make everyday life
            better.
          </span>
        </motion.div>

        <motion.div
          className="project-grid"
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.16 },
            },
          }}
        >
          <motion.a
            className="project-card"
            href="/skillora"
            variants={revealUp}
            transition={revealTransition}
          >
            <span>01 / WEB APPLICATION</span>
            <h3>SKILLORA</h3>
            <p>A campus skill-sharing platform.</p>
            <ArrowUpRight />
          </motion.a>

          <motion.a
            className="project-card"
            href=""
            target="_blank"
            rel="noreferrer"
            variants={revealUp}
            transition={revealTransition}
          >
            <span>02 / WEB TOOL</span>
            <h3>CALCORA</h3>
            <p>A modern collection of digital utilities.</p>
            <ArrowUpRight />
          </motion.a>

          <motion.div
            className="project-card future-product-card"
            variants={revealUp}
            transition={revealTransition}
          >
            <span>03 / IN DEVELOPMENT</span>
            <h3>
              NEXT ORA PRODUCT<span className="purple-dot">.</span>
            </h3>
            <p>Something new is taking shape.</p>
            <div className="product-loading">
              <span className="loading-dot"></span>
              <span>LOADING NEXT PRODUCT</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* INTERACTIVE TERMINAL POPUP */}
      <AnimatePresence>
        {terminalOpen && (
          <motion.div
            className="terminal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTerminalOpen(false)}
          >
            <motion.div
              className="terminal-modal"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="section-label">03 / DEVELOPER TERMINAL</span>

              <div className="terminal-window">
                <button
                  className="terminal-close"
                  onClick={() => setTerminalOpen(false)}
                  aria-label="Close terminal"
                >
                  ×
                </button>
                <div className="terminal-topbar">
                  <div className="terminal-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span>FAWAS_TERMINAL.EXE</span>
                  <span className="terminal-status">● ONLINE</span>
                </div>

                <div className="terminal-screen">
                  <div className="terminal-output">
                    {terminalHistory.map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>

                  <form
                    onSubmit={handleTerminalSubmit}
                    className="terminal-form"
                  >
                    <span>visitor@fawas:~$</span>
                    <input
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Type a command..."
                      autoComplete="off"
                      spellCheck="false"
                      aria-label="Terminal command"
                    />
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECRET ARCHIVE */}
      <AnimatePresence>
        {archiveOpen && (
          <motion.div
            className="terminal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setArchiveOpen(false)}
          >
            <motion.div
              className="terminal-modal"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="terminal-window">
                <button
                  className="terminal-close"
                  onClick={() => setArchiveOpen(false)}
                  aria-label="Close archive"
                >
                  ×
                </button>

                <div className="terminal-topbar">
                  <div className="terminal-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span>FAWAS_CLASSIFIED.ARCHIVE</span>
                  <span className="terminal-status">● RESTRICTED</span>
                </div>

                <div className="terminal-screen">
                  <div className="archive-access">
                    <span className="access-dot" />
                    ACCESS GRANTED / 001
                    <span className="access-line" />
                    <span>ENCRYPTED CONNECTION</span>
                  </div>
                  <h2>THE SECRET ARCHIVE</h2>
                  <div className="archive-content">
                    <p className="section-label">ACCESS GRANTED / 001</p>

                    <h2>
                      THE SECRET ARCHIVE<span>.</span>
                    </h2>
                    <p className="archive-subtitle">
                      A collection of ideas beyond the public interface.
                    </p>

                    <div className="archive-grid">
                      <div
                        className={`archive-card ${activeArchive === 1 ? "selected" : ""}`}
                        onClick={() =>
                          setActiveArchive(activeArchive === 1 ? null : 1)
                        }
                      >
                        <span>01 / EXPERIMENTS</span>
                        <h3>THE LAB</h3>
                        <p>Ideas, prototypes and experiments in progress.</p>
                        <span className="archive-status">● ACTIVE</span>
                      </div>

                      <div
                        className={`archive-card ${activeArchive === 1 ? "selected" : ""}`}
                        onClick={() =>
                          setActiveArchive(activeArchive === 1 ? null : 1)
                        }
                      >
                        <span>02 / UNRELEASED</span>
                        <h3>COMING SOON</h3>
                        <p>Projects waiting for their moment.</p>
                        <span className="archive-status">● CLASSIFIED</span>
                      </div>

                      <div className="archive-card">
                        <span>03 / THE VISION</span>
                        <h3>BEYOND CODE</h3>
                        <p>Building digital experiences that matter.</p>
                        <span className="archive-status">● CONFIDENTIAL</span>
                      </div>
                    </div>
                  </div>

                  <div className="archive-entry">
                    <span>01 / EXPERIMENTS</span>
                    <p>Ideas currently in development.</p>
                  </div>

                  <div className="archive-entry">
                    <span>02 / UNRELEASED</span>
                    <p>Projects not yet ready for the world.</p>
                  </div>

                  <div className="archive-entry">
                    <span>03 / THE VISION</span>
                    <p>Building things that make a difference.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTACT */}
      <motion.section
        className="contact-section"
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        <motion.span
          variants={revealUp}
          transition={revealTransition}
          className="section-label"
        >
          04 / GET IN TOUCH
        </motion.span>

        <motion.h2 variants={revealUp} transition={revealTransition}>
          Have something ambitious in mind?
        </motion.h2>

        <motion.p
          className="contact-description"
          variants={revealUp}
          transition={revealTransition}
        >
          Open to collaborations, creative projects, opportunities and building
          the next generation of digital products.
        </motion.p>

        <motion.div
          className="contact-actions"
          variants={revealUp}
          transition={revealTransition}
        >
          <a
            href="mailto:itsmefawaas@gmail.com"
            className={`contact-link ${activeContactAction === 0 ? "active" : ""}`}
            onClick={() => setActiveContactAction(0)}
          >
            LET&apos;S CREATE SOMETHING <ArrowUpRight />
          </a>

          <a
            href="#work"
            className={`contact-link ${activeContactAction === 1 ? "active" : ""}`}
            onClick={() => setActiveContactAction(1)}
          >
            EXPLORE THE ORA ECOSYSTEM <ArrowUpRight />
          </a>
        </motion.div>
        <motion.button
          className="contact-email-copy"
          variants={revealUp}
          transition={revealTransition}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText("itsmefawaas@gmail.com");
              setEmailCopied(true);
              setTimeout(() => setEmailCopied(false), 2000);
            } catch {
              setEmailCopied(false);
            }
          }}
        >
          {emailCopied ? "EMAIL COPIED ✓" : "COPY EMAIL +"}
        </motion.button>
        <motion.div
          className="social-links"
          variants={revealUp}
          transition={revealTransition}
        >
          <a href="https://github.com/fawaas" target="_blank" rel="noreferrer">
            GITHUB ↗
          </a>

          <a
            href="https://www.linkedin.com/in/mohammed-fawas-bb6140318/"
            target="_blank"
            rel="noreferrer"
          >
            LINKEDIN ↗
          </a>

          <a
            href="https://instagram.com/ft.fawaas/"
            target="_blank"
            rel="noreferrer"
          >
            INSTAGRAM ↗
          </a>
        </motion.div>
      </motion.section>

      {/* FOOTER */}

      <footer className="site-footer">
        <span>MOHD FAWAS®</span>

        <span>
          BUILDING DIGITAL EXPERIENCES.
          <span className="footer-time"> · BLR {localTime}</span>
        </span>

        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          BACK TO TOP ↑
        </button>

        <span>© 2026</span>
      </footer>
      {/* PORTFOLIO CHATBOT */}
      <div className="portfolio-chat-widget">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              className="portfolio-chat-panel"
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
            >
              <div className="portfolio-chat-header">
                <div>
                  <span className="portfolio-chat-status"></span>
                  <strong>ASK FAWAS AI</strong>
                  <p>Your personal AI assistant</p>
                </div>
                <button onClick={() => setChatOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="portfolio-chat-messages">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`portfolio-chat-bubble ${msg.role}`}
                  >
                    {msg.content}
                  </div>
                ))}

                {chatLoading && (
                  <div className="portfolio-chat-bubble assistant">
                    Thinking...
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <form
                className="portfolio-chat-form"
                onSubmit={handlePortfolioChatSubmit}
              >
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything..."
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                >
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="portfolio-chat-launcher"
          onClick={() => setChatOpen(!chatOpen)}
          aria-label="Open Ask Fawas AI"
        >
          {chatOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>
    </main>
  );
}

export default App;
