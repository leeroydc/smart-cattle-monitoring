
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const Settings = () => {
  const settingsCategories = [
    {
      title: 'Cattle Management',
      options: ['Add New Cattle', 'Remove Cattle Record', 'Edit Cattle Details'],
    },
    {
      title: 'System Preferences',
      options: ['Notification Settings', 'Data Export Options', 'Language Settings'],
    },
    {
      title: 'Account Settings',
      options: ['Change Password', 'Update Email', 'Two-Factor Authentication'],
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.options.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {option}
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Settings;
