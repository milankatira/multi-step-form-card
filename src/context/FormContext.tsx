import React, { useState, useEffect, ReactNode } from 'react';
import { FormContext } from '@/provider/FormProvider';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface LocationInfo {
  country: string;
  city: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress?: string;
}

interface FormData {
  personal: PersonalInfo;
  location: LocationInfo;
  payment: PaymentInfo;
}

interface Props {
  children: ReactNode;
}

const defaultFormData: FormData = {
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  location: {
    country: '',
    city: '',
  },
  payment: {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
  },
};

export const FormProvider: React.FC<Props> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : defaultFormData;
  });

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
