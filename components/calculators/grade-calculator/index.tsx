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
import { GraduationCap, Plus, Minus, Calculator, Target, Trash2 } from "lucide-react";

interface Assignment {
  id: string;
  name: string;
  grade: string;
  weight: string;
  gradeType: 'letter' | 'percentage';
}

interface GradeCalculatorProps {
  t?: any;
  locale?: string;
}

// Grade conversion tables
const LETTER_TO_PERCENTAGE = {
  'A+': 98.5, 'A': 95, 'A-': 91.5,
  'B+': 88, 'B': 85, 'B-': 81.5,
  'C+': 78, 'C': 75, 'C-': 71.5,
  'D+': 68, 'D': 65, 'D-': 61.5,
  'F': 30
};

const LETTER_TO_GPA = {
  'A+': 4.3, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

export default function GradeCalculator({ t, locale = 'en' }: GradeCalculatorProps) {
  // Course Grade Calculator
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: '1', name: 'Assignment 1', grade: '', weight: '', gradeType: 'percentage' },
    { id: '2', name: 'Assignment 2', grade: '', weight: '', gradeType: 'percentage' },
    { id: '3', name: 'Exam 1', grade: '', weight: '', gradeType: 'percentage' }
  ]);
  const [finalGrade, setFinalGrade] = useState<{ percentage: number; letter: string; gpa: number } | null>(null);

  // Final Grade Calculator
  const [currentGrade, setCurrentGrade] = useState('');
  const [desiredGrade, setDesiredGrade] = useState('');
  const [finalWeight, setFinalWeight] = useState('');
  const [requiredFinalGrade, setRequiredFinalGrade] = useState<number | null>(null);

  // Convert letter grade to percentage
  const letterToPercentage = useCallback((letter: string): number => {
    return LETTER_TO_PERCENTAGE[letter as keyof typeof LETTER_TO_PERCENTAGE] || 0;
  }, []);

  // Convert percentage to letter grade
  const percentageToLetter = useCallback((percentage: number): string => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  }, []);

  // Convert percentage to GPA
  const percentageToGPA = useCallback((percentage: number): number => {
    const letter = percentageToLetter(percentage);
    return LETTER_TO_GPA[letter as keyof typeof LETTER_TO_GPA] || 0;
  }, [percentageToLetter]);

  // Get percentage from assignment
  const getAssignmentPercentage = useCallback((assignment: Assignment): number => {
    if (!assignment.grade) return 0;
    
    if (assignment.gradeType === 'letter') {
      return letterToPercentage(assignment.grade);
    } else {
      return parseFloat(assignment.grade) || 0;
    }
  }, [letterToPercentage]);

  // Add new assignment
  const addAssignment = useCallback(() => {
    const newId = (assignments.length + 1).toString();
    setAssignments(prev => [...prev, {
      id: newId,
      name: `Assignment ${newId}`,
      grade: '',
      weight: '',
      gradeType: 'percentage'
    }]);
  }, [assignments.length]);

  // Remove assignment
  const removeAssignment = useCallback((id: string) => {
    if (assignments.length > 1) {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }
  }, [assignments.length]);

  // Update assignment
  const updateAssignment = useCallback((id: string, field: keyof Assignment, value: string) => {
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  }, []);

  // Calculate course grade
  const calculateCourseGrade = useCallback(() => {
    const validAssignments = assignments.filter(a => a.grade && a.weight);
    
    if (validAssignments.length === 0) return;

    let totalWeightedPoints = 0;
    let totalWeight = 0;

    validAssignments.forEach(assignment => {
      const percentage = getAssignmentPercentage(assignment);
      const weight = parseFloat(assignment.weight) || 0;
      
      totalWeightedPoints += percentage * weight;
      totalWeight += weight;
    });

    if (totalWeight === 0) return;

    const averagePercentage = totalWeightedPoints / totalWeight;
    const letterGrade = percentageToLetter(averagePercentage);
    const gpa = percentageToGPA(averagePercentage);

    setFinalGrade({
      percentage: Math.round(averagePercentage * 100) / 100,
      letter: letterGrade,
      gpa: Math.round(gpa * 100) / 100
    });
  }, [assignments, getAssignmentPercentage, percentageToLetter, percentageToGPA]);

  // Calculate required final grade
  const calculateRequiredFinal = useCallback(() => {
    const current = parseFloat(currentGrade) || 0;
    const desired = parseFloat(desiredGrade) || 0;
    const finalWeightPercent = parseFloat(finalWeight) || 0;

    if (finalWeightPercent === 0 || finalWeightPercent > 100) return;

    const currentWeight = 100 - finalWeightPercent;
    const requiredFinal = (desired - (current * currentWeight / 100)) * (100 / finalWeightPercent);

    setRequiredFinalGrade(Math.round(requiredFinal * 100) / 100);
  }, [currentGrade, desiredGrade, finalWeight]);

  // Clear all data
  const clearAll = useCallback(() => {
    setAssignments([
      { id: '1', name: 'Assignment 1', grade: '', weight: '', gradeType: 'percentage' },
      { id: '2', name: 'Assignment 2', grade: '', weight: '', gradeType: 'percentage' },
      { id: '3', name: 'Exam 1', grade: '', weight: '', gradeType: 'percentage' }
    ]);
    setFinalGrade(null);
    setCurrentGrade('');
    setDesiredGrade('');
    setFinalWeight('');
    setRequiredFinalGrade(null);
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="course" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="course">{t?.tabs?.course || "Course Grade"}</TabsTrigger>
          <TabsTrigger value="final">{t?.tabs?.final || "Final Grade"}</TabsTrigger>
        </TabsList>

        {/* Course Grade Calculator */}
        <TabsContent value="course">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="size-5" />
                {t?.course?.title || "Course Grade Calculator"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">
                    {t?.course?.assignments || "Assignments & Exams"}
                  </Label>
                  <Button 
                    onClick={addAssignment}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="size-4" />
                    {t?.course?.addAssignment || "Add Assignment"}
                  </Button>
                </div>

                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 border rounded-lg">
                      <div className="md:col-span-2">
                        <Label className="text-sm text-muted-foreground">
                          {t?.course?.assignmentName || "Assignment Name"}
                        </Label>
                        <Input
                          value={assignment.name}
                          onChange={(e) => updateAssignment(assignment.id, 'name', e.target.value)}
                          placeholder="Assignment 1"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          {t?.course?.gradeType || "Grade Type"}
                        </Label>
                        <Select 
                          value={assignment.gradeType} 
                          onValueChange={(value: 'letter' | 'percentage') => 
                            updateAssignment(assignment.id, 'gradeType', value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="letter">Letter Grade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">
                          {t?.course?.grade || "Grade"}
                        </Label>
                        {assignment.gradeType === 'letter' ? (
                          <Select 
                            value={assignment.grade} 
                            onValueChange={(value) => updateAssignment(assignment.id, 'grade', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {GRADE_OPTIONS.map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type="number"
                            value={assignment.grade}
                            onChange={(e) => updateAssignment(assignment.id, 'grade', e.target.value)}
                            placeholder="85"
                            min="0"
                            max="100"
                            className="mt-1"
                          />
                        )}
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">
                          {t?.course?.weight || "Weight (%)"}
                        </Label>
                        <Input
                          type="number"
                          value={assignment.weight}
                          onChange={(e) => updateAssignment(assignment.id, 'weight', e.target.value)}
                          placeholder="25"
                          min="0"
                          max="100"
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          onClick={() => removeAssignment(assignment.id)}
                          variant="outline"
                          size="sm"
                          disabled={assignments.length <= 1}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={calculateCourseGrade} className="flex-1">
                  <Calculator className="size-4 mr-2" />
                  {t?.course?.calculate || "Calculate Grade"}
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  {t?.course?.clear || "Clear All"}
                </Button>
              </div>

              {finalGrade && (
                <div className="mt-6 p-6 bg-muted/50 rounded-lg">
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {t?.course?.finalGrade || "Final Course Grade"}
                    </div>
                    <div className="flex justify-center items-center gap-4 text-2xl font-bold">
                      <Badge variant="default" className="text-lg px-3 py-1">
                        {finalGrade.percentage}%
                      </Badge>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {finalGrade.letter}
                      </Badge>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        GPA: {finalGrade.gpa}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Grade Scale Reference */}
              <div className="mt-6 p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">{t?.course?.gradeScale || "Grade Scale Reference"}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
                  {Object.entries(LETTER_TO_GPA).map(([letter, gpa]) => (
                    <div key={letter} className="flex justify-between p-2 bg-muted/30 rounded">
                      <span className="font-medium">{letter}</span>
                      <span>{gpa}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final Grade Calculator */}
        <TabsContent value="final">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-5" />
                {t?.final?.title || "Final Exam Grade Calculator"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t?.final?.currentGrade || "Current Grade (%)"}</Label>
                  <Input
                    type="number"
                    value={currentGrade}
                    onChange={(e) => setCurrentGrade(e.target.value)}
                    placeholder="85"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t?.final?.desiredGrade || "Desired Grade (%)"}</Label>
                  <Input
                    type="number"
                    value={desiredGrade}
                    onChange={(e) => setDesiredGrade(e.target.value)}
                    placeholder="90"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t?.final?.finalWeight || "Final Exam Weight (%)"}</Label>
                  <Input
                    type="number"
                    value={finalWeight}
                    onChange={(e) => setFinalWeight(e.target.value)}
                    placeholder="30"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <Button onClick={calculateRequiredFinal} className="w-full">
                <Calculator className="size-4 mr-2" />
                {t?.final?.calculate || "Calculate Required Final Grade"}
              </Button>

              {requiredFinalGrade !== null && (
                <div className="mt-6 p-6 bg-muted/50 rounded-lg">
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {t?.final?.requiredGrade || "Required Final Exam Grade"}
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {requiredFinalGrade}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {requiredFinalGrade > 100 ? (
                        <span className="text-red-600">
                          {t?.final?.impossible || "This goal may not be achievable"}
                        </span>
                      ) : requiredFinalGrade < 0 ? (
                        <span className="text-green-600">
                          {t?.final?.alreadyAchieved || "You've already achieved your goal!"}
                        </span>
                      ) : (
                        <span>
                          {t?.final?.achievable || "This goal is achievable with effort!"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="mt-6 p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{t?.final?.tips?.title || "Tips"}</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• {t?.final?.tips?.tip1 || "Enter your current average grade in the course"}</li>
                  <li>• {t?.final?.tips?.tip2 || "Set your desired final grade for the course"}</li>
                  <li>• {t?.final?.tips?.tip3 || "Input how much the final exam is worth (as a percentage)"}</li>
                  <li>• {t?.final?.tips?.tip4 || "The calculator will show what you need on the final"}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}