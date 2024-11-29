import React, { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormContext } from '@/provider/FormProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const paymentInfoSchema = z.object({
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\s+/g, ''))
    .refine((value) => /^[0-9]{16}$/.test(value), {
      message: 'Credit Card Number must be 16 digits.',
    }),
  expiryDate: z
    .string()
    .transform((value) => value.replace(/\//g, ''))
    .refine((value) => /^(0[1-9]|1[0-2])[0-9]{2}$/.test(value), {
      message: 'Expiry Date must be in MM/YY format.',
    }),
  cvv: z.string().refine((value) => /^[0-9]{3,4}$/.test(value), {
    message: 'CVV must be 3 or 4 digits.',
  }),
  billingAddress: z.string().optional(),
});

type PaymentInfoInputs = z.infer<typeof paymentInfoSchema>;

const PaymentInfo: React.FC = () => {
  const { toast } = useToast();
  const { formData, setFormData } = useContext(FormContext)!;
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentInfoInputs>({
    resolver: zodResolver(paymentInfoSchema),
    defaultValues: formData.payment,
  });

  // Format credit card number as XXXX XXXX XXXX XXXX
  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, ''); // Remove non-digit characters
    return digits.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space after every 4 digits
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string): string => {
    const digits = value.replace(/\D/g, ''); // Remove non-digit characters
    return digits
      .replace(/^(\d{2})(\d{1,2})?$/, (_, m, y) => (y ? `${m}/${y}` : m)) // Add slash after MM
      .slice(0, 5); // Limit to 5 characters
  };

  const onSubmit = (data: PaymentInfoInputs) => {
    setFormData((prev) => ({
      ...prev,
      payment: data,
    }));
    navigate('/summary');
    toast({
      title: 'Form Submitted',
      description: 'Payment information saved!',
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Credit Card Number Field */}
        <div className="mb-4">
          <label className="block mb-1">
            Credit Card Number<span className="text-red-500">*</span>
          </label>
          <Controller
            name="cardNumber"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                value={formatCardNumber(field.value)}
                onChange={(e) =>
                  field.onChange(formatCardNumber(e.target.value))
                }
                placeholder="1234 5678 1234 5678"
                error={errors.cardNumber?.message}
                maxLength={19} // 16 digits + 3 spaces
              />
            )}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">
            Expiry Date (MM/YY)<span className="text-red-500">*</span>
          </label>
          <Controller
            name="expiryDate"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                value={formatExpiryDate(field.value)}
                onChange={(e) =>
                  field.onChange(formatExpiryDate(e.target.value))
                }
                placeholder="MM/YY"
                error={errors.expiryDate?.message}
                maxLength={5}
              />
            )}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">
            CVV<span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            {...control.register('cvv')}
            placeholder="123"
            error={errors.cvv?.message}
            maxLength={4}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">
            Billing Address (if different from shipping)
          </label>
          <Input
            type="text"
            {...control.register('billingAddress')}
            placeholder="1234 Main St, City, State"
            error={errors.billingAddress?.message}
          />
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

export default PaymentInfo;
