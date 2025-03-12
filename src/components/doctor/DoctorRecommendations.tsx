import React, { useState } from "react";
import { Search, Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DoctorCard from "./DoctorCard";
import AppointmentScheduler from "../appointments/AppointmentScheduler";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  location: string;
  price: number;
  currency: string;
  availableTimes: string[];
}

interface DoctorRecommendationsProps {
  doctors?: Doctor[];
  onBack?: () => void;
}

const DoctorRecommendations = ({
  doctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      rating: 4.8,
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
      rating: 4.9,
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
      rating: 4.7,
      location: "Dermatology Center, Floor 2",
      price: 130,
      currency: "USD",
      availableTimes: ["9:30 AM", "12:00 PM", "2:30 PM", "5:00 PM"],
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      specialty: "General Practitioner",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
      rating: 4.6,
      location: "Family Health Clinic",
      price: 100,
      currency: "USD",
      availableTimes: ["8:00 AM", "10:00 AM", "1:00 PM", "3:30 PM"],
    },
    {
      id: "5",
      name: "Dr. Lisa Martinez",
      specialty: "Psychiatrist",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      rating: 4.9,
      location: "Mental Health Center",
      price: 200,
      currency: "USD",
      availableTimes: ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
    },
  ],
  onBack = () => {},
}: DoctorRecommendationsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "" || doctor.specialty === selectedSpecialty;

    let matchesPrice = true;
    if (priceRange === "under100") {
      matchesPrice = doctor.price < 100;
    } else if (priceRange === "100to150") {
      matchesPrice = doctor.price >= 100 && doctor.price <= 150;
    } else if (priceRange === "over150") {
      matchesPrice = doctor.price > 150;
    }

    return matchesSearch && matchesSpecialty && matchesPrice;
  });

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6">
      {selectedDoctor ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDoctor(null)}
              className="border-green-200 text-green-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold text-green-900">
              Schedule with {selectedDoctor.name}
            </h2>
          </div>
          <AppointmentScheduler recommendedDoctors={[selectedDoctor]} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onBack}
                className="border-green-200 text-green-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold text-green-900">
                Recommended Doctors
              </h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
              <Input
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-200 focus-visible:ring-green-500"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedSpecialty}
                onValueChange={setSelectedSpecialty}
              >
                <SelectTrigger className="w-[180px] border-green-200">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[180px] border-green-200">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Prices</SelectItem>
                  <SelectItem value="under100">Under $100</SelectItem>
                  <SelectItem value="100to150">$100 - $150</SelectItem>
                  <SelectItem value="over150">Over $150</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  {...doctor}
                  onSelect={handleDoctorSelect}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-green-700">
                No doctors found matching your criteria.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorRecommendations;
