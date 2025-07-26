import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { layouts } from '@/lib/design-system';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  showBackButton?: boolean;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  icon,
  showBackButton = true,
  breadcrumbs,
  children
}: PageHeaderProps) {
  return (
    <section className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-400/15 rounded-full blur-lg"></div>
        </div>
      </div>

      <div className={`${layouts.container} relative z-10`}>
        <div className="py-16 lg:py-20">
          {/* Breadcrumbs */}
          {breadcrumbs && (
            <nav className="flex items-center space-x-2 text-sm text-orange-100 mb-6" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronRight className="h-4 w-4" />}
                  {crumb.href ? (
                    <Link 
                      to={crumb.href} 
                      className="hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white font-medium">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Back Button */}
          {showBackButton && (
            <Link
              to="/"
              className="inline-flex items-center text-orange-100 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          )}

          {/* Header Content */}
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              {icon && (
                <div className="mr-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  {icon}
                </div>
              )}
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold mb-4">
                  {title}
                </h1>
                <p className="text-lg lg:text-xl text-blue-100 max-w-2xl">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Content */}
          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
