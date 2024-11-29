import React, { useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PersonalInfo from './PersonalInfo';
import Location from './Location';
import PaymentInfo from './PaymentInfo';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FormContext } from '@/provider/FormProvider';

const Summary: React.FC = () => {
  const { toast } = useToast();
  const { formData } = useContext(FormContext)!;
  const navigate = useNavigate();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleCloseEdit = () => {
    setEditingSection(null);
  };

  const handleSubmit = () => {
    toast({
      title: 'Form Submitted',
      description: 'Your information has been successfully submitted!',
    });
    console.log(formData);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Summary</h2>

      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-xl font-medium">Personal Information</h3>
          <Button variant='default' onClick={() => handleEdit('personal')}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {editingSection !== 'personal' ? (
            <div>
              <p>
                <strong>First Name:</strong> {formData.personal.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {formData.personal.lastName}
              </p>
              <p>
                <strong>Email:</strong> {formData.personal.email}
              </p>
              <p>
                <strong>Phone:</strong> {formData.personal.phone || 'N/A'}
              </p>
            </div>
          ) : (
            <div>
              <PersonalInfo />
              <div className="flex justify-end mt-2">
                <Button variant="secondary" onClick={handleCloseEdit}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-xl font-medium">Location Information</h3>
          <Button variant='default' onClick={() => handleEdit('location')}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {editingSection !== 'location' ? (
            <div>
              <p>
                <strong>Country:</strong> {formData.location.country}
              </p>
              <p>
                <strong>City:</strong> {formData.location.city}
              </p>
            </div>
          ) : (
            <div>
              <Location />
              <div className="flex justify-end mt-2">
                <Button variant="secondary" onClick={handleCloseEdit}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-xl font-medium">Payment Information</h3>
          <Button variant='default' onClick={() => handleEdit('payment')}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {editingSection !== 'payment' ? (
            <div>
              <p>
                <strong>Credit Card Number:</strong> **** **** ****{' '}
                {formData.payment.cardNumber.slice(-4)}
              </p>
              <p>
                <strong>Expiry Date:</strong> {formData.payment.expiryDate}
              </p>
              <p>
                <strong>CVV:</strong> ***
              </p>
              <p>
                <strong>Billing Address:</strong>{' '}
                {formData.payment.billingAddress || 'Same as shipping'}
              </p>
            </div>
          ) : (
            <div>
              <PaymentInfo />
              <div className="flex justify-end mt-2">
                <Button variant="secondary" onClick={handleCloseEdit}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="default" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Summary;
