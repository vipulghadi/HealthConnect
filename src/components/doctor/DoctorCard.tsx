import React from "react";
import { Star, Clock, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  location?: string;
  price?: number;
  currency?: string;
  availableTimes?: string[];
  onSelect?: (doctorId: string) => void;
}

const DoctorCard = ({
  id,
  name,
  specialty,
  image,
  rating = 4.5,
  location = "Medical Center, Building A",
  price = 100,
  currency = "USD",
  availableTimes = ["9:00 AM", "10:30 AM", "2:00 PM", "4:30 PM"],
  onSelect = () => {},
}: DoctorCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-green-100">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-200">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900">{name}</h3>
            <p className="text-green-700">{specialty}</p>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="text-sm text-green-700 ml-1">{rating}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-green-700">
            <DollarSign className="h-4 w-4" />
            <span>
              {currency === "USD" ? "$" : currency} {price} per consultation
            </span>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-green-800 mb-2">
              Available Times:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableTimes.slice(0, 3).map((time) => (
                <Badge
                  key={time}
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {time}
                </Badge>
              ))}
              {availableTimes.length > 3 && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  +{availableTimes.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-green-50 px-6 py-4">
        <Button
          onClick={() => onSelect(id)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
