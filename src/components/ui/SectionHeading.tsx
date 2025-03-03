import React from 'react';

interface SectionHeadingProps {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  descriptionClassName?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
  centered = false,
  className = '',
  descriptionClassName = '',
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        {title}
      </h2>
      {description && (
        <p className={`text-text-secondary text-lg ${centered ? 'mx-auto' : ''} ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;