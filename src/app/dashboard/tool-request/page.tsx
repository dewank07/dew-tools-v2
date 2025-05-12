"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  requirement: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  requirement?: string;
}

export default function ToolRequestPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    requirement: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.requirement || formData.requirement.length < 10) {
      newErrors.requirement = "Requirement must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your backend
      console.log(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Request submitted successfully!", {
        description: "We'll review your tool request and get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        requirement: "",
      });
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: unknown) {
      toast.error("Something went wrong.", {
        description: "Your request couldn't be submitted. Please try again.",
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto py-6 sm:py-10 px-4 sm:px-6'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-8'>Request to Add New Tool</h1>

        <form onSubmit={handleSubmit} className='space-y-6 sm:space-y-8'>
          <div className='space-y-2'>
            <label htmlFor='name' className='text-sm font-medium'>
              Name
            </label>
            <Input
              id='name'
              name='name'
              placeholder='Your name'
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
          </div>

          <div className='space-y-2'>
            <label htmlFor='email' className='text-sm font-medium'>
              Email
            </label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='your.email@example.com'
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className='text-sm text-red-500'>{errors.email}</p>}
          </div>

          <div className='space-y-2'>
            <label htmlFor='requirement' className='text-sm font-medium'>
              Requirement
            </label>
            <Textarea
              id='requirement'
              name='requirement'
              placeholder="Describe the tool you'd like to see added..."
              className={`min-h-[120px] sm:min-h-[150px] ${errors.requirement ? "border-red-500" : ""}`}
              value={formData.requirement}
              onChange={handleChange}
            />
            <p className='text-sm text-gray-500'>
              Please provide detailed information about the tool functionality you&apos;re requesting.
            </p>
            {errors.requirement && <p className='text-sm text-red-500'>{errors.requirement}</p>}
          </div>

          <Button type='submit' disabled={isSubmitting} className='w-full sm:w-auto'>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}
