import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
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
    .regex(/^[0-9]{16}$/, { message: 'Credit Card Number must be 16 digits.' })
    .nonempty({ message: 'Credit Card Number is required.' }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, {
      message: 'Expiry Date must be in MM/YY format.',
    })
    .nonempty({ message: 'Expiry Date is required.' }),
  cvv: z
    .string()
    .regex(/^[0-9]{3,4}$/, { message: 'CVV must be 3 or 4 digits.' })
    .nonempty({ message: 'CVV is required.' }),
  billingAddress: z.string().optional(),
});

type PaymentInfoInputs = z.infer<typeof paymentInfoSchema>;

const PaymentInfo: React.FC = () => {
  const { toast } = useToast();
  const { formData, setFormData } = useContext(FormContext)!;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentInfoInputs>({
    resolver: zodResolver(paymentInfoSchema),
    defaultValues: formData.payment,
  });

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
        <div className="mb-4">
          <label className="block mb-1">
            Credit Card Number<span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            {...register('cardNumber')}
            placeholder="1234567812345678"
            error={errors.cardNumber?.message}
            maxLength={16}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">
            Expiry Date (MM/YY)<span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            {...register('expiryDate')}
            placeholder="MM/YY"
            error={errors.expiryDate?.message}
            maxLength={5}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">
            CVV<span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            {...register('cvv')}
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
            {...register('billingAddress')}
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
