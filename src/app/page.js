"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Heart, Users, Clock, Search, MessageSquare, Activity, Stethoscope } from "lucide-react";
import Navbar from "@/components/client/common/Navbar";
import Footer from "@/components/client/common/Footer";
import ContactForm from "@/components/client/common/ContactForm";

export default function Home() {
  return (

    <div className="min-h-screen w-full bg-gradient-to-b from-background to-secondary">
    
      
      {/* Hero Section */}
      <section className="px-4 py-24  text-center relative overflow-hidden ">
        <div className="hero-blur hero-blur-1" />
        <div className="hero-blur hero-blur-2" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/10 rounded-full blur-xl" 
          />
          <h1 className=" text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            HealthConnect
          </h1>
          <p className="text-2xl text-muted-foreground mb-8">
            Mental Health Solutions at Your Fingertips
          </p>
          <div className="relative">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
            />
            <Button size="lg" className="mr-4">Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain className="h-12 w-12 mb-4 text-primary text-red-400" />,
              title: "Mental Health Counseling",
              description: "Professional counseling services with certified therapists"
            },
            {
              icon: <Activity className="h-12 w-12 mb-4 text-green-400" />,
              title: "Free Mental Health Check",
              description: "Take our comprehensive mental health assessment",
            },
            {
              icon: <Stethoscope className="h-12 w-12 mb-4 text-blue-400" />,
              title: "24/7 Support",
              description: "Round-the-clock access to mental health resources"
            }
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="p-6 text-center transition-all">
                {service.icon}
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                {service.button && (
                  <Button variant="outline">{service.button}</Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose HealthConnect</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain className="h-12 w-12 mb-4 text-primary" />,
              title: "Expert Care",
              description: "Connect with certified mental health professionals"
            },
            {
              icon: <Heart className="h-12 w-12 mb-4 text-primary" />,
              title: "Personalized Support",
              description: "Tailored recommendations based on your needs"
            },
            {
              icon: <Clock className="h-12 w-12 mb-4 text-primary" />,
              title: "24/7 Access",
              description: "Get help whenever you need it, wherever you are"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-card rounded-lg my-16">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: <Users className="h-10 w-10" />,
              title: "Sign Up",
              description: "Create your free account"
            },
            {
              icon: <Search className="h-10 w-10" />,
              title: "Find Help",
              description: "Browse our network of professionals"
            },
            {
              icon: <MessageSquare className="h-10 w-10" />,
              title: "Connect",
              description: "Schedule your first session"
            },
            {
              icon: <Heart className="h-10 w-10" />,
              title: "Get Better",
              description: "Start your journey to wellness"
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>
        <ContactForm />
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Take the First Step?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of others who have found support through HealthConnect
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground">
            Get Started Now
          </Button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}