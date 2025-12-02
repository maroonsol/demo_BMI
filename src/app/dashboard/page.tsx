"use client";

import { dashboardBoxes } from "@/config/dashboard";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header Section */}
      <div className="relative z-10">
        <div className="px-8 pt-12 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              {/* Main Header */}
              <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-slate-900 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                {/* description removed as requested */}
              </div>
              
              {/* Quick stats removed as requested */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="relative z-10 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {dashboardBoxes.map((box) => (
                box.dialogContent ? (
                  <Dialog key={box.id}>
                    <DialogTrigger asChild>
                      <Card 
                        className="group relative overflow-hidden cursor-pointer border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                      >
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Floating Particles Effect */}
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400/30 rounded-full animate-ping" />
                          <div className="absolute bottom-6 left-6 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse delay-300" />
                          <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse delay-700" />
                        </div>

                        <div className="relative p-8">
                          <div className="space-y-6">
                            {/* Icon Section */}
                            <div className="flex items-center justify-between">
                              <div className={`w-16 h-16 rounded-2xl ${box.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                <box.icon className={`w-8 h-8 ${box.iconColor}`} />
                              </div>
                              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                            
                            {/* Content */}
                            <div className="space-y-3">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-800 transition-colors duration-300">
                                {box.title}
                              </h3>
                              <p className="text-slate-600 leading-relaxed text-sm">
                                {box.description}
                              </p>
                            </div>

                            {/* Hover Indicator */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                          </div>
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl border-0 bg-white/95 backdrop-blur-sm">
                      <DialogHeader className="space-y-4">
                        <DialogTitle className="flex items-center gap-4 text-2xl">
                          <div className={`w-12 h-12 rounded-xl ${box.iconBg} flex items-center justify-center shadow-lg`}>
                            <box.icon className={`w-6 h-6 ${box.iconColor}`} />
                          </div>
                          <span className="bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
                            {box.title}
                          </span>
                        </DialogTitle>
                        <DialogDescription className="text-base text-slate-600">
                          Choose from the available actions below to get started
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 mt-8">
                        {box.dialogContent.map((item) => (
                          <Link href={item.link} key={item.link}>
                            <Card className={`p-6 hover:bg-purple-50/50 cursor-pointer transition-all duration-300 border-l-4 ${item.borderColor} hover:shadow-lg group relative overflow-hidden`}>
                              {/* Subtle background animation */}
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              <div className="relative flex items-start gap-5">
                                <div className={`w-14 h-14 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                  <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                                </div>
                                <div className="space-y-2 flex-1">
                                  <h4 className="font-bold text-lg text-gray-900 group-hover:text-purple-800 transition-colors duration-300">
                                    {item.title}
                                  </h4>
                                  <p className="text-slate-600 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Link href={box.link || '#'} key={box.id}>
                    <Card 
                      className="group relative overflow-hidden cursor-pointer border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
  
                    >
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Floating Particles Effect */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400/30 rounded-full animate-ping" />
                        <div className="absolute bottom-6 left-6 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse delay-300" />
                        <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse delay-700" />
                      </div>

                      <div className="relative p-8">
                        <div className="space-y-6">
                          {/* Icon Section */}
                          <div className="flex items-center justify-between">
                            <div className={`w-16 h-16 rounded-2xl ${box.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                              <box.icon className={`w-8 h-8 ${box.iconColor}`} />
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                          
                          {/* Content */}
                          <div className="space-y-3">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-800 transition-colors duration-300">
                              {box.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                              {box.description}
                            </p>
                          </div>

                          {/* Hover Indicator */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}