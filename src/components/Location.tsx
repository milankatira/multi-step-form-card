import React, { useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormContext } from '@/provider/FormProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
    SelectGroup,
} from '@/components/ui/select';
import clsx from 'clsx';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchCountries } from '@/services/fetchCountry';
import { fetchCities } from '@/services/fetchCities';

// Define the validation schema using zod
const locationSchema = z.object({
    country: z.string().nonempty({ message: 'Country is required.' }),
    city: z.string().nonempty({ message: 'City is required.' }),
});

type LocationInputs = z.infer<typeof locationSchema>;


const Location: React.FC = () => {
    const { toast } = useToast();
    const { formData, setFormData } = useContext(FormContext)!;
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
    } = useForm<LocationInputs>({
        resolver: zodResolver(locationSchema),
        defaultValues: formData.location,
    });

    const selectedCountry = watch('country');

    const {
        data: countries,
        isLoading: countriesLoading,
        isError: countriesError,
    } = useQuery({
        queryKey: ['countries'],
        queryFn: fetchCountries,
    });

    const {
        data: cities,
        isLoading: citiesLoading,
        isError: citiesError,
    } = useQuery({
        retry: 1,
        queryKey: ['cities', selectedCountry],
        queryFn: () => fetchCities(selectedCountry),
        enabled: !!selectedCountry,
        throwOnError: false,
    });

    const onSubmit = (data: LocationInputs) => {
        setFormData((prev) => ({
            ...prev,
            location: data,
        }));
        navigate('/payment');
        toast({
            title: 'Form Submitted',
            description: 'Location information saved!',
        });
    };

    useEffect(() => {
        const firstSelect = document.querySelector(
            '.select-trigger',
        ) as HTMLElement;
        firstSelect?.focus();
    }, []);

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Location Information</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        Country<span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setValue('city', '');
                                }}
                                value={field.value}
                                disabled={countriesLoading || countriesError || !countries}
                            >
                                <SelectTrigger
                                    className={clsx(
                                        errors.country ? 'border-red-500' : 'border-input',
                                        'select-trigger',
                                    )}
                                >
                                    {countriesLoading
                                        ? 'Loading...'
                                        : field.value
                                            //@ts-ignore
                                            ? countries?.find((c) => c.code === field.value)?.name
                                            : 'Select a country'}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectScrollUpButton />
                                    <SelectGroup>
                                        {countries &&
                                            countries
                                                //@ts-ignore
                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                //@ts-ignore
                                                .map((country) => (
                                                    <SelectItem key={country.code} value={country.code}>
                                                        {country.name}
                                                    </SelectItem>
                                                ))}
                                    </SelectGroup>
                                    <SelectSeparator />
                                    <SelectScrollDownButton />
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {countriesError && (
                        <p className="text-red-500 text-sm mt-1">
                            Failed to load countries.
                        </p>
                    )}
                    {errors.country && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.country.message}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        City<span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => field.onChange(value)}
                                value={field.value}
                                disabled={
                                    !selectedCountry ||
                                    citiesLoading ||
                                    citiesError ||
                                    !cities
                                }
                            >
                                <SelectTrigger
                                    className={clsx(
                                        errors.city ? 'border-red-500' : 'border-input',
                                    )}
                                >
                                    {citiesLoading
                                        ? 'Loading...'
                                        : field.value
                                            ? field.value
                                            : 'Select a city'}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectScrollUpButton />
                                    <SelectGroup>
                                        {cities &&
                                            cities?.length > 0 &&
                                            cities
                                                //@ts-ignore
                                                ?.sort((a, b) => a.localeCompare(b))
                                                //@ts-ignore
                                                ?.map((city, idx) => (
                                                    <SelectItem key={idx} value={city}>
                                                        {city}
                                                    </SelectItem>
                                                ))}
                                    </SelectGroup>
                                    <SelectSeparator />
                                    <SelectScrollDownButton />
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {citiesError && (
                        <p className="text-red-500 text-sm mt-1">
                            Failed to load cities.
                        </p>
                    )}
                    {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                </div>

                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                    <Button type="submit" variant="default">
                        Next
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Location;
