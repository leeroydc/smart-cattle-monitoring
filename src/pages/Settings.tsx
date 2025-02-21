
import React, { useState, useEffect } from 'react';
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AddCattleForm {
  tagNumber: string;
  temperature: number;
  weight: number;
  healthStatus: 'Healthy' | 'Under Treatment' | 'Critical';
  location: 'Feeding' | 'Water' | 'Resting';
}

interface Cattle {
  id: string;
  tag_number: string;
  temperature: number;
  weight: number;
  health_status: string;
  location: string;
}

const Settings = () => {
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AddCattleForm>({
    tagNumber: '',
    temperature: 37.5,
    weight: 500,
    healthStatus: 'Healthy',
    location: 'Resting'
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cattleList, setCattleList] = useState<Cattle[]>([]);
  const [selectedCattleId, setSelectedCattleId] = useState<string>('');

  useEffect(() => {
    fetchCattleList();
  }, []);

  const fetchCattleList = async () => {
    const { data, error } = await supabase
      .from('cattle')
      .select('*');

    if (data) {
      setCattleList(data);
    } else if (error) {
      toast.error('Failed to fetch cattle list');
    }
  };

  const handleAddCattle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('cattle')
        .insert([{
          tag_number: formData.tagNumber,
          temperature: formData.temperature,
          weight: formData.weight,
          health_status: formData.healthStatus,
          location: formData.location
        }])
        .select();

      if (error) throw error;

      toast.success('Cattle added successfully!', {
        description: `Tag number: ${formData.tagNumber}`
      });
      
      setIsOpen(false);
      setFormData({
        tagNumber: '',
        temperature: 37.5,
        weight: 500,
        healthStatus: 'Healthy',
        location: 'Resting'
      });
      
      fetchCattleList(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to add cattle: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCattle = async () => {
    if (!selectedCattleId) {
      toast.error('Please select a cattle to delete');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cattle')
        .delete()
        .eq('id', selectedCattleId);

      if (error) throw error;

      toast.success('Cattle deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedCattleId('');
      fetchCattleList(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to delete cattle: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setNewPassword('');
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      toast.error('Failed to update password: ' + error.message);
    } finally {
      setIsLoading(false);
    }
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
            <CardTitle>Cattle Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="default">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Cattle
                </Button>
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
                    <label className="text-sm font-medium">Weight (kg)</label>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Cattle'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Cattle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Cattle</DialogTitle>
                  <DialogDescription>
                    Select the cattle you want to remove from the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Select
                    value={selectedCattleId}
                    onValueChange={setSelectedCattleId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cattle to delete" />
                    </SelectTrigger>
                    <SelectContent>
                      {cattleList.map((cattle) => (
                        <SelectItem key={cattle.id} value={cattle.id}>
                          Tag: {cattle.tag_number} - {cattle.health_status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedCattleId && (
                    <div className="flex items-center p-3 space-x-2 bg-destructive/10 rounded-md">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <p className="text-sm text-destructive">
                        This action cannot be undone. The cattle will be permanently removed from the system.
                      </p>
                    </div>
                  )}

                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={!selectedCattleId || isLoading}
                    onClick={handleDeleteCattle}
                  >
                    {isLoading ? 'Deleting...' : 'Confirm Delete'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Change Password</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your new password below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
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
