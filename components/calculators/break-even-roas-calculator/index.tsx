"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CostItem {
  amount: number;
  vatRate: number;
}

interface ROASData {
  costs: {
    costOfGoods: CostItem;
    shippingCosts: CostItem;
    transactionCosts: CostItem;
    otherCosts: CostItem;
  };
  revenue: {
    amount: number;
    vatRate: number;
  };
}

interface ROASResults {
  totalCosts: number;
  totalRevenue: number;
  breakEvenROAS: number;
  profit: number;
  profitMargin: number;
}

const vatOptions = [
  { value: 0, label: "None" },
  { value: 6, label: "6%" },
  { value: 7, label: "7%" },
  { value: 9, label: "9%" },
  { value: 10, label: "10%" },
  { value: 19, label: "19%" },
  { value: 20, label: "20%" },
  { value: 21, label: "21%" },
  { value: 24, label: "24%" },
  { value: 25, label: "25%" },
];

const initialData: ROASData = {
  costs: {
    costOfGoods: { amount: 0, vatRate: 0 },
    shippingCosts: { amount: 0, vatRate: 0 },
    transactionCosts: { amount: 0, vatRate: 0 },
    otherCosts: { amount: 0, vatRate: 0 },
  },
  revenue: {
    amount: 0,
    vatRate: 0,
  },
};

export default function BreakEvenROASCalculator() {
  const [data, setData] = useState<ROASData>(initialData);
  const [results, setResults] = useState<ROASResults | null>(null);



  const calculateNetAmount = (amount: number, vatRate: number): number => {
    return amount / (1 + vatRate / 100);
  };

  const calculateBreakEvenROAS = useCallback((roasData: ROASData): ROASResults => {
    // Calculate total costs (including VAT)
    const costOfGoodsNet = calculateNetAmount(roasData.costs.costOfGoods.amount, roasData.costs.costOfGoods.vatRate);
    const shippingCostsNet = calculateNetAmount(roasData.costs.shippingCosts.amount, roasData.costs.shippingCosts.vatRate);
    const transactionCostsNet = calculateNetAmount(roasData.costs.transactionCosts.amount, roasData.costs.transactionCosts.vatRate);
    const otherCostsNet = calculateNetAmount(roasData.costs.otherCosts.amount, roasData.costs.otherCosts.vatRate);

    const totalCosts = costOfGoodsNet + shippingCostsNet + transactionCostsNet + otherCostsNet;

    // Calculate revenue (net of VAT)
    const revenueNet = calculateNetAmount(roasData.revenue.amount, roasData.revenue.vatRate);

    // Calculate Break Even ROAS
    const breakEvenROAS = revenueNet / (revenueNet - totalCosts);

    // Calculate profit and margin
    const profit = revenueNet - totalCosts;
    const profitMargin = (profit / revenueNet) * 100;

    return {
      totalCosts,
      totalRevenue: revenueNet,
      breakEvenROAS,
      profit,
      profitMargin,
    };
  }, []);

  useEffect(() => {
    const calculatedResults = calculateBreakEvenROAS(data);
    setResults(calculatedResults);
  }, [data, calculateBreakEvenROAS]);

  const handleCostChange = (costType: keyof ROASData['costs'], field: 'amount' | 'vatRate', value: number) => {
    setData(prev => ({
      ...prev,
      costs: {
        ...prev.costs,
        [costType]: {
          ...prev.costs[costType],
          [field]: value,
        },
      },
    }));
  };

  const handleRevenueChange = (field: 'amount' | 'vatRate', value: number) => {
    setData(prev => ({
      ...prev,
      revenue: {
        ...prev.revenue,
        [field]: value,
      },
    }));
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 2): string => {
    return value.toFixed(decimals);
  };

  const getROASStatus = (roas: number): { status: string; color: string } => {
    if (roas <= 0) return { status: "Invalid", color: "bg-red-500" };
    if (roas < 1) return { status: "Loss", color: "bg-red-500" };
    if (roas === 1) return { status: "Break Even", color: "bg-yellow-500" };
    if (roas < 2) return { status: "Low Profit", color: "bg-orange-500" };
    if (roas < 4) return { status: "Good Profit", color: "bg-green-500" };
    return { status: "Excellent Profit", color: "bg-green-700" };
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Costs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Costs per Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cost of Goods */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costOfGoods">Cost of Goods (incl. VAT)</Label>
              <Input
                id="costOfGoods"
                type="number"
                value={data.costs.costOfGoods.amount}
                onChange={(e) => handleCostChange('costOfGoods', 'amount', Number(e.target.value))}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>VAT Rate</Label>
              <Select
                value={data.costs.costOfGoods.vatRate.toString()}
                onValueChange={(value) => handleCostChange('costOfGoods', 'vatRate', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select VAT" />
                </SelectTrigger>
                <SelectContent>
                  {vatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Net Amount</Label>
              <div className="p-2 bg-muted rounded text-sm">
                {formatCurrency(calculateNetAmount(data.costs.costOfGoods.amount, data.costs.costOfGoods.vatRate))}
              </div>
            </div>
          </div>

          {/* Shipping Costs */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shippingCosts">Shipping Costs (incl. VAT)</Label>
              <Input
                id="shippingCosts"
                type="number"
                value={data.costs.shippingCosts.amount}
                onChange={(e) => handleCostChange('shippingCosts', 'amount', Number(e.target.value))}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>VAT Rate</Label>
              <Select
                value={data.costs.shippingCosts.vatRate.toString()}
                onValueChange={(value) => handleCostChange('shippingCosts', 'vatRate', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select VAT" />
                </SelectTrigger>
                <SelectContent>
                  {vatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Net Amount</Label>
              <div className="p-2 bg-muted rounded text-sm">
                {formatCurrency(calculateNetAmount(data.costs.shippingCosts.amount, data.costs.shippingCosts.vatRate))}
              </div>
            </div>
          </div>

          {/* Transaction Costs */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionCosts">Transaction Costs (incl. VAT)</Label>
              <Input
                id="transactionCosts"
                type="number"
                value={data.costs.transactionCosts.amount}
                onChange={(e) => handleCostChange('transactionCosts', 'amount', Number(e.target.value))}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>VAT Rate</Label>
              <Select
                value={data.costs.transactionCosts.vatRate.toString()}
                onValueChange={(value) => handleCostChange('transactionCosts', 'vatRate', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select VAT" />
                </SelectTrigger>
                <SelectContent>
                  {vatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Net Amount</Label>
              <div className="p-2 bg-muted rounded text-sm">
                {formatCurrency(calculateNetAmount(data.costs.transactionCosts.amount, data.costs.transactionCosts.vatRate))}
              </div>
            </div>
          </div>

          {/* Other Costs */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="otherCosts">Other Costs (incl. VAT)</Label>
              <Input
                id="otherCosts"
                type="number"
                value={data.costs.otherCosts.amount}
                onChange={(e) => handleCostChange('otherCosts', 'amount', Number(e.target.value))}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>VAT Rate</Label>
              <Select
                value={data.costs.otherCosts.vatRate.toString()}
                onValueChange={(value) => handleCostChange('otherCosts', 'vatRate', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select VAT" />
                </SelectTrigger>
                <SelectContent>
                  {vatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Net Amount</Label>
              <div className="p-2 bg-muted rounded text-sm">
                {formatCurrency(calculateNetAmount(data.costs.otherCosts.amount, data.costs.otherCosts.vatRate))}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center p-3 bg-muted rounded">
            <span className="font-semibold">Total Costs per Product</span>
            <span className="text-lg font-bold">
              {results ? formatCurrency(results.totalCosts) : "€0.00"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue per Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue (incl. VAT)</Label>
              <Input
                id="revenue"
                type="number"
                value={data.revenue.amount}
                onChange={(e) => handleRevenueChange('amount', Number(e.target.value))}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>VAT Rate</Label>
              <Select
                value={data.revenue.vatRate.toString()}
                onValueChange={(value) => handleRevenueChange('vatRate', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select VAT" />
                </SelectTrigger>
                <SelectContent>
                  {vatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Net Revenue</Label>
              <div className="p-2 bg-muted rounded text-sm">
                {results ? formatCurrency(results.totalRevenue) : "€0.00"}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center p-3 bg-muted rounded">
            <span className="font-semibold">Total Revenue per Product</span>
            <span className="text-lg font-bold">
              {results ? formatCurrency(results.totalRevenue) : "€0.00"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Break Even ROAS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Break Even ROAS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {formatNumber(results.breakEvenROAS)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">ROAS Value</div>
                
                <Badge className={`${getROASStatus(results.breakEvenROAS).color} text-white text-lg px-4 py-2`}>
                  {getROASStatus(results.breakEvenROAS).status}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Break Even ROAS</span>
                  <span className="font-medium">{formatNumber(results.breakEvenROAS)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Costs</span>
                  <span className="font-medium">{formatCurrency(results.totalCosts)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Revenue</span>
                  <span className="font-medium">{formatCurrency(results.totalRevenue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profit Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profit Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${results.profit >= 0 ? 'text-green-600' : 'text-red-600'} mb-2`}>
                  {formatCurrency(results.profit)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Net Profit per Product
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Profit Margin</span>
                  <span className={`font-medium ${results.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatNumber(results.profitMargin)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Profit per Product</span>
                  <span className={`font-medium ${results.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(results.profit)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ROAS Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ROAS Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-500 text-white">ROAS &lt; 1</Badge>
                  <span className="text-sm">Loss - Campaign is losing money</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-500 text-white">ROAS = 1</Badge>
                  <span className="text-sm">Break Even - No profit, no loss</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-500 text-white">ROAS 1-2</Badge>
                  <span className="text-sm">Low Profit - Small profit margin</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500 text-white">ROAS 2-4</Badge>
                  <span className="text-sm">Good Profit - Healthy profit margin</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-700 text-white">ROAS &gt; 4</Badge>
                  <span className="text-sm">Excellent Profit - High profit margin</span>
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
              onClick={() => setData(initialData)}
            >
              Reset to Default
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (results) {
                  navigator.clipboard?.writeText(
                    `Break Even ROAS Calculator Results:\n` +
                    `Cost of Goods: ${formatCurrency(data.costs.costOfGoods.amount)} (VAT: ${data.costs.costOfGoods.vatRate}%)\n` +
                    `Shipping Costs: ${formatCurrency(data.costs.shippingCosts.amount)} (VAT: ${data.costs.shippingCosts.vatRate}%)\n` +
                    `Transaction Costs: ${formatCurrency(data.costs.transactionCosts.amount)} (VAT: ${data.costs.transactionCosts.vatRate}%)\n` +
                    `Other Costs: ${formatCurrency(data.costs.otherCosts.amount)} (VAT: ${data.costs.otherCosts.vatRate}%)\n` +
                    `Revenue: ${formatCurrency(data.revenue.amount)} (VAT: ${data.revenue.vatRate}%)\n` +
                    `Total Costs: ${formatCurrency(results.totalCosts)}\n` +
                    `Total Revenue: ${formatCurrency(results.totalRevenue)}\n` +
                    `Break Even ROAS: ${formatNumber(results.breakEvenROAS)}\n` +
                    `Profit: ${formatCurrency(results.profit)}\n` +
                    `Profit Margin: ${formatNumber(results.profitMargin)}%`
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