
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Settings = () => {
  const [newCattleId, setNewCattleId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleAddCattle = (e: React.FormEvent) => {
    e.preventDefault();
    // Add cattle logic here
    setNewCattleId('');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Change password logic here
    setNewPassword('');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Cattle</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Add Cattle</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Cattle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCattle} className="space-y-4">
                  <Input
                    placeholder="Cattle ID"
                    value={newCattleId}
                    onChange={(e) => setNewCattleId(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full">Add</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Change Password</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full">Update Password</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
