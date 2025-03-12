import React from "react";
import { Link } from "react-router-dom";
import { Menu, Bell, User, Search, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isLoggedIn?: boolean;
  userType?: "patient" | "doctor";
  userName?: string;
  onLogout?: () => void;
}

const Header = ({
  isLoggedIn = false,
  userType = "patient",
  userName = "Guest User",
  onLogout = () => {},
}: HeaderProps) => {
  return (
    <header className="w-full h-20 bg-white border-b border-green-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo and App Name */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            <span className="text-xl">HC</span>
          </div>
          <Link
            to="/"
            className="text-xl font-bold text-green-700 hidden sm:block"
          >
            HealthConnect
          </Link>
        </div>

        {/* Mobile Menu Button - Only visible on small screens */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-green-700"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-green-700 hover:text-green-600 font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-green-700 hover:text-green-600 font-medium"
          >
            About
          </Link>
          <Link
            to="/services"
            className="text-green-700 hover:text-green-600 font-medium"
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="text-green-700 hover:text-green-600 font-medium"
          >
            Contact
          </Link>
        </nav>

        {/* Right Side - Auth or User Menu */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-green-700"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-green-700"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border border-green-200">
                      <User className="h-5 w-5 text-green-700" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{userName}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {userType}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to={`/${userType}/dashboard`} className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-green-700 hover:text-green-600 hover:bg-green-50"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
