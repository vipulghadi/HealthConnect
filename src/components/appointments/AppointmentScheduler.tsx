import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Calendar as CalendarIcon,
  User,
  MapPin,
  DollarSign,
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  location: string;
  price: number;
  currency: string;
  availableTimes: string[];
}

interface AppointmentSchedulerProps {
  recommendedDoctors?: Doctor[];
  onSchedule?: (doctorId: string, date: Date, time: string) => void;
}

const AppointmentScheduler = ({
  recommendedDoctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      location: "Medical Center, Building A",
      price: 150,
      currency: "USD",
      availableTimes: ["9:00 AM", "10:30 AM", "2:00 PM", "4:30 PM"],
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      location: "Neurology Clinic, Suite 305",
      price: 180,
      currency: "USD",
      availableTimes: ["8:30 AM", "11:00 AM", "1:30 PM", "3:00 PM"],
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      location: "Dermatology Center, Floor 2",
      price: 130,
      currency: "USD",
      availableTimes: ["9:30 AM", "12:00 PM", "2:30 PM", "5:00 PM"],
    },
  ],
  onSchedule = (doctorId, date, time) => {
    console.log("Appointment scheduled:", { doctorId, date, time });
  },
}: AppointmentSchedulerProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  const handleScheduleAppointment = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      onSchedule(selectedDoctor.id, selectedDate, selectedTime);
      setConfirmationOpen(true);
    }
  };

  const resetSelections = () => {
    setSelectedDoctor(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setDialogOpen(false);
    setConfirmationOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Schedule an Appointment
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {recommendedDoctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="overflow-hidden hover:shadow-md transition-shadow border-green-100"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-200">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg text-green-900">
                    {doctor.name}
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    {doctor.specialty}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                <MapPin className="h-4 w-4" />
                <span>{doctor.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <DollarSign className="h-4 w-4" />
                <span>
                  {doctor.currency === "USD" ? "$" : doctor.currency}{" "}
                  {doctor.price} per consultation
                </span>
              </div>
            </CardContent>
            <CardFooter className="bg-green-50">
              <Button
                onClick={() => handleDoctorSelect(doctor)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Select Doctor
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedDoctor && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Schedule with {selectedDoctor.name}</CardTitle>
            <CardDescription>
              Select a date and time for your appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-2">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border rounded-md"
                  disabled={(date) => {
                    // Disable past dates and weekends for this example
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const day = date.getDay();
                    return date < today || day === 0 || day === 6;
                  }}
                />
              </div>

              <div>
                <h3 className="text-md font-medium mb-2">Select Time</h3>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDoctor.availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 border rounded-md bg-gray-50">
                    <p className="text-gray-500">Please select a date first</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedDoctor(null)}>
              Back
            </Button>
            <Button
              onClick={() => setDialogOpen(true)}
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Appointment
            </Button>
          </CardFooter>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Appointment</DialogTitle>
            <DialogDescription>
              Please review the details of your appointment below.
            </DialogDescription>
          </DialogHeader>

          {selectedDoctor && selectedDate && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{selectedDoctor.name}</h4>
                  <p className="text-sm text-gray-500">
                    {selectedDoctor.specialty}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-gray-500">
                      {format(selectedDate, "PPPP")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-gray-500">{selectedTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-500">
                      {selectedDoctor.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleAppointment}>
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Scheduled!</DialogTitle>
            <DialogDescription>
              Your appointment has been successfully scheduled.
            </DialogDescription>
          </DialogHeader>

          {selectedDoctor && selectedDate && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{selectedDoctor.name}</h4>
                  <p className="text-sm text-gray-500">
                    {selectedDoctor.specialty}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-gray-500">
                      {format(selectedDate, "PPPP")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-gray-500">{selectedTime}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-700">
                  A confirmation email has been sent to your registered email
                  address.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={resetSelections}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentScheduler;
