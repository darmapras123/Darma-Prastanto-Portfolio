"use client";

import React, { useEffect, useRef, useCallback, useMemo } from "react";

const DEFAULT_BEHIND_GRADIENT =
  "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)";

const DEFAULT_INNER_GRADIENT = "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
};

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v: number, a: number, b: number, c: number, d: number) =>
  round(c + ((d - c) * (v - a)) / (b - a));
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

type Size = "sm" | "md" | "lg";

type Props = {
  avatarUrl?: string;
  iconUrl?: string;
  grainUrl?: string;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
  /** ukuran kartu: sm | md | lg (default: sm) */
  size?: Size;

  /** tampilkan/ sembunyikan tombol Contact (default: false) */
  showContactButton?: boolean;

  /** ====== BARU: Skala visual kartu (mis. 0.8, 1, 1.25) ====== */
  scale?: number;
};

const ProfileCardComponent: React.FC<Props> = ({
  avatarUrl = "/ProfileCard/avatar.png",
  iconUrl,
  grainUrl,
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = "",
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = "Darma Prastanto",
  title = "Software Engineer",
  handle = "darmap",
  status = "Online",
  contactText = "Contact Me",
  showUserInfo = true,
  onContactClick,
  size = "md", /* <======================================================= ukuran profile */
  showContactButton = false,

  /* BARU: default skala 1 */
  scale = 1.1, /* <======================================================= ukuran profile */
}) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;
    let rafId: number | null = null;

    const updateCardTransform = (
      offsetX: number,
      offsetY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const props: Record<string, string> = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      Object.entries(props).forEach(([k, v]) => wrap.style.setProperty(k, v));
    };

    const createSmoothAnimation = (
      duration: number,
      startX: number,
      startY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const loop = (now: number) => {
        const elapsed = now - startTime;
        const progress = clamp(elapsed / duration);
        const eased = easeInOutCubic(progress);

        const currentX = adjust(eased, 0, 1, startX, targetX);
        const currentY = adjust(eased, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);
        if (progress < 1) rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      },
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap || !animationHandlers) return;
      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(e.clientX - rect.left, e.clientY - rect.top, card, wrap);
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    animationHandlers.cancelAnimation();
    wrap.classList.add("active");
    card.classList.add("active");
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (e: PointerEvent & { offsetX: number; offsetY: number }) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap || !animationHandlers) return;
      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        e.offsetX,
        e.offsetY,
        card,
        wrap
      );
      wrap.classList.remove("active");
      card.classList.remove("active");
    },
    [animationHandlers]
  );

  const handleDeviceOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap || !animationHandlers) return;
      const { beta, gamma } = e;
      if (beta == null || gamma == null) return;
      animationHandlers.updateCardTransform(
        card.clientHeight / 2 + gamma * mobileTiltSensitivity,
        card.clientWidth / 2 + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        card,
        wrap
      );
    },
    [animationHandlers, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;
    const card = cardRef.current!;
    const wrap = wrapRef.current!;

    const move = handlePointerMove as unknown as EventListener;
    const enter = handlePointerEnter as unknown as EventListener;
    const leave = handlePointerLeave as unknown as EventListener;
    const orient = handleDeviceOrientation as unknown as EventListener;

    const askMotion = () => {
      if (!enableMobileTilt || location.protocol !== "https:") return;
      if (typeof (window as any).DeviceMotionEvent?.requestPermission === "function") {
        (window as any).DeviceMotionEvent.requestPermission().then((state: string) => {
          if (state === "granted") window.addEventListener("deviceorientation", orient);
        });
      } else {
        window.addEventListener("deviceorientation", orient);
      }
    };

    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("click", askMotion);

    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(ANIMATION_CONFIG.INITIAL_DURATION, initialX, initialY, card, wrap);

    return () => {
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("click", askMotion);
      window.removeEventListener("deviceorientation", orient);
      animationHandlers.cancelAnimation();
    };
  }, [enableTilt, enableMobileTilt, animationHandlers, handlePointerMove, handlePointerEnter, handlePointerLeave, handleDeviceOrientation]);

  const cardStyle = useMemo(
    () =>
      ({
        "--icon": iconUrl ? `url(${iconUrl})` : "none",
        "--grain": grainUrl ? `url(${grainUrl})` : "none",
        "--behind-gradient": showBehindGradient ? "none" : "none",
        "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
      }) as React.CSSProperties,
    [iconUrl, grainUrl, showBehindGradient, innerGradient]
  );

  const handleContactClick = useCallback(() => onContactClick?.(), [onContactClick]);

  const sizeClass =
    size === "lg" ? "pc-card--lg" : size === "md" ? "pc-card--md" : "pc-card--sm";

  return (
    /* ====== BARU: pembungkus skala. Tidak mengubah elemen lama ====== */
    <div className="pc-scale-wrap" style={{ ["--pc-scale" as any]: scale }}>
      <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
        <section ref={cardRef} className={`pc-card ${sizeClass}`}>
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-content pc-avatar-content">
              <img
                className="avatar"
                src={avatarUrl}
                alt={`${name || "User"} avatar`}
                loading="lazy"
                onError={(e: any) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      <img
                        src={miniAvatarUrl || avatarUrl}
                        alt={`${name || "User"} mini avatar`}
                        loading="lazy"
                        onError={(e: any) => {
                          const t = e.target as HTMLImageElement;
                          t.style.opacity = "0.5";
                          t.src = avatarUrl;
                        }}
                      />
                    </div>
                    <div className="pc-user-text">
                      <div className="pc-handle">@{handle}</div>
                      <div className="pc-status">{status}</div>
                    </div>
                  </div>

                  {showContactButton && (
                    <button
                      className="pc-contact-btn"
                      onClick={handleContactClick}
                      style={{ pointerEvents: "auto" }}
                      type="button"
                      aria-label={`Contact ${name || "user"}`}
                    >
                      {contactText}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="pc-content">
              <div className="pc-details">
                <h3>{name}</h3>
                <p>{title}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
