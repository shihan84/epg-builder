'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Channel {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  language?: string;
  category?: string;
  streamUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: '',
    category: '',
    streamUrl: '',
    isActive: true,
  });
  const { toast } = useToast();

  const languages = [
    'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 
    'Marathi', 'Gujarati', 'Punjabi', 'Oriya', 'Assamese', 'English'
  ];

  const categories = [
    'Entertainment', 'News', 'Sports', 'Movies', 'Music', 'Kids', 
    'Religious', 'Education', 'Lifestyle', 'Business', 'Regional'
  ];

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels');
      if (response.ok) {
        const data = await response.json();
        setChannels(data.channels);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingChannel ? `/api/channels/${editingChannel.id}` : '/api/channels';
      const method = editingChannel ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: editingChannel ? 'Channel updated' : 'Channel created',
          description: `Channel ${formData.name} has been ${editingChannel ? 'updated' : 'created'} successfully`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchChannels();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to save channel',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving channel:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving the channel',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (channel: Channel) => {
    setEditingChannel(channel);
    setFormData({
      name: channel.name,
      description: channel.description || '',
      language: channel.language || '',
      category: channel.category || '',
      streamUrl: channel.streamUrl || '',
      isActive: channel.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (channelId: string) => {
    if (!confirm('Are you sure you want to delete this channel?')) {
      return;
    }

    try {
      const response = await fetch(`/api/channels/${channelId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Channel deleted',
          description: 'Channel has been deleted successfully',
        });
        fetchChannels();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete channel',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the channel',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingChannel(null);
    setFormData({
      name: '',
      description: '',
      language: '',
      category: '',
      streamUrl: '',
      isActive: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Channel Management</h1>
          <p className="text-gray-600">Manage your TV channels and their properties</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add Channel</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingChannel ? 'Edit Channel' : 'Add New Channel'}
                </DialogTitle>
                <DialogDescription>
                  {editingChannel 
                    ? 'Update the channel information below.'
                    : 'Create a new TV channel for your EPG.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Channel Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="streamUrl">Stream URL</Label>
                  <Input
                    id="streamUrl"
                    type="url"
                    value={formData.streamUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, streamUrl: e.target.value }))}
                    placeholder="https://example.com/stream.m3u8"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active Channel</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">
                  {editingChannel ? 'Update Channel' : 'Create Channel'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Channels</CardTitle>
          <CardDescription>
            List of all your TV channels ({channels.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {channels.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No channels found</p>
              <Button onClick={() => setIsDialogOpen(true)}>Add Your First Channel</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.map((channel) => (
                  <TableRow key={channel.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {channel.logo && (
                          <img 
                            src={channel.logo} 
                            alt={channel.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{channel.name}</div>
                          {channel.description && (
                            <div className="text-sm text-gray-500">{channel.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {channel.language && (
                        <Badge variant="outline">{channel.language}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {channel.category && (
                        <Badge variant="secondary">{channel.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={channel.isActive ? "default" : "destructive"}>
                        {channel.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(channel.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(channel)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(channel.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}