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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface Schedule {
  id: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringDays?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  channel: {
    id: string;
    name: string;
    language?: string;
  };
  program: {
    id: string;
    title: string;
    duration: number;
    category?: string;
  };
}

interface Channel {
  id: string;
  name: string;
  language?: string;
}

interface Program {
  id: string;
  title: string;
  duration: number;
  category?: string;
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    channelId: '',
    programId: '',
    startTime: '',
    endTime: '',
    isRecurring: false,
    recurringDays: [] as string[],
    notes: '',
  });
  const { toast } = useToast();

  const weekDays = [
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
    { value: '7', label: 'Sunday' },
  ];

  useEffect(() => {
    fetchSchedules();
    fetchChannels();
    fetchPrograms();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules');
      if (response.ok) {
        const data = await response.json();
        setSchedules(data.schedules);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

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
    try {
      const response = await fetch('/api/programs');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSchedule ? `/api/schedules/${editingSchedule.id}` : '/api/schedules';
      const method = editingSchedule ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        recurringDays: formData.isRecurring ? formData.recurringDays.join(',') : undefined,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: editingSchedule ? 'Schedule updated' : 'Schedule created',
          description: `Program schedule has been ${editingSchedule ? 'updated' : 'created'} successfully`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchSchedules();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to save schedule',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving the schedule',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      channelId: schedule.channel.id,
      programId: schedule.program.id,
      startTime: new Date(schedule.startTime).toISOString().slice(0, 16),
      endTime: new Date(schedule.endTime).toISOString().slice(0, 16),
      isRecurring: schedule.isRecurring,
      recurringDays: schedule.recurringDays ? schedule.recurringDays.split(',') : [],
      notes: schedule.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Schedule deleted',
          description: 'Schedule has been deleted successfully',
        });
        fetchSchedules();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete schedule',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the schedule',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingSchedule(null);
    setFormData({
      channelId: '',
      programId: '',
      startTime: '',
      endTime: '',
      isRecurring: false,
      recurringDays: [],
      notes: '',
    });
  };

  const handleDayChange = (dayValue: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      recurringDays: checked
        ? [...prev.recurringDays, dayValue]
        : prev.recurringDays.filter(d => d !== dayValue)
    }));
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
          <h1 className="text-3xl font-bold">Schedule Manager</h1>
          <p className="text-gray-600">Create and manage program schedules</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add Schedule</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                </DialogTitle>
                <DialogDescription>
                  {editingSchedule 
                    ? 'Update the program schedule below.'
                    : 'Create a new program schedule.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="channelId">Channel</Label>
                    <Select value={formData.channelId} onValueChange={(value) => setFormData(prev => ({ ...prev, channelId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
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
                    <Label htmlFor="programId">Program</Label>
                    <Select value={formData.programId} onValueChange={(value) => setFormData(prev => ({ ...prev, programId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.title} ({program.duration}min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
                  />
                  <Label htmlFor="isRecurring">Recurring Schedule</Label>
                </div>
                
                {formData.isRecurring && (
                  <div className="space-y-2">
                    <Label>Repeat on</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {weekDays.map((day) => (
                        <div key={day.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={day.value}
                            checked={formData.recurringDays.includes(day.value)}
                            onCheckedChange={(checked) => handleDayChange(day.value, checked as boolean)}
                          />
                          <Label htmlFor={day.value} className="text-sm">{day.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    placeholder="Additional notes about this schedule..."
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">
                  {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Schedules</CardTitle>
          <CardDescription>
            List of all your program schedules ({schedules.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No schedules found</p>
              <Button onClick={() => setIsDialogOpen(true)}>Add Your First Schedule</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Recurring</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{schedule.channel.name}</div>
                        {schedule.channel.language && (
                          <div className="text-sm text-gray-500">{schedule.channel.language}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{schedule.program.title}</div>
                        <div className="text-sm text-gray-500">{schedule.program.duration} min</div>
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
                        <Badge variant="default">
                          {schedule.recurringDays 
                            ? schedule.recurringDays.split(',').map(d => weekDays.find(wd => wd.value === d)?.label[0]).join(',')
                            : 'Recurring'
                          }
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Once</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(schedule)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(schedule.id)}
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