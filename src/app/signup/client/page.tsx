"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useState } from "react";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    extensionName: "",
    contactNumber: "",
    birthdate: "",
    sex: "",
    homeAddress: "",
    province: "",
    city: "",
    barangay: "",
    zipCode: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'zipCode') {
      // Only allow numeric input and limit to 4 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 4);
      setFormData(prevData => ({
        ...prevData,
        [name]: numericValue,
      }));
    } else if (name === 'contactNumber') {
      // Only allow numeric input and limit to 11 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prevData => ({
        ...prevData,
        [name]: numericValue,
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateZipCode = (zipCode: string): boolean => {
    return /^\d{4}$/.test(zipCode);
  };

  const validateContactNumber = (contactNumber: string): boolean => {
    return /^\d{11}$/.test(contactNumber);
  };

  const validateForm = () => {
    for (const [key, value] of Object.entries(formData)) {
      if (!value && (key !== "middleName" && key !== "extensionName")) {
        alert(`Please fill out the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
        return false;
      }
    }
    
    if (!validateZipCode(formData.zipCode)) {
      alert("Please enter a valid 4-digit zip code.");
      return false;
    }
    
    if (!validateContactNumber(formData.contactNumber)) {
      alert("Please enter a valid 11-digit contact number.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      if (user) {
        // Save user details in Firestore
        await setDoc(doc(db, "clients", user.uid), {
          lastName: formData.lastName,
          firstName: formData.firstName,
          middleName: formData.middleName,
          extensionName: formData.extensionName,
          contactNumber: formData.contactNumber,
          birthdate: formData.birthdate,
          sex: formData.sex,
          homeAddress: formData.homeAddress,
          province: formData.province,
          city: formData.city,
          barangay: formData.barangay,
          zipCode: formData.zipCode,
          email: formData.email,
          verified: true
        });

        alert("Signup successful");
        // Redirect or clear form after successful signup
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error signing up: ", error);
      alert("Error signing up: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-8 bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Signup</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Personal Details */}
          <div className="col-span-2 text-lg font-semibold">Personal Details</div>
          <div className="form-control">
            <label className="label text-sm">Last Name *</label>
            <input
              type="text"
              name="lastName"
              className="input input-bordered input-sm"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label text-sm">First Name *</label>
            <input
              type="text"
              name="firstName"
              className="input input-bordered input-sm"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label text-sm">Middle Name</label>
            <input
              type="text"
              name="middleName"
              className="input input-bordered input-sm"
              value={formData.middleName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control">
            <label className="label text-sm">Extension Name</label>
            <input
              type="text"
              name="extensionName"
              className="input input-bordered input-sm"
              value={formData.extensionName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control">
            <label className="label text-sm">Contact Number *</label>
            <input
              type="tel"
              name="contactNumber"
              className="input input-bordered input-sm"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
              maxLength={11}
              pattern="\d{11}"
              title="Please enter an 11-digit contact number"
            />
          </div>
          <div className="form-control">
            <label className="label text-sm">Birthdate *</label>
            <input
              type="date"
              name="birthdate"
              className="input input-bordered input-sm"
              value={formData.birthdate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label text-sm">Sex *</label>
            <select
              name="sex"
              className="input input-bordered input-sm"
              value={formData.sex}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-control col-span-2">
            <label className="label text-sm">Home Address *</label>
            <input
              type="text"
              name="homeAddress"
              className="input input-bordered input-sm"
              value={formData.homeAddress}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label text-sm">Province *</label>
            <input
              type="text"
              name="province"
              className="input input-bordered input-sm"
              value={formData.province}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label text-sm">City *</label>
            <input
              type="text"
              name="city"
              className="input input-bordered input-sm"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label text-sm">Barangay *</label>
            <input
              type="text"
              name="barangay"
              className="input input-bordered input-sm"
              value={formData.barangay}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label text-sm">Zip Code *</label>
            <input
              type="text"
              name="zipCode"
              className="input input-bordered input-sm"
              value={formData.zipCode}
              onChange={handleInputChange}
              required
              maxLength={4}
              pattern="\d{4}"
              title="Please enter a 4-digit zip code"
            />
          </div>
          <div className="form-control col-span-2">
            <label className="label text-sm">Email *</label>
            <input
              type="email"
              name="email"
              className="input input-bordered input-sm"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control col-span-2">
            <label className="label text-sm">Password *</label>
            <input
              type="password"
              name="password"
              className="input input-bordered input-sm"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control col-span-2">
            <label className="label text-sm">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              className="input input-bordered input-sm"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-span-2 mt-6">
            <button 
              type="submit" 
              className="btn btn-primary w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
