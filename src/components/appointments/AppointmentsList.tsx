import React, { useState } from "react";
import { Calendar, Clock, MoreHorizontal, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
}

interface Appointment {
  id: string;
  doctorId: string;
  doctor: Doctor;
  date: Date;
  status: "upcoming" | "completed" | "cancelled";
  type: "in-person" | "video";
  notes?: string;
}

interface AppointmentsListProps {
  appointments?: Appointment[];
  onReschedule?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
}

const AppointmentsList = ({
  appointments = [
    {
      id: "1",
      doctorId: "d1",
      doctor: {
        id: "d1",
        name: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
      date: new Date(Date.now() + 86400000 * 2), // 2 days from now
      status: "upcoming",
      type: "in-person",
    },
    {
      id: "2",
      doctorId: "d2",
      doctor: {
        id: "d2",
        name: "Dr. Michael Chen",
        specialty: "Neurologist",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      },
      date: new Date(Date.now() + 86400000 * 5), // 5 days from now
      status: "upcoming",
      type: "video",
    },
    {
      id: "3",
      doctorId: "d3",
      doctor: {
        id: "d3",
        name: "Dr. Emily Rodriguez",
        specialty: "Dermatologist",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      },
      date: new Date(Date.now() - 86400000 * 3), // 3 days ago
      status: "completed",
      type: "in-person",
      notes: "Follow-up in 3 months",
    },
    {
      id: "4",
      doctorId: "d4",
      doctor: {
        id: "d4",
        name: "Dr. James Wilson",
        specialty: "Psychiatrist",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
      },
      date: new Date(Date.now() - 86400000 * 10), // 10 days ago
      status: "cancelled",
      type: "video",
    },
  ] as Appointment[],
  onReschedule = () => {},
  onCancel = () => {},
}: AppointmentsListProps) => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingAppointments = appointments.filter(
    (app) => app.status === "upcoming",
  );
  const pastAppointments = appointments.filter(
    (app) => app.status === "completed" || app.status === "cancelled",
  );

  const handleReschedule = (appointmentId: string) => {
    onReschedule(appointmentId);
  };

  const handleCancel = (appointmentId: string) => {
    onCancel(appointmentId);
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: Appointment["type"]) => {
    switch (type) {
      case "in-person":
        return <Badge variant="outline">In-person</Badge>;
      case "video":
        return <Badge variant="outline">Video</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      <Tabs
        defaultValue="upcoming"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming appointments</p>
            </div>
          ) : (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
                onViewDetails={() => setSelectedAppointment(appointment)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No past appointments</p>
            </div>
          ) : (
            pastAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isPast
                onViewDetails={() => setSelectedAppointment(appointment)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {selectedAppointment && (
        <Dialog
          open={!!selectedAppointment}
          onOpenChange={(open) => !open && setSelectedAppointment(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                {format(selectedAppointment.date, "EEEE, MMMM d, yyyy")} at{" "}
                {format(selectedAppointment.date, "h:mm a")}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-4 my-4">
              <div className="h-16 w-16 rounded-full overflow-hidden">
                <img
                  src={selectedAppointment.doctor.imageUrl}
                  alt={selectedAppointment.doctor.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">
                  {selectedAppointment.doctor.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedAppointment.doctor.specialty}
                </p>
              </div>
            </div>

            <div className="flex gap-2 my-2">
              {getStatusBadge(selectedAppointment.status)}
              {getTypeBadge(selectedAppointment.type)}
            </div>

            {selectedAppointment.notes && (
              <div className="mt-4">
                <h4 className="font-medium mb-1">Notes</h4>
                <p className="text-sm text-gray-700">
                  {selectedAppointment.notes}
                </p>
              </div>
            )}

            <DialogFooter className="mt-6">
              {selectedAppointment.status === "upcoming" && (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      handleReschedule(selectedAppointment.id);
                      setSelectedAppointment(null);
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleCancel(selectedAppointment.id);
                      setSelectedAppointment(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {selectedAppointment.status === "completed" && (
                <Button className="w-full">Book Follow-up</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface AppointmentCardProps {
  appointment: Appointment;
  isPast?: boolean;
  onReschedule?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
  onViewDetails: () => void;
}

const AppointmentCard = ({
  appointment,
  isPast = false,
  onReschedule,
  onCancel,
  onViewDetails,
}: AppointmentCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                src={appointment.doctor.imageUrl}
                alt={appointment.doctor.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-base">
                {appointment.doctor.name}
              </CardTitle>
              <CardDescription>{appointment.doctor.specialty}</CardDescription>
            </div>
          </div>
          <div className="flex gap-1">
            {appointment.status === "upcoming" ? (
              <Badge variant="secondary">Upcoming</Badge>
            ) : appointment.status === "completed" ? (
              <Badge variant="default">Completed</Badge>
            ) : (
              <Badge variant="destructive">Cancelled</Badge>
            )}
            <Badge variant="outline">
              {appointment.type === "in-person" ? "In-person" : "Video"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{format(appointment.date, "EEEE, MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <Clock className="h-4 w-4" />
          <span>{format(appointment.date, "h:mm a")}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={onViewDetails}>
          View Details
        </Button>

        {!isPast && appointment.status === "upcoming" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReschedule && onReschedule(appointment.id)}
            >
              Reschedule
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel && onCancel(appointment.id)}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AppointmentsList;
