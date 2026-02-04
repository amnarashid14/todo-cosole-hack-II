import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ header, footer, children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    >
      {header && (
        <div className="p-6 pb-4 font-semibold border-b border-gray-200">
          {header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="p-6 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardContent: React.FC<CardContentProps> = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-4 ${className}`} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardContent, CardFooter };