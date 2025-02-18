
import React from 'react';
import { Button } from '@/components/ui/button';

const Profile = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
      
      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">Profile settings will be implemented here</p>
      </div>
    </div>
  );
};

export default Profile;
