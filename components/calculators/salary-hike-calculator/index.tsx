"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SalaryHikeData {
  currentSalary: number;
  newSalary: number;
  hikePercentage: number;
}

interface SalaryHikeResults {
  hikePercentage: number;
  newSalary: number;
  salaryIncrease: number;
  monthlyIncrease: number;
  yearlyIncrease: number;
}

const initialData: SalaryHikeData = {
  currentSalary: 0,
  newSalary: 0,
  hikePercentage: 0,
};

export default function SalaryHikeCalculator() {
  const [data, setData] = useState<SalaryHikeData>(initialData);
  const [results, setResults] = useState<SalaryHikeResults | null>(null);
  const [calculationMode, setCalculationMode] = useState<'percentage' | 'salary'>('percentage');

  const calculateHikePercentage = useCallback((currentSalary: number, newSalary: number): number => {
    if (currentSalary === 0) return 0;
    return ((newSalary - currentSalary) / currentSalary) * 100;
  }, []);

  const calculateNewSalary = useCallback((currentSalary: number, hikePercentage: number): number => {
    return currentSalary * (1 + hikePercentage / 100);
  }, []);

  const calculateSalaryHike = useCallback((hikeData: SalaryHikeData): SalaryHikeResults => {
    let hikePercentage: number;
    let newSalary: number;

    if (calculationMode === 'percentage') {
      // Calculate new salary from current salary and hike percentage
      hikePercentage = hikeData.hikePercentage;
      newSalary = calculateNewSalary(hikeData.currentSalary, hikePercentage);
    } else {
      // Calculate hike percentage from current salary and new salary
      newSalary = hikeData.newSalary;
      hikePercentage = calculateHikePercentage(hikeData.currentSalary, newSalary);
    }

    const salaryIncrease = newSalary - hikeData.currentSalary;
    const monthlyIncrease = salaryIncrease / 12;
    const yearlyIncrease = salaryIncrease;

    return {
      hikePercentage,
      newSalary,
      salaryIncrease,
      monthlyIncrease,
      yearlyIncrease,
    };
  }, [calculationMode, calculateHikePercentage, calculateNewSalary]);

  useEffect(() => {
    if (data.currentSalary > 0 && ((calculationMode === 'percentage' && data.hikePercentage > 0) || (calculationMode === 'salary' && data.newSalary > 0))) {
      const calculatedResults = calculateSalaryHike(data);
      setResults(calculatedResults);
    } else {
      setResults(null);
    }
  }, [data, calculationMode, calculateSalaryHike]);

  const handleInputChange = (field: keyof SalaryHikeData, value: number) => {
    setData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const getHikeStatus = (hikePercentage: number): { status: string; color: string } => {
    if (hikePercentage <= 0) return { status: "No Hike", color: "bg-gray-500" };
    if (hikePercentage < 5) return { status: "Low Hike", color: "bg-yellow-500" };
    if (hikePercentage < 10) return { status: "Moderate Hike", color: "bg-orange-500" };
    if (hikePercentage < 20) return { status: "Good Hike", color: "bg-green-500" };
    if (hikePercentage < 30) return { status: "Excellent Hike", color: "bg-green-600" };
    return { status: "Exceptional Hike", color: "bg-green-700" };
  };

  const resetCalculator = () => {
    setData(initialData);
    setResults(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Calculation Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calculation Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={calculationMode} onValueChange={(value) => setCalculationMode(value as 'percentage' | 'salary')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="percentage">Find New Salary by Hike Percentage</TabsTrigger>
              <TabsTrigger value="salary">Find Hike Percentage by Salary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="percentage" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentSalary">Current Salary</Label>
                  <Input
                    id="currentSalary"
                    type="number"
                    value={data.currentSalary}
                    onChange={(e) => handleInputChange('currentSalary', Number(e.target.value))}
                    placeholder="50000"
                    step="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hikePercentage">Hike Percentage (%)</Label>
                  <Input
                    id="hikePercentage"
                    type="number"
                    value={data.hikePercentage}
                    onChange={(e) => handleInputChange('hikePercentage', Number(e.target.value))}
                    placeholder="10"
                    step="0.1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="salary" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentSalary2">Current Salary</Label>
                  <Input
                    id="currentSalary2"
                    type="number"
                    value={data.currentSalary}
                    onChange={(e) => handleInputChange('currentSalary', Number(e.target.value))}
                    placeholder="50000"
                    step="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newSalary">New Salary</Label>
                  <Input
                    id="newSalary"
                    type="number"
                    value={data.newSalary}
                    onChange={(e) => handleInputChange('newSalary', Number(e.target.value))}
                    placeholder="55000"
                    step="1000"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Hike Percentage Result */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Hike Percentage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {formatPercentage(results.hikePercentage)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">Salary Increase</div>
                
                <Badge className={`${getHikeStatus(results.hikePercentage).color} text-white text-lg px-4 py-2`}>
                  {getHikeStatus(results.hikePercentage).status}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Hike Percentage</span>
                  <span className="font-medium">{formatPercentage(results.hikePercentage)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Salary</span>
                  <span className="font-medium">{formatCurrency(data.currentSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span>New Salary</span>
                  <span className="font-medium">{formatCurrency(results.newSalary)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Salary Result */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your New Salary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {formatCurrency(results.newSalary)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Annual Salary After Hike
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Salary Increase</span>
                  <span className="font-medium text-green-600">{formatCurrency(results.salaryIncrease)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Increase</span>
                  <span className="font-medium text-green-600">{formatCurrency(results.monthlyIncrease)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Yearly Increase</span>
                  <span className="font-medium text-green-600">{formatCurrency(results.yearlyIncrease)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Hike Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Hike Calculations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[5, 10, 15, 20, 25, 30, 35, 40].map((percentage) => (
              <Button
                key={percentage}
                variant="outline"
                onClick={() => {
                  setCalculationMode('percentage');
                  setData(prev => ({
                    ...prev,
                    hikePercentage: percentage,
                  }));
                }}
                className="text-sm"
              >
                {percentage}% Hike
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hike Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hike Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-gray-500 text-white">0%</Badge>
                  <span className="text-sm">No Hike - No salary increase</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-500 text-white">1-5%</Badge>
                  <span className="text-sm">Low Hike - Below average increase</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-500 text-white">5-10%</Badge>
                  <span className="text-sm">Moderate Hike - Standard increase</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500 text-white">10-20%</Badge>
                  <span className="text-sm">Good Hike - Above average increase</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-600 text-white">20-30%</Badge>
                  <span className="text-sm">Excellent Hike - Significant increase</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-700 text-white">30%+</Badge>
                  <span className="text-sm">Exceptional Hike - Outstanding increase</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={resetCalculator}
            >
              Reset Calculator
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (results) {
                  navigator.clipboard?.writeText(
                    `Salary Hike Calculator Results:\n` +
                    `Current Salary: ${formatCurrency(data.currentSalary)}\n` +
                    `Hike Percentage: ${formatPercentage(results.hikePercentage)}\n` +
                    `New Salary: ${formatCurrency(results.newSalary)}\n` +
                    `Salary Increase: ${formatCurrency(results.salaryIncrease)}\n` +
                    `Monthly Increase: ${formatCurrency(results.monthlyIncrease)}\n` +
                    `Yearly Increase: ${formatCurrency(results.yearlyIncrease)}`
                  );
                }
              }}
            >
              Copy Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 