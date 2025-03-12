import React from "react";
import DoctorCard from "../doctor/DoctorCard";

const DoctorCardStoryboard = () => {
  return (
    <div className="p-6 max-w-md">
      <DoctorCard
        id="1"
        name="Dr. Sarah Johnson"
        specialty="Cardiologist"
        image="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
        rating={4.8}
        location="Medical Center, Building A"
        price={150}
        currency="USD"
        availableTimes={["9:00 AM", "10:30 AM", "2:00 PM", "4:30 PM"]}
      />
    </div>
  );
};

export default DoctorCardStoryboard;
