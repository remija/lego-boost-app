import { useRef, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Joystick.css';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  onRelease: () => void;
  disabled: boolean;
}

export function Joystick({ onMove, onRelease, disabled }: JoystickProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTrackpadActive, setIsTrackpadActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Refs pour l'effet ressort du trackpad
  const trackpadVelocityRef = useRef({ x: 0, y: 0 });
  const trackpadPositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const lastWheelTimeRef = useRef(0);

  const maxDistance = 90; // Distance max du knob (rayon base - rayon knob)
  const trackpadSensitivity = 3; // Sensibilité du trackpad
  const springStrength = 0.3; // Force du ressort (0-1, plus élevé = retour plus rapide)
  const damping = 0.7; // Amortissement de la vélocité (0-1, plus bas = moins d'inertie)

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || disabled) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;

    // Limiter au cercle
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > maxDistance) {
      deltaX = (deltaX / distance) * maxDistance;
      deltaY = (deltaY / distance) * maxDistance;
    }

    setPosition({ x: deltaX, y: deltaY });

    // Convertir en valeurs -100 à 100
    const normalizedX = Math.round((deltaX / maxDistance) * 100);
    const normalizedY = Math.round((-deltaY / maxDistance) * 100); // Inverser Y

    onMove(normalizedX, normalizedY);
  }, [disabled, onMove, maxDistance]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (disabled) return;
    setIsDragging(true);
    handleMove(clientX, clientY);
  }, [disabled, handleMove]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onRelease();
  }, [onRelease]);

  // Animation loop pour l'effet ressort du trackpad
  const updateSpringAnimation = useCallback(() => {
    const pos = trackpadPositionRef.current;
    const vel = trackpadVelocityRef.current;
    const timeSinceLastWheel = Date.now() - lastWheelTimeRef.current;
    const isReceivingInput = timeSinceLastWheel < 50;

    // Appliquer la force du ressort vers le centre
    if (!isReceivingInput) {
      vel.x -= pos.x * springStrength;
      vel.y -= pos.y * springStrength;
    }

    // Appliquer l'amortissement
    vel.x *= damping;
    vel.y *= damping;

    // Mettre à jour la position
    let newX = pos.x + vel.x;
    let newY = pos.y + vel.y;

    // Limiter au cercle
    const distance = Math.sqrt(newX * newX + newY * newY);
    if (distance > maxDistance) {
      newX = (newX / distance) * maxDistance;
      newY = (newY / distance) * maxDistance;
    }

    // Seuil pour considérer le joystick au centre
    const centerThreshold = 5;
    const velocityThreshold = 1;
    const isNearCenter = Math.abs(newX) < centerThreshold && Math.abs(newY) < centerThreshold;
    const isSlowEnough = Math.abs(vel.x) < velocityThreshold && Math.abs(vel.y) < velocityThreshold;

    if (isNearCenter && (isSlowEnough || !isReceivingInput)) {
      // Position quasi-centrale, arrêter
      trackpadPositionRef.current = { x: 0, y: 0 };
      trackpadVelocityRef.current = { x: 0, y: 0 };
      setPosition({ x: 0, y: 0 });
      setIsTrackpadActive(false);
      onRelease();
      animationFrameRef.current = null;
      return;
    }

    trackpadPositionRef.current = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });

    // Convertir en valeurs -100 à 100
    const normalizedX = Math.round((newX / maxDistance) * 100);
    const normalizedY = Math.round((-newY / maxDistance) * 100);

    onMove(normalizedX, normalizedY);
    animationFrameRef.current = requestAnimationFrame(updateSpringAnimation);
  }, [maxDistance, springStrength, damping, onMove, onRelease]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (disabled || isDragging) return;

    e.preventDefault();
    lastWheelTimeRef.current = Date.now();

    // Ajouter la vélocité du geste trackpad
    trackpadVelocityRef.current.x += e.deltaX * trackpadSensitivity * 0.1;
    trackpadVelocityRef.current.y += e.deltaY * trackpadSensitivity * 0.1;

    if (!isTrackpadActive) {
      setIsTrackpadActive(true);
    }

    // Démarrer l'animation si pas déjà en cours
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateSpringAnimation);
    }
  }, [disabled, isDragging, isTrackpadActive, trackpadSensitivity, updateSpringAnimation]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleUp = () => handleEnd();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Écouter les événements wheel sur le container pour le trackpad
  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel, disabled]);

  // Cleanup de l'animation au démontage
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const isActive = isDragging || isTrackpadActive;

  return (
    <div className={`joystick ${disabled ? 'joystick--disabled' : ''}`}>
      <div
        ref={containerRef}
        className="joystick__container"
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      >
        <div className="joystick__base">
          <div className="joystick__axes">
            <div className="joystick__axis joystick__axis--h" />
            <div className="joystick__axis joystick__axis--v" />
          </div>
          <div
            className={`joystick__knob ${isActive ? 'joystick__knob--active' : ''} ${isTrackpadActive ? 'joystick__knob--trackpad' : ''}`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`
            }}
          />
        </div>
      </div>
      <div className="joystick__hint">
        {t('joystick.hint')}
      </div>
    </div>
  );
}
