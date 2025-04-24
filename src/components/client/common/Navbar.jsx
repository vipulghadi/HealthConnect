"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Heart,
  Stethoscope,
  GithubIcon as GitHubIcon,
  Activity,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [showServices, setShowServices] = React.useState(false);

  const services = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Mental Health Counseling",
      description: "Professional counseling services",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Emotional Support",
      description: "24/7 emotional assistance",
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-primary" />,
      title: "Free Mental Health Check",
      description: "Quick assessment test",
      button: "Take Test Now",
    },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50  border-b  flex align-center">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between px-2">
        <Link href="/health-test-game" className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">HealthConnect</span>
        </Link>

        <div className="flex items-center space-x-6">
          <div
            className="relative"
            onMouseEnter={() => setShowServices(true)}
            onMouseLeave={() => setShowServices(false)}
          >
            <Button variant="ghost">Services</Button>
            <AnimatePresence>
              {showServices && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-80"
                >
                  <Card className="p-4 grid gap-4">
                    {services.map((service, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4 p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        {service.icon}
                        <div>
                          <h3 className="font-medium">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                          {service.button && (
                            <Button variant="link" className="p-0 h-auto mt-1">
                              {service.button}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
