'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generatePDFReport, type HealthData } from '@/lib/pdf-generator';

const healthFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().min(1, 'Date is required'),
  age: z.number().min(1, 'Age must be at least 1').max(150, 'Age must be less than 150'),
  gender: z.enum(['male', 'female'], {
    message: 'Please select a gender',
  }),
  height: z.number().min(50, 'Height must be at least 50 cm').max(300, 'Height must be less than 300 cm'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  weight: z.number().min(10, 'Weight must be at least 10 kg').max(500, 'Weight must be less than 500 kg'),
  bodyFat: z.number().min(0, 'Body fat must be at least 0%').max(100, 'Body fat cannot exceed 100%'),
  visceralFat: z.number().min(0, 'Visceral fat must be at least 0'),
  bmr: z.number().min(500, 'BMR must be at least 500').max(5000, 'BMR must be less than 5000'),
  bmi: z.number().min(10, 'BMI must be at least 10').max(60, 'BMI must be less than 60'),
  bodyAge: z.number().min(1, 'Body age must be at least 1').max(150, 'Body age must be less than 150'),
  subcutaneousFat: z.number().min(0, 'Subcutaneous fat must be at least 0%').max(100, 'Subcutaneous fat cannot exceed 100%'),
  skeletalMuscle: z.number().min(0, 'Skeletal muscle must be at least 0%').max(100, 'Skeletal muscle cannot exceed 100%'),
});

type HealthFormValues = z.infer<typeof healthFormSchema>;

export function HealthForm() {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<HealthFormValues>({
    resolver: zodResolver(healthFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      gender: 'male',
    },
  });

  const onSubmit = async (data: HealthFormValues) => {
    setIsGenerating(true);
    try {
      const healthData: HealthData = {
        name: data.name,
        date: new Date(data.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        age: data.age,
        gender: data.gender,
        height: data.height,
        phone: data.phone,
        email: data.email,
        weight: data.weight,
        bodyFat: data.bodyFat,
        visceralFat: data.visceralFat,
        bmr: data.bmr,
        bmi: data.bmi,
        bodyAge: data.bodyAge,
        subcutaneousFat: data.subcutaneousFat,
        skeletalMuscle: data.skeletalMuscle,
      };

      // Generate PDF via API route
      await generatePDFReport(healthData);
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
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel htmlFor="name">Name *</FormLabel>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Enter your full name"
                />
                {form.formState.errors.name && (
                  <FormMessage>{form.formState.errors.name.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="date">Date *</FormLabel>
                <Input
                  id="date"
                  type="date"
                  {...form.register('date')}
                />
                {form.formState.errors.date && (
                  <FormMessage>{form.formState.errors.date.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="age">Age *</FormLabel>
                <Input
                  id="age"
                  type="number"
                  {...form.register('age', { valueAsNumber: true })}
                  placeholder="Enter your age"
                />
                {form.formState.errors.age && (
                  <FormMessage>{form.formState.errors.age.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="gender">Gender *</FormLabel>
                <Select
                  id="gender"
                  {...form.register('gender')}
                  value={form.watch('gender')}
                  onChange={(e) => form.setValue('gender', e.target.value as 'male' | 'female')}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
                {form.formState.errors.gender && (
                  <FormMessage>{form.formState.errors.gender.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="height">Height (cm) *</FormLabel>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  {...form.register('height', { valueAsNumber: true })}
                  placeholder="Enter height in cm"
                />
                {form.formState.errors.height && (
                  <FormMessage>{form.formState.errors.height.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="weight">Weight (kg) *</FormLabel>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  {...form.register('weight', { valueAsNumber: true })}
                  placeholder="Enter weight in kg"
                />
                {form.formState.errors.weight && (
                  <FormMessage>{form.formState.errors.weight.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="phone">Phone Number *</FormLabel>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register('phone')}
                  placeholder="Enter your phone number"
                />
                {form.formState.errors.phone && (
                  <FormMessage>{form.formState.errors.phone.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="email">Email ID *</FormLabel>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="Enter your email address"
                />
                {form.formState.errors.email && (
                  <FormMessage>{form.formState.errors.email.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="bmi">BMI (Body Mass Index) *</FormLabel>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  {...form.register('bmi', { valueAsNumber: true })}
                  placeholder="Enter BMI"
                />
                {form.formState.errors.bmi && (
                  <FormMessage>{form.formState.errors.bmi.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="bodyFat">Body Fat (%) *</FormLabel>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  {...form.register('bodyFat', { valueAsNumber: true })}
                  placeholder="Enter body fat percentage"
                />
                {form.formState.errors.bodyFat && (
                  <FormMessage>{form.formState.errors.bodyFat.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="visceralFat">Visceral Fat *</FormLabel>
                <Input
                  id="visceralFat"
                  type="number"
                  step="0.1"
                  {...form.register('visceralFat', { valueAsNumber: true })}
                  placeholder="Enter visceral fat level"
                />
                {form.formState.errors.visceralFat && (
                  <FormMessage>{form.formState.errors.visceralFat.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="subcutaneousFat">Subcutaneous Fat (%) *</FormLabel>
                <Input
                  id="subcutaneousFat"
                  type="number"
                  step="0.1"
                  {...form.register('subcutaneousFat', { valueAsNumber: true })}
                  placeholder="Enter subcutaneous fat percentage"
                />
                {form.formState.errors.subcutaneousFat && (
                  <FormMessage>{form.formState.errors.subcutaneousFat.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="skeletalMuscle">Skeletal Muscle (%) *</FormLabel>
                <Input
                  id="skeletalMuscle"
                  type="number"
                  step="0.1"
                  {...form.register('skeletalMuscle', { valueAsNumber: true })}
                  placeholder="Enter skeletal muscle percentage"
                />
                {form.formState.errors.skeletalMuscle && (
                  <FormMessage>{form.formState.errors.skeletalMuscle.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="bmr">BMR (Basal Metabolic Rate) *</FormLabel>
                <Input
                  id="bmr"
                  type="number"
                  step="0.1"
                  {...form.register('bmr', { valueAsNumber: true })}
                  placeholder="Enter BMR in kcal/day"
                />
                {form.formState.errors.bmr && (
                  <FormMessage>{form.formState.errors.bmr.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="bodyAge">Body Age *</FormLabel>
                <Input
                  id="bodyAge"
                  type="number"
                  {...form.register('bodyAge', { valueAsNumber: true })}
                  placeholder="Enter body age"
                />
                {form.formState.errors.bodyAge && (
                  <FormMessage>{form.formState.errors.bodyAge.message}</FormMessage>
                )}
              </FormItem>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                disabled={isGenerating}
                className="min-w-[200px]"
              >
                {isGenerating ? 'Generating PDF...' : 'Generate Health Report PDF'}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

