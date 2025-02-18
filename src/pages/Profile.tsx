
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle, Shield, Key } from 'lucide-react';

const Profile = () => {
  const { userRole } = useAuth();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <UserCircle className="w-16 h-16 text-primary" />
            <div>
              <CardTitle>Account Information</CardTitle>
              <p className="text-muted-foreground">Your profile details</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-accent/20 rounded-lg">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Account Type</p>
              <p className="text-lg text-primary">{userRole}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-accent/20 rounded-lg">
            <Key className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Access Level</p>
              <p className="text-lg">{userRole === 'Management' ? 'Full Access' : 'Limited Access'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
