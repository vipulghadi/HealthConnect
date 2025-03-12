import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  Bell,
  MessageSquare,
  FileText,
  ChevronRight,
  Search,
} from "lucide-react";

import AvailabilityCalendar from "../doctor/AvailabilityCalendar";
import PatientInfoViewer from "../doctor/PatientInfoViewer";

interface Appointment {
  id: string;
  patientName: string;
  patientImage: string;
  date: Date;
  time: string;
  type: "in-person" | "video";
  status: "upcoming" | "completed" | "cancelled";
  reason: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  upcomingAppointment?: string;
  profileImage: string;
}

interface DoctorDashboardProps {
  doctorName?: string;
  doctorSpecialty?: string;
  doctorImage?: string;
  appointments?: Appointment[];
  patients?: Patient[];
}

const DoctorDashboard = ({
  doctorName = "Dr. Michael Chen",
  doctorSpecialty = "Neurologist",
  doctorImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
  appointments = [
    {
      id: "1",
      patientName: "John Doe",
      patientImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      date: new Date(),
      time: "9:00 AM",
      type: "in-person",
      status: "upcoming",
      reason: "Annual checkup",
    },
    {
      id: "2",
      patientName: "Sarah Johnson",
      patientImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      date: new Date(new Date().setHours(new Date().getHours() + 3)),
      time: "11:30 AM",
      type: "video",
      status: "upcoming",
      reason: "Follow-up consultation",
    },
    {
      id: "3",
      patientName: "Emily Wilson",
      patientImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: "2:00 PM",
      type: "in-person",
      status: "upcoming",
      reason: "Headache evaluation",
    },
  ],
  patients = [
    {
      id: "1",
      name: "John Doe",
      age: 45,
      lastVisit: "2 weeks ago",
      upcomingAppointment: "Today, 9:00 AM",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      age: 32,
      lastVisit: "1 month ago",
      upcomingAppointment: "Today, 11:30 AM",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    {
      id: "3",
      name: "Emily Wilson",
      age: 28,
      lastVisit: "3 months ago",
      upcomingAppointment: "Tomorrow, 2:00 PM",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    },
    {
      id: "4",
      name: "Robert Brown",
      age: 52,
      lastVisit: "2 days ago",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
    },
    {
      id: "5",
      name: "Lisa Garcia",
      age: 39,
      lastVisit: "6 months ago",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    },
  ],
}: DoctorDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const todayAppointments = appointments.filter(
    (appointment) =>
      appointment.date.toDateString() === new Date().toDateString(),
  );

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId);
    setActiveTab("patients");
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={doctorImage} alt={doctorName} />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-lg">{doctorName}</h1>
              <p className="text-sm text-muted-foreground">{doctorSpecialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-3xl mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Patients</span>
            </TabsTrigger>
            <TabsTrigger
              value="availability"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Availability</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Today's Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {todayAppointments.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {todayAppointments.length === 0
                      ? "No appointments today"
                      : todayAppointments.length === 1
                        ? "1 patient scheduled"
                        : `${todayAppointments.length} patients scheduled`}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patients.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {patients.length} registered patients
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Next Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length > 0 ? (
                    <div>
                      <div className="text-2xl font-bold">
                        {todayAppointments[0].time}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        with {todayAppointments[0].patientName}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl font-bold">No appointments</div>
                      <p className="text-xs text-muted-foreground">
                        Your schedule is clear today
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No appointments scheduled for today
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <Avatar>
                            <AvatarImage
                              src={appointment.patientImage}
                              alt={appointment.patientName}
                            />
                            <AvatarFallback>
                              {appointment.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">
                              {appointment.patientName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.reason}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{appointment.time}</p>
                            <Badge
                              variant="outline"
                              className="mt-1 capitalize"
                            >
                              {appointment.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patients.slice(0, 3).map((patient) => (
                      <div
                        key={patient.id}
                        className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handlePatientSelect(patient.id)}
                      >
                        <Avatar>
                          <AvatarImage
                            src={patient.profileImage}
                            alt={patient.name}
                          />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Last visit: {patient.lastVisit}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => setActiveTab("patients")}
                  >
                    View all patients
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Appointments</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="pl-9 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" /> Schedule
                </Button>
              </div>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="w-full max-w-md">
                <TabsTrigger value="upcoming" className="flex-1">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="past" className="flex-1">
                  Past
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="flex-1">
                  Cancelled
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="mt-4">
                <div className="space-y-4">
                  {appointments
                    .filter((a) => a.status === "upcoming")
                    .map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="past" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  No past appointments to display
                </div>
              </TabsContent>
              <TabsContent value="cancelled" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  No cancelled appointments to display
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            {selectedPatient ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Patient Information</h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPatient(null)}
                  >
                    Back to Patients
                  </Button>
                </div>
                <PatientInfoViewer patientId={selectedPatient} />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Patients</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search patients..."
                        className="pl-9 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                    <Button>
                      <Users className="mr-2 h-4 w-4" /> Add Patient
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.map((patient) => (
                    <Card
                      key={patient.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handlePatientSelect(patient.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={patient.profileImage}
                              alt={patient.name}
                            />
                            <AvatarFallback>
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Age: {patient.age}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Last Visit:
                            </span>
                            <span>{patient.lastVisit}</span>
                          </div>
                          {patient.upcomingAppointment && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Next Appointment:
                              </span>
                              <span>{patient.upcomingAppointment}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Availability</h2>
            </div>
            <AvailabilityCalendar />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={appointment.patientImage}
                alt={appointment.patientName}
              />
              <AvatarFallback>
                {appointment.patientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{appointment.patientName}</h3>
              <p className="text-sm text-muted-foreground">
                {appointment.reason}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {appointment.date.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{appointment.time}</span>
            </div>
            <Badge variant="outline" className="mt-2 capitalize">
              {appointment.type}
            </Badge>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm">
            Reschedule
          </Button>
          <Button variant="default" size="sm">
            Start Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorDashboard;
