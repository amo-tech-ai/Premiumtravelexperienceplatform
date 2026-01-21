import React from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="font-serif text-6xl md:text-8xl font-bold text-primary mb-6">404</h1>
      <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg">
          Return Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;