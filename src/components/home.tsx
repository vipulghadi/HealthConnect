import React from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthOptions from "./auth/AuthOptions";
import Header from "./layout/Header";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
              Your Health Journey <br />
              <span className="text-blue-600">Starts Here</span>
            </h1>

            <p className="text-lg text-gray-700">
              Connect with qualified healthcare professionals, discuss your
              symptoms with our AI assistant, and schedule appointments all in
              one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <Card className="bg-blue-50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <Heart className="h-5 w-5" /> AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Discuss symptoms with our AI and get personalized
                    recommendations
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-stethoscope"
                    >
                      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                      <circle cx="20" cy="10" r="2" />
                    </svg>
                    Find Doctors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Connect with specialists based on your specific health needs
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-calendar"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Schedule and manage your appointments with ease
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right side - Auth options */}
          <div className="flex justify-center">
            <AuthOptions />
          </div>
        </div>

        {/* Features section */}
        <section className="mt-24 mb-12">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-blue-700">1</span>
                </div>
                <CardTitle>Describe Your Symptoms</CardTitle>
                <CardDescription>
                  Chat with our AI healthcare assistant about what you're
                  experiencing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80"
                    alt="AI Chat Interface"
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-blue-700">2</span>
                </div>
                <CardTitle>Get Doctor Recommendations</CardTitle>
                <CardDescription>
                  Receive a list of qualified specialists based on your symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80"
                    alt="Doctor Recommendations"
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-blue-700">3</span>
                </div>
                <CardTitle>Schedule Your Appointment</CardTitle>
                <CardDescription>
                  Book a convenient time slot with your chosen healthcare
                  provider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=500&q=80"
                    alt="Appointment Scheduling"
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="my-16 bg-blue-50 py-12 px-4 rounded-xl">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
                      alt="Emily"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Emily R.</h4>
                    <p className="text-sm text-gray-500">Patient</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "The AI assistant was incredibly helpful in understanding my
                  symptoms. I was able to connect with a specialist quickly and
                  get the care I needed."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
                      alt="Michael"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Dr. Michael C.</h4>
                    <p className="text-sm text-gray-500">Neurologist</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "As a doctor, I appreciate how the platform helps me manage my
                  schedule and connect with patients who truly need my
                  expertise."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                      alt="Sarah"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah J.</h4>
                    <p className="text-sm text-gray-500">Patient</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "The appointment scheduling system is so intuitive. I love
                  being able to see all my upcoming appointments and medical
                  history in one place."
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="my-16 text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and healthcare providers on our platform
            and experience a new way of managing healthcare.
          </p>
          <Button size="lg" className="gap-2">
            Create Your Account <ArrowRight size={18} />
          </Button>
        </section>
      </main>

      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">HealthConnect</h3>
              <p className="text-blue-200">
                Connecting patients with the right healthcare professionals
                through AI-powered assistance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-blue-200 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-blue-200 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-blue-200 hover:text-white"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-blue-200 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Patients</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/chat" className="text-blue-200 hover:text-white">
                    AI Health Assistant
                  </Link>
                </li>
                <li>
                  <Link
                    to="/doctors"
                    className="text-blue-200 hover:text-white"
                  >
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link
                    to="/appointments"
                    className="text-blue-200 hover:text-white"
                  >
                    Manage Appointments
                  </Link>
                </li>
                <li>
                  <Link
                    to="/health-records"
                    className="text-blue-200 hover:text-white"
                  >
                    Health Records
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Doctors</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/doctor/register"
                    className="text-blue-200 hover:text-white"
                  >
                    Join as a Doctor
                  </Link>
                </li>
                <li>
                  <Link
                    to="/doctor/dashboard"
                    className="text-blue-200 hover:text-white"
                  >
                    Doctor Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/doctor/patients"
                    className="text-blue-200 hover:text-white"
                  >
                    Patient Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/doctor/availability"
                    className="text-blue-200 hover:text-white"
                  >
                    Set Availability
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>
              &copy; {new Date().getFullYear()} HealthConnect. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
