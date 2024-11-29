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

const locationSchema = z.object({
  country: z.string().nonempty({ message: 'Country is required.' }),
  city: z.string().nonempty({ message: 'City is required.' }),
});

type LocationInputs = z.infer<typeof locationSchema>;

const mockCountries = ['USA', 'Canada', 'United Kingdom'];

const mockCities: { [key: string]: string[] } = {
  USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
  Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'],
};

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
        {/* Country Selection */}
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
                disabled={mockCountries.length === 0}
              >
                <SelectTrigger
                  className={clsx(
                    errors.country ? 'border-red-500' : 'border-input',
                    'select-trigger',
                  )}
                >
                </SelectTrigger>
                <SelectContent>
                  <SelectScrollUpButton />
                  <SelectGroup>
                    {mockCountries.map((country, idx) => (
                      <SelectItem key={idx} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectScrollDownButton />
                </SelectContent>
              </Select>
            )}
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">
              {errors.country.message}
            </p>
          )}
        </div>

        {/* City Selection */}
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
                  !mockCities[selectedCountry] ||
                  mockCities[selectedCountry].length === 0
                }
              >
                <SelectTrigger
                  className={clsx(
                    errors.city ? 'border-red-500' : 'border-input',
                  )}
                >
                  {/* No need to add <Select.Value> or <Select.Icon> here */}
                </SelectTrigger>
                <SelectContent>
                  <SelectScrollUpButton />
                  <SelectGroup>
                    {selectedCountry &&
                      mockCities[selectedCountry].map((city, idx) => (
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
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* Navigation Buttons */}
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
