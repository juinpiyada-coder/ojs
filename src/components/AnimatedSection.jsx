import useScrollAnimation from '../hooks/useScrollAnimation';

const AnimatedSection = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  as = 'div',
  ...props
}) => {
  const [ref, isVisible] = useScrollAnimation();

  const animations = {
    'fade-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
    },
    'fade-down': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(-40px)',
    },
    'fade-left': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
    },
    'fade-right': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
    },
    'fade-in': {
      opacity: isVisible ? 1 : 0,
    },
    'scale-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.9)',
    },
    'scale-down': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(1.1)',
    },
    'blur-in': {
      opacity: isVisible ? 1 : 0,
      filter: isVisible ? 'blur(0)' : 'blur(10px)',
    },
    'slide-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
    },
  };

  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...animations[animation],
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms, filter ${duration}ms ease-out ${delay}ms`,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default AnimatedSection;
