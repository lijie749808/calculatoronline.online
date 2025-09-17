"use client";

import { useState, useCallback } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Gift } from "lucide-react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  daysUntilBirthday: number;
  birthDayOfWeek: string;
  nextBirthdayDayOfWeek: string;
  nextBirthdayYear: number;
}

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const DAYS_OF_WEEK_ZH = [
  "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"
];

interface AgeCalculatorProps {
  t?: any;
  locale?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AgeCalculator({ t, locale = 'en' }: AgeCalculatorProps) {
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [targetYear, setTargetYear] = useState(new Date().getFullYear().toString());
  const [targetMonth, setTargetMonth] = useState((new Date().getMonth() + 1).toString());
  const [targetDay, setTargetDay] = useState(new Date().getDate().toString());
  const [result, setResult] = useState<AgeResult | null>(null);

  // Generate years from 1900 to current year + 10
  const years = Array.from({ length: new Date().getFullYear() - 1899 + 10 }, (_, i) => (new Date().getFullYear() + 10 - i).toString());
  
  // Generate days based on selected month and year
  const getDaysInMonth = (year: string, month: string) => {
    if (!year || !month) return 31;
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const calculateAge = useCallback(() => {
    if (!birthYear || !birthMonth || !birthDay) return;

    const birth = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, parseInt(birthDay));
    const target = new Date(parseInt(targetYear), parseInt(targetMonth) - 1, parseInt(targetDay));
    
    // Basic age calculation
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    // Adjust for negative values
    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total values
    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Calculate days until next birthday
    const currentYear = target.getFullYear();
    let nextBirthday = new Date(currentYear, birth.getMonth(), birth.getDate());
    
    if (nextBirthday < target) {
      nextBirthday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }
    
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    
    // Day of week calculations (always use English for consistency)
    const dayNames = DAYS_OF_WEEK;
    const birthDayOfWeek = dayNames[birth.getDay()];
    const nextBirthdayDayOfWeek = dayNames[nextBirthday.getDay()];
    const nextBirthdayYear = nextBirthday.getFullYear();

    setResult({
      years,
      months, 
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysUntilBirthday,
      birthDayOfWeek,
      nextBirthdayDayOfWeek,
      nextBirthdayYear
    });
  }, [birthYear, birthMonth, birthDay, targetYear, targetMonth, targetDay]);

  const clearResults = useCallback(() => {
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    const today = new Date();
    setTargetYear(today.getFullYear().toString());
    setTargetMonth((today.getMonth() + 1).toString());
    setTargetDay(today.getDate().toString());
    setResult(null);
  }, []);

  return (
    <div className="space-y-6" lang="en">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            {t?.form?.title || "Date Input"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t?.form?.birthDate || "Date of Birth"}</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={birthMonth} onValueChange={setBirthMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={birthDay} onValueChange={setBirthDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: getDaysInMonth(birthYear, birthMonth) }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={birthYear} onValueChange={setBirthYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t?.form?.targetDate || "Calculate Age At"}</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={targetMonth} onValueChange={setTargetMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={targetDay} onValueChange={setTargetDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: getDaysInMonth(targetYear, targetMonth) }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={targetYear} onValueChange={setTargetYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={calculateAge} className="flex-1">
              {t?.form?.calculate || "Calculate Age"}
            </Button>
            <Button variant="outline" onClick={clearResults}>
              {t?.form?.clear || "Clear"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Main Age Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5" />
                {t?.results?.mainTitle || "Your Age"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {result.years} {t?.results?.years || "years"}, {result.months} {t?.results?.months || "months"}, {result.days} {t?.results?.days || "days"}
                </div>
                <div className="text-muted-foreground">
                  {t?.results?.born || "Born on"} {result.birthDayOfWeek}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>{t?.results?.detailsTitle || "Detailed Breakdown"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {result.totalDays.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t?.results?.totalDays || "Total Days"}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {result.totalWeeks.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t?.results?.totalWeeks || "Total Weeks"}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {result.totalHours.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t?.results?.totalHours || "Total Hours"}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {result.totalMinutes.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t?.results?.totalMinutes || "Total Minutes"}
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-center">
                <div className="text-xl font-semibold mb-1">
                  {result.totalSeconds.toLocaleString()} {t?.results?.totalSeconds || "Total Seconds"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t?.results?.secondsNote || "You've been alive for this many seconds!"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Birthday Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="size-5" />
                {t?.results?.birthdayTitle || "Birthday Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <div className="font-semibold">
                    {t?.results?.nextBirthday || "Next Birthday"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.nextBirthdayDayOfWeek}, {result.nextBirthdayYear}
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {result.daysUntilBirthday} {t?.results?.daysLeft || "days left"}
                </Badge>
              </div>
              
              {result.daysUntilBirthday === 0 && (
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-lg font-semibold text-primary">
                    🎉 {t?.results?.happyBirthday || "Happy Birthday!"} 🎉
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}