import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ClipboardList,
  FileText,
  Calendar,
  Activity,
  AlertCircle,
} from "lucide-react";

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  profileImage?: string;
  medicalHistory: MedicalHistoryItem[];
  upcomingAppointments: AppointmentItem[];
  recentSymptoms: SymptomItem[];
  allergies: string[];
  medications: MedicationItem[];
}

interface MedicalHistoryItem {
  id: string;
  date: string;
  condition: string;
  notes: string;
  doctor: string;
}

interface AppointmentItem {
  id: string;
  date: string;
  time: string;
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface SymptomItem {
  id: string;
  date: string;
  description: string;
  severity: "mild" | "moderate" | "severe";
}

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

interface PatientInfoViewerProps {
  patientId?: string;
  patient?: PatientInfo;
}

const PatientInfoViewer: React.FC<PatientInfoViewerProps> = ({
  patientId = "123",
  patient = {
    id: "123",
    name: "Jane Smith",
    age: 42,
    gender: "Female",
    email: "jane.smith@example.com",
    phone: "(555) 123-4567",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    medicalHistory: [
      {
        id: "mh1",
        date: "2023-05-15",
        condition: "Hypertension",
        notes: "Prescribed lisinopril 10mg daily",
        doctor: "Dr. Johnson",
      },
      {
        id: "mh2",
        date: "2022-11-03",
        condition: "Influenza",
        notes: "Bed rest and fluids recommended",
        doctor: "Dr. Williams",
      },
    ],
    upcomingAppointments: [
      {
        id: "apt1",
        date: "2023-07-12",
        time: "10:30 AM",
        reason: "Annual physical",
        status: "scheduled",
      },
    ],
    recentSymptoms: [
      {
        id: "sym1",
        date: "2023-06-28",
        description: "Persistent headache",
        severity: "moderate",
      },
      {
        id: "sym2",
        date: "2023-06-25",
        description: "Fatigue",
        severity: "mild",
      },
    ],
    allergies: ["Penicillin", "Peanuts"],
    medications: [
      {
        id: "med1",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2023-05-15",
      },
      {
        id: "med2",
        name: "Vitamin D",
        dosage: "2000 IU",
        frequency: "Once daily",
        startDate: "2022-01-10",
      },
    ],
  },
}) => {
  return (
    <div className="w-full h-full bg-white p-6 overflow-auto">
      <div className="flex items-start gap-6 mb-6">
        <Avatar className="h-24 w-24 border-2 border-primary">
          <AvatarImage src={patient.profileImage} alt={patient.name} />
          <AvatarFallback>
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{patient.name}</h1>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p>{patient.age} years</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p>{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{patient.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{patient.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Allergies</h2>
        <div className="flex gap-2">
          {patient.allergies.length > 0 ? (
            patient.allergies.map((allergy, index) => (
              <Badge key={index} variant="destructive">
                {allergy}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No known allergies</p>
          )}
        </div>
      </div>

      <Tabs defaultValue="medical-history" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger
            value="medical-history"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Medical History</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Symptoms</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Medications</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medical-history" className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Medical History</h3>
          <div className="space-y-4">
            {patient.medicalHistory.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{item.condition}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {item.date}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{item.notes}</p>
                  <p className="text-sm text-muted-foreground">
                    Attending: {item.doctor}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Appointments</h3>
          <div className="space-y-4">
            {patient.upcomingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{appointment.reason}</CardTitle>
                    <Badge
                      variant={
                        appointment.status === "scheduled"
                          ? "default"
                          : appointment.status === "completed"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.time}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="symptoms" className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Recent Symptoms</h3>
          <div className="space-y-4">
            {patient.recentSymptoms.map((symptom) => (
              <Card key={symptom.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{symptom.description}</CardTitle>
                    <Badge
                      variant={
                        symptom.severity === "mild"
                          ? "secondary"
                          : symptom.severity === "moderate"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {symptom.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Reported on {symptom.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="medications" className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Current Medications</h3>
          <div className="space-y-4">
            {patient.medications.map((medication) => (
              <Card key={medication.id}>
                <CardHeader>
                  <CardTitle>{medication.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Dosage</p>
                      <p>{medication.dosage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Frequency</p>
                      <p>{medication.frequency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Started</p>
                      <p>{medication.startDate}</p>
                    </div>
                    {medication.endDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Until</p>
                        <p>{medication.endDate}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Doctor's Notes</h3>
          <Card>
            <CardContent className="pt-6">
              <textarea
                className="w-full min-h-[200px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add notes about this patient..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Add missing Clock component since it's used but not imported
const Clock = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
};

export default PatientInfoViewer;
