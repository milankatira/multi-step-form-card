import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PersonalInfo from '@/components/PersonalInfo';
import Location from '@/components/Location';
import PaymentInfo from '@/components/PaymentInfo';
import Summary from '@/components/Summary';

import { FormProvider } from './context/FormContext';

const App: React.FC = () => {
  return (
    <FormProvider>
      <div className="container mx-auto px-4">
        <main className='h-screen w-screen flex justify-center items-center'>
          <Routes>
            <Route path="/" element={<PersonalInfo />} />
            <Route path="/location" element={<Location />} />
            <Route path="/payment" element={<PaymentInfo />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </main>
      </div>
    </FormProvider>
  );
};

export default App;
