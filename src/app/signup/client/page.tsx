"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useState } from "react";

const SignupPage = () => {
  const [step, setStep] = useState(1); // Tracks current step
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    extensionName: "",
    contact: "",
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "zipCode") {
      const numericValue = value.replace(/\D/g, "").slice(0, 4); // Limit to 4 digits
      setFormData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
    } else if (name === "contact") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10); // Limit to 10 digits
      setFormData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateZipCode = (zipCode: string): boolean => {
    return /^\d{4}$/.test(zipCode);
  };

  const validateContact = (contact: string): boolean => {
    return /^9\d{9}$/.test(contact);
  };

  const validateForm = () => {
    for (const [key, value] of Object.entries(formData)) {
      if (!value && key !== "middleName" && key !== "extensionName") {
        alert(
          `Please fill out the ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`
        );
        return false;
      }
    }

    if (!validateZipCode(formData.zipCode)) {
      alert("Please enter a valid 4-digit zip code.");
      return false;
    }

    if (!validateContact(formData.contact)) {
      alert("Please enter a valid 10-digit contact number.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      if (user) {
        // Save user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
          lastName: formData.lastName,
          firstName: formData.firstName,
          middleName: formData.middleName,
          extensionName: formData.extensionName,
          contact: formData.contact,
          birthdate: formData.birthdate,
          sex: formData.sex,
          homeAddress: formData.homeAddress,
          province: formData.province,
          city: formData.city,
          barangay: formData.barangay,
          zipCode: formData.zipCode,
          email: formData.email,
          verified: true,
          role: "client",
        });

        alert("Signup successful");
        window.location.href = "/log-in";
      }
    } catch (error) {
      console.error("Error signing up: ", error);
      alert("Error signing up: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const isStepValid = () => {
    if (step === 1) {
      return (
        formData.lastName &&
        formData.firstName &&
        formData.contact &&
        formData.birthdate &&
        formData.sex
      );
    } else if (step === 2) {
      return (
        formData.homeAddress &&
        formData.province &&
        formData.city &&
        formData.barangay &&
        formData.zipCode
      );
    } else if (step === 3) {
      return formData.email && formData.password && formData.confirmPassword;
    }
    return true;
  };

  return (
    <div className="flex justify-center items-center h-full overflow-scroll fixed top-0 bottom-0 right-0 left-0 p-5 bg-[url('/img/omsc.jpg')]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 md:p-10 rounded-2xl shadow-md w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-4 text-primary">
          Signup as Client
        </h2>

        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control col-span-2 text-lg font-semibold">
                Personal Information
              </div>
              <div className="form-control">
                <label className="label text-sm">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className="input input-bordered input-sm rounded-sm"
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
                  className="input input-bordered input-sm rounded-sm"
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
                  className="input input-bordered input-sm rounded-sm"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label text-sm">Extension Name</label>
                <input
                  type="text"
                  name="extensionName"
                  className="input input-bordered input-sm rounded-sm"
                  value={formData.extensionName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label text-sm">Contact Number *</label>
                <input
                  type="tel"
                  name="contact"
                  className="input input-bordered input-sm rounded-sm"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  maxLength={11}
                />
              </div>
              <div className="form-control">
                <label className="label text-sm">Birthdate *</label>
                <input
                  type="date"
                  name="birthdate"
                  className="input input-bordered input-sm rounded-sm"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label text-sm">Sex *</label>
                <select
                  name="sex"
                  className="input input-bordered input-sm rounded-sm"
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
            </div>
            <div className="mt-6 w-full flex">
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary mr-0 ml-auto"
                disabled={!isStepValid()}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control col-span-2 text-lg font-semibold">
                Address Information
              </div>
              <div className="form-control col-span-2">
                <label className="label text-sm">Home Address *</label>
                <input
                  type="text"
                  name="homeAddress"
                  className="input input-bordered input-sm rounded-sm"
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
                  className="input input-bordered input-sm rounded-sm"
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
                  className="input input-bordered input-sm rounded-sm"
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
                  className="input input-bordered input-sm rounded-sm"
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
                  className="input input-bordered input-sm rounded-sm"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  maxLength={4}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="btn text-white btn-secondary mr-2"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary "
                disabled={!isStepValid()}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control col-span-2 text-lg font-semibold">
                Account Information
              </div>
              <div className="form-control col-span-2">
                <label className="label text-sm">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered input-sm rounded-sm"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label text-sm">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="input input-bordered input-sm rounded-sm"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label text-sm">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input input-bordered input-sm rounded-sm"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-secondary text-white mr-2"
              >
                Previous
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default SignupPage;