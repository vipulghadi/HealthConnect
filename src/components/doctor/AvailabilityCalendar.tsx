import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Clock,
  Calendar as CalendarIcon,
  Check,
  X,
} from "lucide-react";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  patientName?: string;
}

interface AvailabilityCalendarProps {
  availableDays?: Date[];
  timeSlots?: TimeSlot[];
  onAddTimeSlot?: (date: Date, startTime: string, endTime: string) => void;
  onRemoveTimeSlot?: (id: string) => void;
}

const AvailabilityCalendar = ({
  availableDays = [new Date()],
  timeSlots = [
    { id: "1", startTime: "09:00", endTime: "10:00", isBooked: false },
    {
      id: "2",
      startTime: "10:30",
      endTime: "11:30",
      isBooked: true,
      patientName: "John Doe",
    },
    { id: "3", startTime: "13:00", endTime: "14:00", isBooked: false },
    { id: "4", startTime: "15:30", endTime: "16:30", isBooked: false },
  ],
  onAddTimeSlot = () => {},
  onRemoveTimeSlot = () => {},
}: AvailabilityCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [isAddSlotDialogOpen, setIsAddSlotDialogOpen] = useState(false);
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newEndTime, setNewEndTime] = useState("10:00");

  // Filter time slots for the selected date
  const filteredTimeSlots = timeSlots;

  // Generate time options for select dropdown
  const timeOptions = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  const handleAddTimeSlot = () => {
    if (selectedDate && newStartTime && newEndTime) {
      onAddTimeSlot(selectedDate, newStartTime, newEndTime);
      setIsAddSlotDialogOpen(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        Availability Calendar
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Select Date</h3>
            <CalendarIcon className="h-5 w-5 text-gray-500" />
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>

        {/* Time Slots Section */}
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {selectedDate ? (
                <span>Time Slots for {selectedDate.toLocaleDateString()}</span>
              ) : (
                <span>Select a date to view time slots</span>
              )}
            </h3>
            <Dialog
              open={isAddSlotDialogOpen}
              onOpenChange={setIsAddSlotDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Slot
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Time Slot</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Start Time
                      </label>
                      <Select
                        value={newStartTime}
                        onValueChange={setNewStartTime}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={`start-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        End Time
                      </label>
                      <Select value={newEndTime} onValueChange={setNewEndTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={`end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddSlotDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddTimeSlot}>Add Time Slot</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {selectedDate ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredTimeSlots.length > 0 ? (
                filteredTimeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-3 rounded-md border ${slot.isBooked ? "bg-gray-100" : "bg-white"}`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                      {slot.isBooked && (
                        <span className="ml-2 text-sm text-gray-500">
                          Booked by {slot.patientName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {slot.isBooked ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Check className="h-3 w-3 mr-1" /> Booked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      )}
                      {!slot.isBooked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onRemoveTimeSlot(slot.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No time slots available for this date.
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddSlotDialogOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Your First Slot
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Please select a date to view and manage time slots
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
