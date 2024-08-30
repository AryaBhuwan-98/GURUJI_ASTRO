import React, { useState, useEffect } from 'react';
import PersonalInfo from './PersonalInfo';
import AddressInfo from './AddressInfo';
import Confirmation from './Confirmation';
import './App.css';

const App = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : {
      name: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
    };
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
     console.log(savedData)
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateStep = () => {
    let stepErrors = {};
    switch (step) {
      case 1:
        if (!formData.name) stepErrors.name = 'Name is required';
        if (!formData.email) stepErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) stepErrors.email = 'Email is invalid';
        if (!formData.phone) stepErrors.phone = 'Phone is required';
        break;
      case 2:
        if (!formData.addressLine1) stepErrors.addressLine1 = 'Address Line 1 is required';
        if (!formData.city) stepErrors.city = 'City is required';
        if (!formData.state) stepErrors.state = 'State is required';
        if (!formData.zipCode) stepErrors.zipCode = 'Zip Code is required';
        break;
      default:
        break;
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
     
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfo
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <AddressInfo
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />
        );
      case 3:
        return <Confirmation formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <h1>Multi-Step Form</h1>
      <div className="form-container">
        {isSubmitted ? (
          <div className="success-message">
            <h2>Submitted Successfully!</h2>
            <p>Your form has been submitted.</p>
          </div>
        ) : (
          <>
            <div className="tab-navigation">
              <button className={step === 1 ? 'active' : ''} onClick={() => setStep(1)} disabled={step < 1}>
                Personal Info
              </button>
              <button className={step === 2 ? 'active' : ''} onClick={() => setStep(2)} disabled={step < 2}>
                Address Info
              </button>
              <button className={step === 3 ? 'active' : ''} onClick={() => setStep(3)} disabled={step < 3}>
                Confirmation
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {renderStep()}
              <div className="navigation-buttons">
                {step > 1 && (
                  <button type="button" onClick={handleBack}>
                    Back
                  </button>
                )}
                {step < 3 && (
                  <button type="button" onClick={handleNext}>
                    Next
                  </button>
                )}
                {step === 3 && (
                  <button type="submit">
                    Submit
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
   
};

export default App;