'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Channel {
  id: string;
  name: string;
  language?: string;
}

interface Program {
  id: string;
  title: string;
  description?: string;
  duration: number;
  category?: string;
  genre?: string;
  rating?: string;
  imageUrl?: string;
  isActive: boolean;
}

export default function CopyProgramPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [sourceChannelId, setSourceChannelId] = useState('');
  const [targetChannelId, setTargetChannelId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (sourceChannelId) {
      fetchPrograms();
    } else {
      setPrograms([]);
      setSelectedPrograms([]);
    }
  }, [sourceChannelId]);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels');
      if (response.ok) {
        const data = await response.json();
        setChannels(data.channels);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchPrograms = async () => {
    if (!sourceChannelId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/programs?channelId=${sourceChannelId}`);
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.programs);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgramSelect = (programId: string, checked: boolean) => {
    setSelectedPrograms(prev => 
      checked 
        ? [...prev, programId]
        : prev.filter(id => id !== programId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPrograms(filteredPrograms.map(p => p.id));
    } else {
      setSelectedPrograms([]);
    }
  };

  const handleCopyPrograms = async () => {
    if (!targetChannelId || selectedPrograms.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select target channel and programs',
        variant: 'destructive',
      });
      return;
    }

    if (sourceChannelId === targetChannelId) {
      toast({
        title: 'Error',
        description: 'Source and target channels cannot be the same',
        variant: 'destructive',
      });
      return;
    }

    setIsCopying(true);
    try {
      const response = await fetch('/api/programs/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceChannelId,
          targetChannelId,
          programIds: selectedPrograms,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Programs copied successfully',
          description: `${data.copiedCount} programs have been copied to ${channels.find(c => c.id === targetChannelId)?.name}`,
        });
        setSelectedPrograms([]);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to copy programs',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error copying programs:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while copying programs',
        variant: 'destructive',
      });
    } finally {
      setIsCopying(false);
    }
  };

  const filteredPrograms = programs.filter(program =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Copy Programs</h1>
        <p className="text-gray-600">Copy programs from one channel to another</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Selection</CardTitle>
            <CardDescription>Select source and target channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourceChannel">Source Channel</Label>
              <Select value={sourceChannelId} onValueChange={setSourceChannelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source channel" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.name} {channel.language && `(${channel.language})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetChannel">Target Channel</Label>
              <Select value={targetChannelId} onValueChange={setTargetChannelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target channel" />
                </SelectTrigger>
                <SelectContent>
                  {channels.filter(c => c.id !== sourceChannelId).map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.name} {channel.language && `(${channel.language})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleCopyPrograms}
              disabled={isCopying || !targetChannelId || selectedPrograms.length === 0}
              className="w-full"
            >
              {isCopying ? 'Copying...' : `Copy ${selectedPrograms.length} Program${selectedPrograms.length !== 1 ? 's' : ''}`}
            </Button>
          </CardContent>
        </Card>

        {/* Programs List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Programs</CardTitle>
              <CardDescription>
                {sourceChannelId 
                  ? `Programs from ${channels.find(c => c.id === sourceChannelId)?.name}`
                  : 'Select a source channel to view programs'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Programs</Label>
                <Input
                  id="search"
                  placeholder="Search by title, description, category, or genre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : !sourceChannelId ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Select a source channel to view programs</p>
                </div>
              ) : filteredPrograms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? 'No programs match your search' : 'No programs found for this channel'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="selectAll"
                        checked={selectedPrograms.length === filteredPrograms.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="selectAll">Select All</Label>
                    </div>
                    <Badge variant="outline">
                      {selectedPrograms.length} of {filteredPrograms.length} selected
                    </Badge>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Genre</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPrograms.map((program) => (
                          <TableRow key={program.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedPrograms.includes(program.id)}
                                onChange={(e) => handleProgramSelect(program.id, e.target.checked)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                {program.imageUrl && (
                                  <img 
                                    src={program.imageUrl} 
                                    alt={program.title}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">{program.title}</div>
                                  {program.description && (
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                      {program.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{program.duration} min</TableCell>
                            <TableCell>
                              {program.category && (
                                <Badge variant="outline">{program.category}</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {program.genre && (
                                <Badge variant="secondary">{program.genre}</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={program.isActive ? "default" : "destructive"}>
                                {program.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Program Copy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Select Channels</h4>
              <p className="text-gray-600">
                Choose the source channel (where programs are copied from) and target channel (where programs will be copied to).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. Choose Programs</h4>
              <p className="text-gray-600">
                Select which programs you want to copy from the source channel. Use the search to filter programs by title, description, category, or genre.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. Copy Programs</h4>
              <p className="text-gray-600">
                Click the copy button to duplicate the selected programs to the target channel. All program metadata will be preserved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}