
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';

interface AddCattleForm {
  tagNumber: string;
  temperature: number;
  healthStatus: 'Healthy' | 'Under Treatment' | 'Critical';
  location: 'Feeding' | 'Water' | 'Resting';
}

const Settings = () => {
  const [newPassword, setNewPassword] = useState('');
  const [formData, setFormData] = useState<AddCattleForm>({
    tagNumber: '',
    temperature: 37.5,
    healthStatus: 'Healthy',
    location: 'Resting'
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleAddCattle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('cattle')
        .insert([{
          tag_number: formData.tagNumber,
          temperature: formData.temperature,
          health_status: formData.healthStatus,
          location: formData.location
        }])
        .select();

      if (error) throw error;

      toast.success('Cattle added successfully');
      setIsOpen(false);
      setFormData({
        tagNumber: '',
        temperature: 37.5,
        healthStatus: 'Healthy',
        location: 'Resting'
      });
    } catch (error: any) {
      toast.error(error.message);
    }
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
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Add Cattle</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Cattle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCattle} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tag Number</label>
                    <Input
                      placeholder="Enter tag number"
                      value={formData.tagNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, tagNumber: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Temperature (°C)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Health Status</label>
                    <Select
                      value={formData.healthStatus}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, healthStatus: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select health status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Healthy">Healthy</SelectItem>
                        <SelectItem value="Under Treatment">Under Treatment</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Select
                      value={formData.location}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Feeding">Feeding</SelectItem>
                        <SelectItem value="Water">Water</SelectItem>
                        <SelectItem value="Resting">Resting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
