import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormContext } from '@/provider/FormProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const personalInfoSchema = z.object({
    firstName: z.string().nonempty({ message: 'First Name is required.' }),
    lastName: z.string().nonempty({ message: 'Last Name is required.' }),
    email: z.string().email({ message: 'Invalid email format.' }),
    phone: z
        .string()
        .optional()
        .refine((val) => !val || /^(\+\d{1,3}[- ]?)?\d{10}$/.test(val), {
            message: 'Phone number is not valid.',
        }),
});

type PersonalInfoInputs = z.infer<typeof personalInfoSchema>;

const PersonalInfo: React.FC = () => {
    const { toast } = useToast();
    const { formData, setFormData } = useContext(FormContext)!;
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PersonalInfoInputs>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: formData.personal,
    });

    const onSubmit = (data: PersonalInfoInputs) => {
        setFormData((prev) => ({
            ...prev,
            personal: data,
        }));
        navigate('/location');
        toast({
            title: 'Form Submitted',
            description: 'Personal information saved!',
        });
    };

    useEffect(() => {
        const firstInput = document.querySelector(
            'input[name="firstName"]',
        ) as HTMLInputElement;
        firstInput?.focus();
    }, []);

    return (

        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-4">
                    <label className="block mb-1">
                        First Name<span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        {...register('firstName')}
                        placeholder="John"
                        error={errors.firstName?.message}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">
                        Last Name<span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        {...register('lastName')}
                        placeholder="Doe"
                        error={errors.lastName?.message}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">
                        Email<span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="email"
                        {...register('email')}
                        placeholder="john.doe@example.com"
                        error={errors.email?.message}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Phone Number (Optional)</label>
                    <Input
                        type="tel"
                        {...register('phone')}
                        placeholder="+1234567890"
                        error={errors.phone?.message}
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" variant="default">
                        Next
                    </Button>
                </div>
            </form>
        </div>

    );
};

export default PersonalInfo;
