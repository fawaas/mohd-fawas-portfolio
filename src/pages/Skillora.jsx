import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  Users,
  BookOpen,
  Code2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Skillora() {
  const sliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const changeSlide = (index) => {
    setActiveSlide(index);

    sliderRef.current?.scrollTo({
      left: sliderRef.current.clientWidth * index,
      behavior: "smooth",
    });
  };

  const handleSliderScroll = () => {
    if (!sliderRef.current) return;

    const index = Math.round(
      sliderRef.current.scrollLeft / sliderRef.current.clientWidth,
    );

    setActiveSlide(index);
  };

  return (
    <main className="case-study">
      {/* NAVIGATION */}
      <nav className="case-nav">
        <Link to="/" className="case-back">
          <ArrowLeft size={16} />
          BACK TO PORTFOLIO
        </Link>

        <span>MOHD FAWAS®</span>

        <a
          href="https://skillora-hazel-six.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="case-nav-live"
        >
          LIVE PROJECT <ArrowUpRight size={15} />
        </a>
      </nav>

      {/* HERO */}
      <section className="case-hero">
        <p className="case-label">01 / FEATURED PROJECT</p>

        <h1>
          SKILL<span>ORA.</span>
        </h1>

        <p className="case-tagline">LEARN TOGETHER. GROW TOGETHER.</p>

        <p className="case-description">
          A campus skill-sharing platform designed to connect students, exchange
          knowledge and turn individual abilities into collective opportunities.
        </p>

        <a
          href="https://skillora-hazel-six.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="case-live"
        >
          EXPLORE LIVE PROJECT <ArrowUpRight size={18} />
        </a>
      </section>

      {/* INTERACTIVE PRODUCT SLIDER */}
      <section className="case-preview">
        <div className="case-preview-heading">
          <p className="case-label">LIVE PRODUCT / 01</p>

          <h2>
            THE PRODUCT
            <br />
            IN ACTION.
          </h2>
        </div>

        <div className="case-slider">
          <div
            className="case-slider-track"
            ref={sliderRef}
            onScroll={handleSliderScroll}
          >
            {/* SLIDE 1 */}
            <div className="case-slide">
              <p className="case-label">01 / SKILLORA HOMEPAGE</p>

              <a
                href="https://skillora-hazel-six.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/skillora-home.png" alt="Skillora homepage" />
              </a>
            </div>

            {/* SLIDE 2 */}
            <div className="case-slide">
              <p className="case-label">02 / STUDENT DASHBOARD</p>

              <img
                src="/skillora-dashboard.png"
                alt="Skillora student dashboard"
              />
            </div>
          </div>

          {/* SLIDER CONTROLS */}
          <div className="case-slider-controls">
            <button
              onClick={() => changeSlide(0)}
              aria-label="Previous slide"
              disabled={activeSlide === 0}
            >
              <ChevronLeft size={17} />
              PREVIOUS
            </button>

            <div className="case-slider-dots">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  className={activeSlide === index ? "active" : ""}
                  onClick={() => changeSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => changeSlide(1)}
              aria-label="Next slide"
              disabled={activeSlide === 1}
            >
              NEXT
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* PROJECT DETAILS */}
      <section className="case-meta">
        <div>
          <span>PROJECT TYPE</span>
          <h3>FULL-STACK WEB APP</h3>
        </div>

        <div>
          <span>ROLE</span>
          <h3>DESIGN & DEVELOPMENT</h3>
        </div>

        <div>
          <span>PLATFORM</span>
          <h3>WEB APPLICATION</h3>
        </div>

        <div>
          <span>STATUS</span>
          <h3>LIVE PROJECT</h3>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="case-overview">
        <div>
          <p className="case-label">PROJECT OVERVIEW</p>

          <h2>
            Skills are better
            <br />
            when shared.
          </h2>
        </div>

        <p>
          Skillora creates a space where students can share what they know,
          discover new skills and connect with others who want to learn. It
          brings campus knowledge into one digital community.
        </p>
      </section>

      {/* CORE FEATURES */}
      <section className="case-features">
        <p className="case-label">CORE EXPERIENCE / 02</p>

        <h2>
          BUILT FOR
          <br />
          <span>STUDENT CONNECTIONS.</span>
        </h2>

        <div className="case-feature-grid">
          <article>
            <Users />
            <h3>STUDENT COMMUNITY</h3>
            <p>A platform built around student-to-student learning.</p>
          </article>

          <article>
            <BookOpen />
            <h3>EXPLORE SKILLS</h3>
            <p>Discover skills and learning opportunities shared by others.</p>
          </article>

          <article>
            <Sparkles />
            <h3>SHARE KNOWLEDGE</h3>
            <p>Give students a place to contribute their abilities.</p>
          </article>

          <article>
            <Code2 />
            <h3>STUDENT DASHBOARD</h3>
            <p>Manage skills and keep track of incoming requests.</p>
          </article>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="case-tech">
        <p className="case-label">03 / THE TECHNOLOGY</p>

        <h2>
          BUILT WITH
          <br />
          <span>THE RIGHT TOOLS.</span>
        </h2>

        <p className="case-tech-description">
          A modern full-stack application designed to make student-to-student
          skill exchange simple and accessible.
        </p>

        <div className="case-tech-grid">
          <article>
            <span>01</span>
            <h3>REACT</h3>
            <p>Frontend framework</p>
          </article>

          <article>
            <span>02</span>
            <h3>FLASK</h3>
            <p>Backend framework</p>
          </article>

          <article>
            <span>03</span>
            <h3>PYTHON</h3>
            <p>Backend language</p>
          </article>

          <article>
            <span>04</span>
            <h3>POSTGRESQL</h3>
            <p>Database</p>
          </article>

          <article>
            <span>05</span>
            <h3>JAVASCRIPT</h3>
            <p>Frontend language</p>
          </article>

          <article>
            <span>06</span>
            <h3>CSS</h3>
            <p>Interface styling</p>
          </article>
        </div>
      </section>

      {/* PROJECT JOURNEY */}
      <section className="case-story">
        <p className="case-label">THE JOURNEY / 04</p>

        <h2>
          FROM IDEA
          <br />
          TO EXPERIENCE.
        </h2>

        <div className="case-story-grid">
          <article>
            <span>01 / THE PROBLEM</span>
            <h3>Knowledge stays disconnected.</h3>
            <p>
              Students have valuable skills, but often lack a simple way to
              discover what others can teach and share what they know.
            </p>
          </article>

          <article>
            <span>02 / THE SOLUTION</span>
            <h3>A campus built on sharing.</h3>
            <p>
              Skillora brings students together through a digital platform where
              they can explore skills, share knowledge and connect.
            </p>
          </article>

          <article>
            <span>03 / THE BUILD</span>
            <h3>Designed and developed.</h3>
            <p>
              Built as a full-stack web application with a React frontend, Flask
              backend and PostgreSQL database.
            </p>
          </article>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="case-footer">
        <p className="case-label">THE NEXT STEP / 05</p>

        <p>BUILT WITH PURPOSE.</p>

        <h2>
          ONE CAMPUS.
          <br />
          ENDLESS SKILLS.
        </h2>

        <a
          href="https://skillora-hazel-six.vercel.app/"
          target="_blank"
          rel="noreferrer"
        >
          VISIT SKILLORA <ArrowUpRight size={18} />
        </a>
      </section>
    </main>
  );
}
