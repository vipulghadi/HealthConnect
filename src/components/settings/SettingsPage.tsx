import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface SettingsPageProps {
  userType?: "patient" | "doctor";
  onLogout?: () => void;
}

const SettingsPage = ({
  userType = "patient",
  onLogout = () => {},
}: SettingsPageProps) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-green-900 mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Help</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={
                      userType === "patient" ? "John" : "Dr. Michael"
                    }
                    className="border-green-200"
                  />
                </div>
                <div className="w-full md:w-1/2 space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={userType === "patient" ? "Doe" : "Chen"}
                    className="border-green-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="user@example.com"
                  className="border-green-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue="(555) 123-4567"
                  className="border-green-200"
                />
              </div>

              {userType === "patient" && (
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    defaultValue="1990-01-01"
                    className="border-green-200"
                  />
                </div>
              )}

              {userType === "doctor" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      id="specialty"
                      defaultValue="Neurologist"
                      className="border-green-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      defaultValue="ML12345678"
                      className="border-green-200"
                    />
                  </div>
                </>
              )}

              <Button className="mt-4 bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-200">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userType === "patient" ? "john" : "michael"}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="border-green-200 text-green-700"
                  >
                    Upload New Picture
                  </Button>
                  <p className="text-sm text-gray-500">
                    Recommended: Square image, at least 300x300 pixels
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via text message
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="appointment-reminders">
                      Appointment Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders about upcoming appointments
                    </p>
                  </div>
                  <Switch
                    id="appointment-reminders"
                    checked={appointmentReminders}
                    onCheckedChange={setAppointmentReminders}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails and updates
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>

              <Button className="mt-4 bg-green-600 hover:bg-green-700">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  className="border-green-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  className="border-green-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="border-green-200"
                />
              </div>
              <Button className="mt-4 bg-green-600 hover:bg-green-700">
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Log Out of All Devices
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-700 hover:bg-red-50"
              >
                Deactivate Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md border-green-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-2 rounded-md">
                    <CreditCard className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">
                      Expires 12/25
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-200 text-green-700"
                >
                  Edit
                </Button>
              </div>
              <Button
                variant="outline"
                className="border-green-200 text-green-700"
              >
                <CreditCard className="mr-2 h-4 w-4" /> Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Appointment with Dr. Sarah Johnson
                      </p>
                      <p className="text-sm text-muted-foreground">
                        May 15, 2023
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$150.00</p>
                      <p className="text-sm text-green-600">Paid</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-md border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Appointment with Dr. Michael Chen
                      </p>
                      <p className="text-sm text-muted-foreground">
                        April 3, 2023
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$180.00</p>
                      <p className="text-sm text-green-600">Paid</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-md border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Appointment with Dr. Emily Rodriguez
                      </p>
                      <p className="text-sm text-muted-foreground">
                        March 22, 2023
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$130.00</p>
                      <p className="text-sm text-green-600">Paid</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Help Tab */}
        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-green-900">
                  How do I schedule an appointment?
                </h3>
                <p className="text-gray-700">
                  You can schedule an appointment by using the AI chat assistant
                  to describe your symptoms, or by browsing our doctor directory
                  and selecting an available time slot.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-green-900">
                  How do I cancel or reschedule an appointment?
                </h3>
                <p className="text-gray-700">
                  You can view your upcoming appointments in the Appointments
                  section of your dashboard. From there, you can select the
                  appointment you wish to modify and choose to reschedule or
                  cancel.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-green-900">
                  What payment methods are accepted?
                </h3>
                <p className="text-gray-700">
                  We accept all major credit cards, debit cards, and HSA/FSA
                  cards. Payment is processed securely at the time of booking.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="support-subject">Subject</Label>
                <Input
                  id="support-subject"
                  placeholder="What can we help you with?"
                  className="border-green-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-message">Message</Label>
                <textarea
                  id="support-message"
                  rows={5}
                  placeholder="Please describe your issue in detail"
                  className="w-full p-3 rounded-md border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <Button className="mt-4 bg-green-600 hover:bg-green-700">
                Submit Request
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
