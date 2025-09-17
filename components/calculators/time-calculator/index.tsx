"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Minus, Calculator, Calendar } from "lucide-react";

interface TimeValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeCalculatorProps {
  t?: any;
  locale?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function TimeCalculator({ t, locale = 'en' }: TimeCalculatorProps) {
  // Basic Time Arithmetic
  const [time1, setTime1] = useState<TimeValue>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [time2, setTime2] = useState<TimeValue>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [basicResult, setBasicResult] = useState<TimeValue | null>(null);

  // Date Time Calculator
  const [startYear, setStartYear] = useState(new Date().getFullYear().toString());
  const [startMonth, setStartMonth] = useState((new Date().getMonth() + 1).toString());
  const [startDay, setStartDay] = useState(new Date().getDate().toString());
  const [startTime, setStartTime] = useState("12:00");
  const [dateOperation, setDateOperation] = useState<"add" | "subtract">("add");
  const [timeToAddSubtract, setTimeToAddSubtract] = useState<TimeValue>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [dateResult, setDateResult] = useState<{ date: string; time: string } | null>(null);

  // Expression Calculator
  const [expression, setExpression] = useState("1d 2h 3m 4s + 4h 5s - 2030s");
  const [expressionResult, setExpressionResult] = useState<TimeValue | null>(null);

  // Convert time value to total seconds
  const timeToSeconds = useCallback((time: TimeValue): number => {
    return time.days * 86400 + time.hours * 3600 + time.minutes * 60 + time.seconds;
  }, []);

  // Convert seconds back to time value
  const secondsToTime = useCallback((totalSeconds: number): TimeValue => {
    const isNegative = totalSeconds < 0;
    const absSeconds = Math.abs(totalSeconds);
    
    const days = Math.floor(absSeconds / 86400);
    const hours = Math.floor((absSeconds % 86400) / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const seconds = absSeconds % 60;

    return {
      days: isNegative ? -days : days,
      hours: isNegative ? -hours : hours,
      minutes: isNegative ? -minutes : minutes,
      seconds: isNegative ? -seconds : seconds
    };
  }, []);

  // Calculate basic time arithmetic
  const calculateBasicTime = useCallback(() => {
    const seconds1 = timeToSeconds(time1);
    const seconds2 = timeToSeconds(time2);
    
    const resultSeconds = operation === "add" ? seconds1 + seconds2 : seconds1 - seconds2;
    setBasicResult(secondsToTime(resultSeconds));
  }, [time1, time2, operation, timeToSeconds, secondsToTime]);

  // Helper function to get days in month
  const getDaysInMonth = useCallback((year: string, month: string): number => {
    if (!year || !month) return 31;
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  }, []);

  // Calculate date time arithmetic
  const calculateDateTime = useCallback(() => {
    if (!startYear || !startMonth || !startDay || !startTime) return;

    const startDate = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const totalSecondsToAdd = timeToSeconds(timeToAddSubtract);
    const millisecondsToAdd = totalSecondsToAdd * 1000;

    const resultDateTime = new Date(startDateTime.getTime() + (dateOperation === "add" ? millisecondsToAdd : -millisecondsToAdd));

    setDateResult({
      date: resultDateTime.toISOString().split('T')[0],
      time: resultDateTime.toTimeString().slice(0, 5)
    });
  }, [startYear, startMonth, startDay, startTime, timeToAddSubtract, dateOperation, timeToSeconds, getDaysInMonth]);

  // Parse and calculate expression
  const calculateExpression = useCallback(() => {
    try {
      // Parse expression like "1d 2h 3m 4s + 4h 5s - 2030s"
      const tokens = expression.replace(/\s+/g, ' ').trim().split(/\s+/);
      let totalSeconds = 0;
      let currentSign = 1;

      for (const token of tokens) {
        if (token === '+') {
          currentSign = 1;
        } else if (token === '-') {
          currentSign = -1;
        } else {
          // Parse time value like "1d", "2h", "3m", "4s"
          const matches = token.match(/(\d+)([dhms])/g);
          if (matches) {
            let tokenSeconds = 0;
            for (const match of matches) {
              const value = parseInt(match.slice(0, -1));
              const unit = match.slice(-1);
              
              switch (unit) {
                case 'd': tokenSeconds += value * 86400; break;
                case 'h': tokenSeconds += value * 3600; break;
                case 'm': tokenSeconds += value * 60; break;
                case 's': tokenSeconds += value; break;
              }
            }
            totalSeconds += currentSign * tokenSeconds;
          }
        }
      }

      setExpressionResult(secondsToTime(totalSeconds));
    } catch (error) {
      console.error("Error parsing expression:", error);
    }
  }, [expression, secondsToTime]);

  // Clear all results
  const clearAll = useCallback(() => {
    setTime1({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setTime2({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setBasicResult(null);
    setStartYear(new Date().getFullYear().toString());
    setStartMonth((new Date().getMonth() + 1).toString());
    setStartDay(new Date().getDate().toString());
    setStartTime("12:00");
    setTimeToAddSubtract({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setDateResult(null);
    setExpression("1d 2h 3m 4s + 4h 5s - 2030s");
    setExpressionResult(null);
  }, []);

  // Format time result for display
  const formatTimeResult = useCallback((time: TimeValue): string => {
    const parts = [];
    if (time.days !== 0) parts.push(`${time.days}d`);
    if (time.hours !== 0) parts.push(`${time.hours}h`);
    if (time.minutes !== 0) parts.push(`${time.minutes}m`);
    if (time.seconds !== 0) parts.push(`${time.seconds}s`);
    
    return parts.length > 0 ? parts.join(' ') : '0s';
  }, []);

  // Time input component
  const TimeInput = ({ value, onChange, label }: { value: TimeValue; onChange: (value: TimeValue) => void; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-4 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">Days</Label>
          <Input
            type="number"
            value={value.days}
            onChange={(e) => onChange({ ...value, days: parseInt(e.target.value) || 0 })}
            className="h-8"
            min="0"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Hours</Label>
          <Input
            type="number"
            value={value.hours}
            onChange={(e) => onChange({ ...value, hours: parseInt(e.target.value) || 0 })}
            className="h-8"
            min="0"
            max="23"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Minutes</Label>
          <Input
            type="number"
            value={value.minutes}
            onChange={(e) => onChange({ ...value, minutes: parseInt(e.target.value) || 0 })}
            className="h-8"
            min="0"
            max="59"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Seconds</Label>
          <Input
            type="number"
            value={value.seconds}
            onChange={(e) => onChange({ ...value, seconds: parseInt(e.target.value) || 0 })}
            className="h-8"
            min="0"
            max="59"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">{t?.tabs?.basic || "Basic Time Math"}</TabsTrigger>
          <TabsTrigger value="datetime">{t?.tabs?.datetime || "Date & Time"}</TabsTrigger>
          <TabsTrigger value="expression">{t?.tabs?.expression || "Expression"}</TabsTrigger>
        </TabsList>

        {/* Basic Time Arithmetic */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="size-5" />
                {t?.basic?.title || "Time Addition & Subtraction"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TimeInput 
                value={time1} 
                onChange={setTime1} 
                label={t?.basic?.time1 || "First Time Value"} 
              />
              
              <div className="flex justify-center">
                <Select value={operation} onValueChange={(value: "add" | "subtract") => setOperation(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">
                      <div className="flex items-center gap-2">
                        <Plus className="size-4" />
                        Add
                      </div>
                    </SelectItem>
                    <SelectItem value="subtract">
                      <div className="flex items-center gap-2">
                        <Minus className="size-4" />
                        Subtract
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TimeInput 
                value={time2} 
                onChange={setTime2} 
                label={t?.basic?.time2 || "Second Time Value"} 
              />

              <div className="flex gap-2">
                <Button onClick={calculateBasicTime} className="flex-1">
                  {t?.basic?.calculate || "Calculate"}
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  {t?.basic?.clear || "Clear"}
                </Button>
              </div>

              {basicResult && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">
                      {t?.basic?.result || "Result"}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {formatTimeResult(basicResult)}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Date Time Calculator */}
        <TabsContent value="datetime">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5" />
                {t?.datetime?.title || "Add or Subtract Time from Date"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="size-4" />
                    {t?.datetime?.startDate || "Start Date"}
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground font-medium">Month</Label>
                      <Select value={startMonth} onValueChange={setStartMonth}>
                        <SelectTrigger className="h-10">
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
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground font-medium">Day</Label>
                      <Select value={startDay} onValueChange={setStartDay}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: getDaysInMonth(startYear, startMonth) }, (_, i) => i + 1).map((day) => (
                            <SelectItem key={day} value={day.toString()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground font-medium">Year</Label>
                      <Select value={startYear} onValueChange={setStartYear}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="size-4" />
                    {t?.datetime?.startTime || "Start Time"}
                  </Label>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-medium">Time</Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Select value={dateOperation} onValueChange={(value: "add" | "subtract") => setDateOperation(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">
                      <div className="flex items-center gap-2">
                        <Plus className="size-4" />
                        Add
                      </div>
                    </SelectItem>
                    <SelectItem value="subtract">
                      <div className="flex items-center gap-2">
                        <Minus className="size-4" />
                        Subtract
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TimeInput 
                value={timeToAddSubtract} 
                onChange={setTimeToAddSubtract} 
                label={t?.datetime?.timeValue || "Time to Add/Subtract"} 
              />

              <Button onClick={calculateDateTime} className="w-full">
                {t?.datetime?.calculate || "Calculate New Date & Time"}
              </Button>

              {dateResult && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">
                      {t?.datetime?.result || "Result"}
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {dateResult.date} at {dateResult.time}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expression Calculator */}
        <TabsContent value="expression">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="size-5" />
                {t?.expression?.title || "Time Calculator Expression"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t?.expression?.input || "Time Expression"}</Label>
                <Input
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  placeholder="1d 2h 3m 4s + 4h 5s - 2030s"
                  className="font-mono"
                />
                <div className="text-xs text-muted-foreground">
                  {t?.expression?.help || "Use d (days), h (hours), m (minutes), s (seconds). Example: 1d 2h 30m + 45m - 15s"}
                </div>
              </div>

              <Button onClick={calculateExpression} className="w-full">
                {t?.expression?.calculate || "Calculate Expression"}
              </Button>

              {expressionResult && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">
                      {t?.expression?.result || "Result"}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {formatTimeResult(expressionResult)}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{t?.expression?.examples?.title || "Examples"}</h4>
                <div className="space-y-1 text-sm">
                  <div><Badge variant="outline">2h 30m + 1h 15m</Badge> = 3h 45m</div>
                  <div><Badge variant="outline">1d 12h - 6h 30m</Badge> = 1d 5h 30m</div>
                  <div><Badge variant="outline">3600s + 2h - 30m</Badge> = 2h 30m</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}