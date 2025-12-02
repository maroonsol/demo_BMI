'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { HealthData } from '@/lib/pdf-generator';
import { Loader2 } from 'lucide-react';

type HealthFormValues = {
  name: string;
  date: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  phone: string;
  email: string;
  weight: number;
  bodyFat: number;
  visceralFat: number;
  bmr: number;
  bmi: number;
  bodyAge: number;
  subcutaneousFat: number;
  skeletalMuscle: number;
};

type FormErrors = Partial<Record<keyof HealthFormValues, string>>;

export default function HealthForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<HealthFormValues>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    age: 0,
    gender: 'male',
    height: 0,
    phone: '',
    email: '',
    weight: 0,
    bodyFat: 0,
    visceralFat: 0,
    bmr: 0,
    bmi: 0,
    bodyAge: 0,
    subcutaneousFat: 0,
    skeletalMuscle: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.age || formData.age < 1 || formData.age > 150) {
      newErrors.age = 'Age must be between 1 and 150';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    if (!formData.height || formData.height < 50 || formData.height > 300) {
      newErrors.height = 'Height must be between 50 and 300 cm';
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.weight || formData.weight < 10 || formData.weight > 500) {
      newErrors.weight = 'Weight must be between 10 and 500 kg';
    }
    if (formData.bodyFat < 0 || formData.bodyFat > 100) {
      newErrors.bodyFat = 'Body fat must be between 0 and 100%';
    }
    if (formData.visceralFat < 0) {
      newErrors.visceralFat = 'Visceral fat must be at least 0';
    }
    if (!formData.bmr || formData.bmr < 500 || formData.bmr > 5000) {
      newErrors.bmr = 'BMR must be between 500 and 5000';
    }
    if (!formData.bmi || formData.bmi < 10 || formData.bmi > 60) {
      newErrors.bmi = 'BMI must be between 10 and 60';
    }
    if (!formData.bodyAge || formData.bodyAge < 1 || formData.bodyAge > 150) {
      newErrors.bodyAge = 'Body age must be between 1 and 150';
    }
    if (formData.subcutaneousFat < 0 || formData.subcutaneousFat > 100) {
      newErrors.subcutaneousFat = 'Subcutaneous fat must be between 0 and 100%';
    }
    if (formData.skeletalMuscle < 0 || formData.skeletalMuscle > 100) {
      newErrors.skeletalMuscle = 'Skeletal muscle must be between 0 and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof HealthFormValues, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);
    try {
      const healthData: HealthData = {
        name: formData.name,
        date: new Date(formData.date).toLocaleDateString('en-US', {
          year: 'numeric',
        month: 'long',
          day: 'numeric',
        }),
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        phone: formData.phone,
        email: formData.email,
        weight: formData.weight,
        bodyFat: formData.bodyFat,
        visceralFat: formData.visceralFat,
        bmr: formData.bmr,
        bmi: formData.bmi,
        bodyAge: formData.bodyAge,
        subcutaneousFat: formData.subcutaneousFat,
        skeletalMuscle: formData.skeletalMuscle,
      };

      // Generate PDF via API route
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(healthData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob and download it
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Health_Report_${healthData.name.replace(/\s+/g, '_')}_${healthData.date.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Health Assessment Form</CardTitle>
          <CardDescription>
            Please fill in all the required information to generate your health assessment report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-destructive text-sm">{errors.name}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
                {errors.date && (
                  <p className="text-destructive text-sm">{errors.date}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => handleChange('age', e.target.value ? parseFloat(e.target.value) : 0)}
                  placeholder="Enter your age"
                />
                {errors.age && (
                  <p className="text-destructive text-sm">{errors.age}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value as 'male' | 'female')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-destructive text-sm">{errors.gender}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.height || ''}
                  onChange={(e) => handleChange('height', e.target.value ? parseFloat(e.target.value) : 0)}
                  placeholder="Enter height in cm"
                />
                {errors.height && (
                  <p className="text-destructive text-sm">{errors.height}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight || ''}
                  onChange={(e) => handleChange('weight', e.target.value ? parseFloat(e.target.value) : 0)}
                  placeholder="Enter weight in kg"
                />
                {errors.weight && (
                  <p className="text-destructive text-sm">{errors.weight}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-destructive text-sm">{errors.phone}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email ID *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bmi">BMI (Body Mass Index) *</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={formData.bmi || ''}
                  onChange={(e) => handleChange('bmi', e.target.value ? parseFloat(e.target.value) : 0)}
                  placeholder="Enter BMI"
                />
                {errors.bmi && (
                  <p className="text-destructive text-sm">{errors.bmi}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bodyFat">Body Fat (%) *</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={formData.bodyFat || ''}
                  onChange={(e) => handleChange('bodyFat', e.target.value ? parseFloat(e.target.value) : 0)}
                  placeholder="Enter body fat percentage"
                />
                {errors.bodyFat && (
                  <p className="text-destructive text-sm">{errors.bodyFat}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="visceralFat">Visceral Fat *</Label>
                <Input
                  id="visceralFat"
                  type="number"
                  step="0.1"
                  value={formData.visceralFat || ''}
                  onChange={(e) => handleChange('visceralFat', e.target.value ? parseFloat(e.target.value) : 0)}
                  placeholder="Enter visceral fat level"
                />
                {errors.visceralFat && (
                  <p className="text-destructive text-sm">{errors.visceralFat}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subcutaneousFat">Subcutaneous Fat (%) *</Label>
                <Input
                  id="subcutaneousFat"
                  type="number"
                  step="0.1"
                  value={formData.subcutaneousFat || ''}
                  onChange={(e) => handleChange('subcutaneousFat', e.target.value ? parseFloat(e.target.value) : 0)}
                  placeholder="Enter subcutaneous fat percentage"
                />
                {errors.subcutaneousFat && (
                  <p className="text-destructive text-sm">{errors.subcutaneousFat}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="skeletalMuscle">Skeletal Muscle (%) *</Label>
                <Input
                  id="skeletalMuscle"
                  type="number"
                  step="0.1"
                  value={formData.skeletalMuscle || ''}
                  onChange={(e) => handleChange('skeletalMuscle', e.target.value ? parseFloat(e.target.value) : 0)}
                  placeholder="Enter skeletal muscle percentage"
                />
                {errors.skeletalMuscle && (
                  <p className="text-destructive text-sm">{errors.skeletalMuscle}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bmr">BMR (Basal Metabolic Rate) *</Label>
                <Input
                  id="bmr"
                  type="number"
                  step="0.1"
                  value={formData.bmr || ''}
                  onChange={(e) => handleChange('bmr', e.target.value ? parseFloat(e.target.value) : 0)}
                  placeholder="Enter BMR in kcal/day"
                />
                {errors.bmr && (
                  <p className="text-destructive text-sm">{errors.bmr}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bodyAge">Body Age *</Label>
                <Input
                  id="bodyAge"
                  type="number"
                  value={formData.bodyAge || ''}
                  onChange={(e) => handleChange('bodyAge', e.target.value ? parseFloat(e.target.value) : 0)}
                  placeholder="Enter body age"
                />
                {errors.bodyAge && (
                  <p className="text-destructive text-sm">{errors.bodyAge}</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                disabled={isGenerating}
                className="min-w-[200px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Generating PDF...
                  </>
                ) : (
                  'Generate Health Report PDF'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
