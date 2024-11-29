import { createContext } from 'react';

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

interface FormContextProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const FormContext = createContext<FormContextProps | undefined>(
  undefined,
);
