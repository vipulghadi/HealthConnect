import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MessageSquare,
  Calendar as CalendarIcon,
  User,
  Bell,
} from "lucide-react";

import AIChatInterface from "../chat/AIChatInterface";
import AppointmentsList from "../appointments/AppointmentsList";
import AppointmentScheduler from "../appointments/AppointmentScheduler";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
}

interface PatientDashboardProps {
  patientName?: string;
  patientAvatar?: string;
  upcomingAppointments?: any[];
  recommendedDoctors?: Doctor[];
}

const PatientDashboard = ({
  patientName = "John Doe",
  patientAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  upcomingAppointments = [],
  recommendedDoctors = [],
}: PatientDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDoctorRecommendations, setShowDoctorRecommendations] =
    useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<Doctor[]>([]);

  const handleDoctorRecommendation = (doctors: Doctor[]) => {
    setSuggestedDoctors(doctors);
    setShowDoctorRecommendations(true);
  };

  return (
    <div className="w-full min-h-screen bg-green-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-green-500">
              <AvatarImage src={patientAvatar} alt={patientName} />
              <AvatarFallback>{patientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-green-900">
                Welcome, {patientName}
              </h1>
              <p className="text-green-700">
                Manage your health and appointments
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="relative border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 bg-green-100">
            <TabsTrigger
              value="overview"
              className="text-sm md:text-base data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="text-sm md:text-base data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Appointments
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="text-sm md:text-base data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              AI Health Assistant
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments && upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments
                        .slice(0, 2)
                        .map((appointment, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 border-b border-green-100 pb-3 last:border-0"
                          >
                            <div className="bg-green-100 p-2 rounded-md">
                              <CalendarIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-green-800">
                                {appointment.doctor.name}
                              </p>
                              <div className="flex items-center gap-1 text-sm text-green-600">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {new Date(
                                    appointment.date,
                                  ).toLocaleDateString()}{" "}
                                  at {appointment.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-green-700">
                      <p>No upcoming appointments</p>
                      <Button
                        variant="link"
                        className="mt-2 p-0 text-green-600 hover:text-green-800"
                        onClick={() => setActiveTab("appointments")}
                      >
                        Schedule one now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    Health Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 mb-4">
                    Describe your symptoms to our AI health assistant and get
                    doctor recommendations.
                  </p>
                  <Button
                    onClick={() => setActiveTab("chat")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <User className="h-5 w-5 text-green-600" />
                    Health Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-green-600">Last Check-up</p>
                      <p className="font-medium text-green-800">
                        March 15, 2023
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Blood Type</p>
                      <p className="font-medium text-green-800">O+</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Allergies</p>
                      <p className="font-medium text-green-800">
                        Penicillin, Peanuts
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                  >
                    View Full Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-800">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CalendarIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">
                        Appointment Confirmed
                      </p>
                      <p className="text-sm text-green-700">
                        Your appointment with Dr. Sarah Johnson has been
                        confirmed for June 15, 2023 at 10:30 AM.
                      </p>
                      <p className="text-xs text-green-500 mt-1">2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">
                        Chat Session Completed
                      </p>
                      <p className="text-sm text-green-700">
                        You discussed headache symptoms with our AI health
                        assistant.
                      </p>
                      <p className="text-xs text-green-500 mt-1">3 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">
                        Profile Updated
                      </p>
                      <p className="text-sm text-green-700">
                        You updated your medical history and emergency contact
                        information.
                      </p>
                      <p className="text-xs text-green-500 mt-1">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-8">
            <Card className="border-green-100">
              <CardContent className="pt-6">
                <AppointmentsList />
              </CardContent>
            </Card>

            {showDoctorRecommendations && (
              <Card className="border-green-100">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    Recommended Doctors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AppointmentScheduler
                    recommendedDoctors={suggestedDoctors.map((doctor) => ({
                      id: doctor.id,
                      name: doctor.name,
                      specialty: doctor.specialty,
                      image: doctor.avatar,
                      location: "Medical Center, Building A",
                      availableTimes: [
                        "9:00 AM",
                        "10:30 AM",
                        "2:00 PM",
                        "4:30 PM",
                      ],
                    }))}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="h-[calc(100vh-200px)]">
            <AIChatInterface
              onDoctorRecommendation={handleDoctorRecommendation}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;
