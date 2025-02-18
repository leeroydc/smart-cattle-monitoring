
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';

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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Type</label>
              <div className="text-lg font-bold text-primary">{userRole}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Access Level</label>
              <div className="text-lg">
                {userRole === 'Management' ? 'Full Access' : 'Limited Access'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="outline">
              Edit Profile
            </Button>
            <Button className="w-full" variant="outline">
              Change Password
            </Button>
            <Button className="w-full" variant="outline">
              Update Contact Information
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
