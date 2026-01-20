"use client";

import { useState, useEffect } from "react";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Play, Pause } from "lucide-react";
import type { AdFormData, AdSchedules } from "@/lib/types/ads";

interface AdSchedulesTabProps {
  watch: UseFormWatch<AdFormData>;
  setValue: UseFormSetValue<AdFormData>;
}

type UISchedule = {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
  status: "active" | "paused";
  cpc: number;
  spend: number;
  balance: number;
};

const weekDays = [
  { value: "Mon", label: "Monday", apiKey: "Monday" },
  { value: "Tue", label: "Tuesday", apiKey: "Tuesday" },
  { value: "Wed", label: "Wednesday", apiKey: "Wednesday" },
  { value: "Thu", label: "Thursday", apiKey: "Thursday" },
  { value: "Fri", label: "Friday", apiKey: "Friday" },
  { value: "Sat", label: "Saturday", apiKey: "Saturday" },
  { value: "Sun", label: "Sunday", apiKey: "Sunday" },
];

const secondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const timeToSeconds = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60;
};

export function AdSchedulesTab({ watch, setValue }: AdSchedulesTabProps) {
  const apiSchedules = watch("schedules");
  const [schedules, setSchedules] = useState<Record<number, UISchedule>>({});
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<UISchedule | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    startTime: "09:00",
    endTime: "17:00",
    days: [] as string[],
    status: "active" as "active" | "paused",
    cpc: "0.50",
    spend: "0.00",
    balance: "0.00",
  });

  useEffect(() => {
    if (apiSchedules) {
      const uiSchedules: Record<number, UISchedule> = {};
      let id = 1;

      Object.entries(apiSchedules).forEach(([day, scheduleArray]) => {
        if (scheduleArray && scheduleArray.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          scheduleArray.forEach((schedule: { start: number; stop: number; active: any; cpc: any; spend: any; balance: any }) => {
            uiSchedules[id] = {
              id,
              name: `${day} Schedule`,
              startTime: secondsToTime(schedule.start),
              endTime: secondsToTime(schedule.stop),
              days: [day === "Default" ? "Default" : day],
              status: schedule.active ? "active" : "paused",
              cpc: schedule.cpc || 0,
              spend: schedule.spend || 0,
              balance: schedule.balance || 0,
            };
            id++;
          });
        }
      });

      setSchedules(uiSchedules);
    }
  }, [apiSchedules]);

  const syncToForm = (updatedSchedules: Record<number, UISchedule>) => {
    const apiFormat: AdSchedules = {};

    Object.values(updatedSchedules).forEach((schedule) => {
      schedule.days.forEach((day) => {
        const apiDay = day === "Default" ? "Default" : (weekDays.find((d) => d.value === day)?.apiKey as keyof AdSchedules);
        if (!apiFormat[apiDay]) {
          apiFormat[apiDay] = [];
        }
        apiFormat[apiDay]!.push({
          type: day === "Default" ? "default" : "custom",
          active: schedule.status === "active",
          start: timeToSeconds(schedule.startTime),
          stop: timeToSeconds(schedule.endTime),
          cpc: schedule.cpc,
          spend: schedule.spend,
          balance: schedule.balance,
        });
      });
    });

    setValue("schedules", apiFormat, { shouldDirty: true });
  };

  const openAddSchedule = () => {
    setEditingSchedule(null);
    setScheduleForm({
      name: "",
      startTime: "09:00",
      endTime: "17:00",
      days: [],
      status: "active",
      cpc: "0.50",
      spend: "0.00",
      balance: "0.00",
    });
    setScheduleDialogOpen(true);
  };

  const openEditSchedule = (schedule: UISchedule) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      name: schedule.name,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      days: [...schedule.days],
      status: schedule.status,
      cpc: schedule.cpc.toString(),
      spend: schedule.spend.toString(),
      balance: schedule.balance.toString(),
    });
    setScheduleDialogOpen(true);
  };

  const handleSaveSchedule = () => {
    const newSchedules = { ...schedules };

    if (editingSchedule) {
      newSchedules[editingSchedule.id] = {
        ...editingSchedule,
        name: scheduleForm.name,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
        days: scheduleForm.days,
        status: scheduleForm.status,
        cpc: parseFloat(scheduleForm.cpc) || 0,
        spend: parseFloat(scheduleForm.spend) || 0,
        balance: parseFloat(scheduleForm.balance) || 0,
      };
    } else {
      const newId = Math.max(...Object.keys(schedules).map(Number), 0) + 1;
      newSchedules[newId] = {
        id: newId,
        name: scheduleForm.name,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
        days: scheduleForm.days,
        status: scheduleForm.status,
        cpc: parseFloat(scheduleForm.cpc) || 0,
        spend: parseFloat(scheduleForm.spend) || 0,
        balance: parseFloat(scheduleForm.balance) || 0,
      };
    }

    setSchedules(newSchedules);
    syncToForm(newSchedules);
    setScheduleDialogOpen(false);
    setEditingSchedule(null);
  };

  const openDeleteSchedule = (id: number) => {
    setScheduleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSchedule = () => {
    if (scheduleToDelete) {
      const newSchedules = { ...schedules };
      delete newSchedules[scheduleToDelete];
      setSchedules(newSchedules);
      syncToForm(newSchedules);
    }
    setDeleteDialogOpen(false);
    setScheduleToDelete(null);
  };

  const toggleScheduleStatus = (id: number) => {
    const newSchedules = {
      ...schedules,
      [id]: {
        ...schedules[id],
        status: schedules[id].status === "active" ? ("paused" as const) : ("active" as const),
      },
    };
    setSchedules(newSchedules);
    syncToForm(newSchedules);
  };

  const toggleDay = (dayValue: string) => {
    setScheduleForm((prev) => ({
      ...prev,
      days: prev.days.includes(dayValue) ? prev.days.filter((d) => d !== dayValue) : [...prev.days, dayValue],
    }));
  };

  const scheduleList = Object.values(schedules);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Ad Schedules</h3>
              <CardDescription>Manage when your ads are displayed</CardDescription>
            </div>
            <Button onClick={openAddSchedule} size="sm" type="button">
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {scheduleList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No schedules configured. Click &quot;Add Schedule&quot; to create one.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>CPC</TableHead>
                  <TableHead>Spend</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleList.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.name}</TableCell>
                    <TableCell>{schedule.startTime}</TableCell>
                    <TableCell>{schedule.endTime}</TableCell>
                    <TableCell>{schedule.days.join(", ")}</TableCell>
                    <TableCell>${schedule.cpc.toFixed(2)}</TableCell>
                    <TableCell>${schedule.spend.toFixed(2)}</TableCell>
                    <TableCell>${schedule.balance.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={schedule.status === "active" ? "default" : "secondary"}>{schedule.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => toggleScheduleStatus(schedule.id)} title={schedule.status === "active" ? "Pause" : "Activate"} type="button">
                          {schedule.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditSchedule(schedule)} title="Edit" type="button">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteSchedule(schedule.id)} title="Delete" type="button">
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
            <DialogDescription>{editingSchedule ? "Update the schedule configuration" : "Configure when your ads should be displayed"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Field>
              <FieldLabel>Schedule Name *</FieldLabel>
              <FieldContent>
                <Input value={scheduleForm.name} onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })} placeholder="e.g., Morning Rush" />
              </FieldContent>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Start Time *</FieldLabel>
                <FieldContent>
                  <Input type="time" value={scheduleForm.startTime} onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>End Time *</FieldLabel>
                <FieldContent>
                  <Input type="time" value={scheduleForm.endTime} onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })} />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel>Days *</FieldLabel>
              <FieldContent>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`px-3 py-1.5 text-sm border transition-colors ${scheduleForm.days.includes(day.value) ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted border-border"}`}
                    >
                      {day.label.slice(0, 3)}
                    </button>
                  ))}
                </div>
                {scheduleForm.days.length === 0 && <p className="text-sm text-destructive mt-1">Please select at least one day</p>}
              </FieldContent>
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel>CPC</FieldLabel>
                <FieldContent>
                  <Input type="number" step="0.01" min="0" value={scheduleForm.cpc} onChange={(e) => setScheduleForm({ ...scheduleForm, cpc: e.target.value })} placeholder="0.00" />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Spend</FieldLabel>
                <FieldContent>
                  <Input type="number" step="0.01" min="0" value={scheduleForm.spend} onChange={(e) => setScheduleForm({ ...scheduleForm, spend: e.target.value })} placeholder="0.00" />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Balance</FieldLabel>
                <FieldContent>
                  <Input type="number" step="0.01" min="0" value={scheduleForm.balance} onChange={(e) => setScheduleForm({ ...scheduleForm, balance: e.target.value })} placeholder="0.00" />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <FieldContent>
                <Select value={scheduleForm.status} onValueChange={(value: "active" | "paused") => setScheduleForm({ ...scheduleForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)} type="button">
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule} disabled={!scheduleForm.name || scheduleForm.days.length === 0} type="button">
              {editingSchedule ? "Update Schedule" : "Add Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>Are you sure you want to delete this schedule? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSchedule} type="button">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
