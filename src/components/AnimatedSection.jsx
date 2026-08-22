import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const AnimatedSection = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  className = '',
  as = 'div',
  ...props
}) => {
  const [ref, isVisible] = useScrollAnimation();

  const animations = {
    'fade-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    },
    'fade-down': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
    },
    'fade-left': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
    },
    'fade-right': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
    },
    'fade-in': {
      opacity: isVisible ? 1 : 0,
    },
    'scale-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.95)',
    },
    'scale-down': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(1.05)',
    },
    'blur-in': {
      opacity: isVisible ? 1 : 0,
      filter: isVisible ? 'blur(0)' : 'blur(8px)',
    },
    'slide-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
    },
  };

  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...animations[animation],
        willChange: 'opacity, transform',
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default AnimatedSection;
