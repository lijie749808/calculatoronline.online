"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface BMIData {
  weight: number;
  height: number;
  unitSystem: 'metric' | 'imperial';
}

interface BMIResults {
  bmi: number;
  category: string;
  categoryColor: string;
  healthyWeightRange: {
    min: number;
    max: number;
  };
}

const initialData: BMIData = {
  weight: 70,
  height: 170,
  unitSystem: 'metric',
};

export default function BMICalculator() {
  const [data, setData] = useState<BMIData>(initialData);
  const [results, setResults] = useState<BMIResults | null>(null);

  const calculateBMI = (bmiData: BMIData): BMIResults => {
    let weightKg: number;
    let heightM: number;

    if (bmiData.unitSystem === 'metric') {
      weightKg = bmiData.weight;
      heightM = bmiData.height / 100; // Convert cm to meters
    } else {
      // Imperial: weight in lbs, height in inches
      weightKg = bmiData.weight * 0.453592; // Convert lbs to kg
      heightM = bmiData.height * 0.0254; // Convert inches to meters
    }

    const bmi = weightKg / (heightM * heightM);
    
    // Determine category and color
    let category: string;
    let categoryColor: string;
    
    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'bg-blue-500';
    } else if (bmi < 25) {
      category = 'Normal weight';
      categoryColor = 'bg-green-500';
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryColor = 'bg-yellow-500';
    } else if (bmi < 35) {
      category = 'Obese (Class I)';
      categoryColor = 'bg-orange-500';
    } else if (bmi < 40) {
      category = 'Obese (Class II)';
      categoryColor = 'bg-red-500';
    } else {
      category = 'Obese (Class III)';
      categoryColor = 'bg-red-700';
    }

    // Calculate healthy weight range
    const minHealthyBMI = 18.5;
    const maxHealthyBMI = 24.9;
    const minHealthyWeight = minHealthyBMI * (heightM * heightM);
    const maxHealthyWeight = maxHealthyBMI * (heightM * heightM);

    const healthyWeightRange = {
      min: minHealthyWeight,
      max: maxHealthyWeight,
    };

    // Convert back to imperial if needed
    if (bmiData.unitSystem === 'imperial') {
      healthyWeightRange.min = healthyWeightRange.min / 0.453592;
      healthyWeightRange.max = healthyWeightRange.max / 0.453592;
    }

    return {
      bmi,
      category,
      categoryColor,
      healthyWeightRange,
    };
  };

  useEffect(() => {
    const calculatedResults = calculateBMI(data);
    setResults(calculatedResults);
  }, [data]);

  const handleInputChange = (field: keyof BMIData, value: number | string) => {
    setData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatNumber = (value: number, decimals: number = 1) => {
    return value.toFixed(decimals);
  };

  const getWeightUnit = () => data.unitSystem === 'metric' ? 'kg' : 'lbs';
  const getHeightUnit = () => data.unitSystem === 'metric' ? 'cm' : 'in';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Unit System Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Unit System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={data.unitSystem === 'metric' ? 'default' : 'outline'}
              onClick={() => handleInputChange('unitSystem', 'metric')}
            >
              Metric (kg, cm)
            </Button>
            <Button
              variant={data.unitSystem === 'imperial' ? 'default' : 'outline'}
              onClick={() => handleInputChange('unitSystem', 'imperial')}
            >
              Imperial (lbs, in)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weight Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight ({getWeightUnit()})</Label>
              <div className="relative">
                <Input
                  id="weight"
                  type="number"
                  value={data.weight}
                  onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                  placeholder={data.unitSystem === 'metric' ? "70" : "154"}
                  step="0.1"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Range: {data.unitSystem === 'metric' ? '30-300 kg' : '66-660 lbs'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Height Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Height</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height ({getHeightUnit()})</Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  value={data.height}
                  onChange={(e) => handleInputChange('height', Number(e.target.value))}
                  placeholder={data.unitSystem === 'metric' ? "170" : "67"}
                  step="0.1"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Range: {data.unitSystem === 'metric' ? '100-250 cm' : '39-98 in'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {results && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* BMI Result */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your BMI Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {formatNumber(results.bmi)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">BMI Value</div>
                
                <Badge className={`${results.categoryColor} text-white text-lg px-4 py-2`}>
                  {results.category}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>BMI Category</span>
                  <span className="font-medium">{results.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>BMI Value</span>
                  <span className="font-medium">{formatNumber(results.bmi)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Healthy Weight Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Healthy Weight Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {formatNumber(results.healthyWeightRange.min)} - {formatNumber(results.healthyWeightRange.max)} {getWeightUnit()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Recommended weight range for your height
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Minimum healthy weight</span>
                  <span className="font-medium">{formatNumber(results.healthyWeightRange.min)} {getWeightUnit()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum healthy weight</span>
                  <span className="font-medium">{formatNumber(results.healthyWeightRange.max)} {getWeightUnit()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* BMI Categories Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">BMI Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500 text-white">Underweight</Badge>
                <span className="text-sm">BMI &lt; 18.5</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500 text-white">Normal weight</Badge>
                <span className="text-sm">BMI 18.5 - 24.9</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-yellow-500 text-white">Overweight</Badge>
                <span className="text-sm">BMI 25.0 - 29.9</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-orange-500 text-white">Obese (Class I)</Badge>
                <span className="text-sm">BMI 30.0 - 34.9</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-red-500 text-white">Obese (Class II)</Badge>
                <span className="text-sm">BMI 35.0 - 39.9</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-red-700 text-white">Obese (Class III)</Badge>
                <span className="text-sm">BMI ≥ 40.0</span>
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
              onClick={() => {
                const newData = { ...data };
                if (data.unitSystem === 'metric') {
                  newData.weight = 70;
                  newData.height = 170;
                } else {
                  newData.weight = 154;
                  newData.height = 67;
                }
                setData(newData);
              }}
            >
              Reset to Default
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (results) {
                  navigator.clipboard?.writeText(
                    `BMI Calculator Results:\n` +
                    `Weight: ${data.weight} ${getWeightUnit()}\n` +
                    `Height: ${data.height} ${getHeightUnit()}\n` +
                    `BMI: ${formatNumber(results.bmi)}\n` +
                    `Category: ${results.category}\n` +
                    `Healthy Weight Range: ${formatNumber(results.healthyWeightRange.min)} - ${formatNumber(results.healthyWeightRange.max)} ${getWeightUnit()}`
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