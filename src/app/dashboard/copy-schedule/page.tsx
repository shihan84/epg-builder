'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Channel {
  id: string;
  name: string;
  language?: string;
}

interface Schedule {
  id: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringDays?: string;
  notes?: string;
  channel: {
    id: string;
    name: string;
  };
  program: {
    id: string;
    title: string;
    duration: number;
  };
}

export default function CopySchedulePage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [sourceChannelId, setSourceChannelId] = useState('');
  const [targetChannelId, setTargetChannelId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (sourceChannelId) {
      fetchSchedules();
    } else {
      setSchedules([]);
      setSelectedSchedules([]);
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

  const fetchSchedules = async () => {
    if (!sourceChannelId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/schedules?channelId=${sourceChannelId}`);
      if (response.ok) {
        const data = await response.json();
        setSchedules(data.schedules);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleSelect = (scheduleId: string, checked: boolean) => {
    setSelectedSchedules(prev => 
      checked 
        ? [...prev, scheduleId]
        : prev.filter(id => id !== scheduleId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSchedules(schedules.map(s => s.id));
    } else {
      setSelectedSchedules([]);
    }
  };

  const handleCopySchedule = async () => {
    if (!targetChannelId || selectedSchedules.length === 0 || !selectedDate) {
      toast({
        title: 'Error',
        description: 'Please select target channel, schedules, and date',
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
      const response = await fetch('/api/schedules/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceChannelId,
          targetChannelId,
          scheduleIds: selectedSchedules,
          targetDate: selectedDate.toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Schedule copied successfully',
          description: `${data.copiedCount} schedules have been copied to ${channels.find(c => c.id === targetChannelId)?.name}`,
        });
        setSelectedSchedules([]);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to copy schedules',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error copying schedules:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while copying schedules',
        variant: 'destructive',
      });
    } finally {
      setIsCopying(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Copy Schedule</h1>
        <p className="text-gray-600">Copy schedules from one channel to another</p>
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

            <div className="space-y-2">
              <Label>Target Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              {selectedDate && (
                <p className="text-sm text-gray-600">
                  Selected: {formatDate(selectedDate)}
                </p>
              )}
            </div>

            <Button 
              onClick={handleCopySchedule}
              disabled={isCopying || !targetChannelId || selectedSchedules.length === 0 || !selectedDate}
              className="w-full"
            >
              {isCopying ? 'Copying...' : `Copy ${selectedSchedules.length} Schedule${selectedSchedules.length !== 1 ? 's' : ''}`}
            </Button>
          </CardContent>
        </Card>

        {/* Schedules List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Schedules</CardTitle>
              <CardDescription>
                {sourceChannelId 
                  ? `Schedules from ${channels.find(c => c.id === sourceChannelId)?.name}`
                  : 'Select a source channel to view schedules'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : !sourceChannelId ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Select a source channel to view schedules</p>
                </div>
              ) : schedules.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No schedules found for this channel</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="selectAll"
                        checked={selectedSchedules.length === schedules.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="selectAll">Select All</Label>
                    </div>
                    <Badge variant="outline">
                      {selectedSchedules.length} of {schedules.length} selected
                    </Badge>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>Start Time</TableHead>
                          <TableHead>End Time</TableHead>
                          <TableHead>Recurring</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedSchedules.includes(schedule.id)}
                                onChange={(e) => handleScheduleSelect(schedule.id, e.target.checked)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div>
                                <div>{schedule.program.title}</div>
                                <div className="text-sm text-gray-500">
                                  {schedule.program.duration} min
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(schedule.startTime).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {new Date(schedule.endTime).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {schedule.isRecurring ? (
                                <Badge variant="default">Recurring</Badge>
                              ) : (
                                <Badge variant="secondary">Once</Badge>
                              )}
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
          <CardTitle>How to Use Schedule Copy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Select Channels</h4>
              <p className="text-gray-600">
                Choose the source channel (where schedules are copied from) and target channel (where schedules will be copied to).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. Choose Schedules</h4>
              <p className="text-gray-600">
                Select which schedules you want to copy from the source channel. You can select individual schedules or all of them.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. Set Target Date</h4>
              <p className="text-gray-600">
                Choose the date where the copied schedules should start on the target channel. The system will adjust times accordingly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}