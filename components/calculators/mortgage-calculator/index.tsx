"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface MortgageData {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  downPayment: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
}

interface MortgageResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principalAmount: number;
  monthlyPrincipal: number;
  monthlyInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  loanToValueRatio: number;
}

const initialData: MortgageData = {
  loanAmount: 300000,
  interestRate: 4.5,
  loanTerm: 30,
  downPayment: 60000,
  propertyTax: 3600,
  insurance: 1200,
  pmi: 0,
};

export default function MortgageCalculator() {
  const [data, setData] = useState<MortgageData>(initialData);
  const [results, setResults] = useState<MortgageResults | null>(null);

  const calculateMortgage = (mortgageData: MortgageData): MortgageResults => {
    const principal = mortgageData.loanAmount - mortgageData.downPayment;
    const monthlyRate = mortgageData.interestRate / 100 / 12;
    const numberOfPayments = mortgageData.loanTerm * 12;

    // Calculate monthly payment using the mortgage formula
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Calculate total payment and interest
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Calculate monthly breakdown
    const monthlyTax = mortgageData.propertyTax / 12;
    const monthlyInsurance = mortgageData.insurance / 12;
    const monthlyPMI = mortgageData.pmi / 12;

    // Calculate loan-to-value ratio
    const loanToValueRatio = (principal / mortgageData.loanAmount) * 100;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      principalAmount: principal,
      monthlyPrincipal: monthlyPayment,
      monthlyInterest: monthlyPayment * monthlyRate,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      loanToValueRatio,
    };
  };

  useEffect(() => {
    const calculatedResults = calculateMortgage(data);
    setResults(calculatedResults);
  }, [data]);

  const handleInputChange = (field: keyof MortgageData, value: number) => {
    setData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };



  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Main Inputs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Loan Amount */}
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={data.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                    className="pl-8"
                    placeholder="300,000"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Range: $50,000 - $1,000,000
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <div className="relative">
                  <Input
                    id="interestRate"
                    type="number"
                    value={data.interestRate}
                    onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                    step="0.01"
                    className="pr-8"
                    placeholder="4.5"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Range: 1% - 10%
                </div>
              </div>

              {/* Loan Term */}
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <div className="flex gap-2">
                  <Button
                    variant={data.loanTerm === 15 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('loanTerm', 15)}
                  >
                    15 Years
                  </Button>
                  <Button
                    variant={data.loanTerm === 30 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('loanTerm', 30)}
                  >
                    30 Years
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Range: 5 - 50 years
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Down Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Down Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="downPayment"
                    type="number"
                    value={data.downPayment}
                    onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                    className="pl-8"
                    placeholder="60,000"
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  Down Payment: {formatPercentage((data.downPayment / data.loanAmount) * 100)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Additional Costs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Property Tax */}
              <div className="space-y-2">
                <Label htmlFor="propertyTax">Annual Property Tax</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="propertyTax"
                    type="number"
                    value={data.propertyTax}
                    onChange={(e) => handleInputChange('propertyTax', Number(e.target.value))}
                    className="pl-8"
                    placeholder="3,600"
                  />
                </div>
              </div>

              {/* Insurance */}
              <div className="space-y-2">
                <Label htmlFor="insurance">Annual Insurance</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="insurance"
                    type="number"
                    value={data.insurance}
                    onChange={(e) => handleInputChange('insurance', Number(e.target.value))}
                    className="pl-8"
                    placeholder="1,200"
                  />
                </div>
              </div>

              {/* PMI */}
              <div className="space-y-2">
                <Label htmlFor="pmi">Annual PMI (if applicable)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="pmi"
                    type="number"
                    value={data.pmi}
                    onChange={(e) => handleInputChange('pmi', Number(e.target.value))}
                    className="pl-8"
                    placeholder="0"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  PMI is typically required when down payment is less than 20%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly Payment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(results.monthlyPayment + results.monthlyTax + results.monthlyInsurance + results.monthlyPMI)}
                </div>
                <div className="text-sm text-muted-foreground">Total Monthly Payment</div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Principal & Interest</span>
                  <span className="font-medium">{formatCurrency(results.monthlyPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Property Tax</span>
                  <span className="font-medium">{formatCurrency(results.monthlyTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance</span>
                  <span className="font-medium">{formatCurrency(results.monthlyInsurance)}</span>
                </div>
                {results.monthlyPMI > 0 && (
                  <div className="flex justify-between">
                    <span>PMI</span>
                    <span className="font-medium">{formatCurrency(results.monthlyPMI)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Loan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Loan Amount</span>
                  <span className="font-medium">{formatCurrency(data.loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Down Payment</span>
                  <span className="font-medium">{formatCurrency(data.downPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Principal Amount</span>
                  <span className="font-medium">{formatCurrency(results.principalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate</span>
                  <span className="font-medium">{formatPercentage(data.interestRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loan Term</span>
                  <span className="font-medium">{data.loanTerm} years</span>
                </div>
                <div className="flex justify-between">
                  <span>LTV Ratio</span>
                  <span className="font-medium">{formatPercentage(results.loanToValueRatio)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span>Total Payment</span>
                  <span className="font-bold">{formatCurrency(results.totalPayment)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Total Interest</span>
                  <span className="font-bold text-red-600">{formatCurrency(results.totalInterest)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                newData.loanAmount = 300000;
                newData.interestRate = 4.5;
                newData.loanTerm = 30;
                newData.downPayment = 60000;
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
                    `Mortgage Calculator Results:\n` +
                    `Loan Amount: ${formatCurrency(data.loanAmount)}\n` +
                    `Monthly Payment: ${formatCurrency(results.monthlyPayment)}\n` +
                    `Total Payment: ${formatCurrency(results.totalPayment)}\n` +
                    `Total Interest: ${formatCurrency(results.totalInterest)}`
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