'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";


import AppointmentDetailsForm from "@/components/AppointmentDetailsForm";
import PaymentForm from "@/components/PaymentForm";
import PatientInfoForm from "@/components/PatientInfoForm";
import { AppointmentTypeOption } from "@/types/AppointmentType";
import { DoctorOption } from "@/types/Doctor";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Patient info
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("MALE");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  // Appointment details
  const [doctorId, setDoctorId] = useState<number>(0);
  const [appointmentTypeId, setAppointmentTypeId] = useState<number>(0);
  const [dateTime, setDateTime] = useState("");
  const [note, setNote] = useState("");

  // For payment step
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const [amountInCents, setAmountInCents] = useState<number | null>(null);

  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentTypeOption[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  async function fetchData() {
    try {
      const [doctorsRes, typesRes] = await Promise.all([
        apiClient.get("/api/doctors", { params: { page: 0, size: 1000 } }),
        apiClient.get("/api/appointment-types"),
      ]);

      // Map doctors (e.g., combine firstname + lastname)
      const doctorOptions: DoctorOption[] = (doctorsRes.data.content ?? doctorsRes.data).map((d: any) => ({
        id: d.id,
        name: `${d.firstname} ${d.lastname}`.trim(),
        hospitalName: d.hospitalName,
      }));

      // Map appointment types
      const typeOptions: AppointmentTypeOption[] = (typesRes.data.content ?? typesRes.data).map((t: any) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        duration: t.duration,
      }));

      setDoctors(doctorOptions.sort((a, b) => a.name.localeCompare(b.name)));
      setAppointmentTypes(typeOptions.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load form data");
    }
  }

  fetchData();
}, []);


  const handleCreateAppointment = async () => {
    if (!firstname || !lastname || !doctorId || !appointmentTypeId || !dateTime) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      let patientId: number;

      // get existing patient id from /api/patients/my
      try {
        const existingPatientRes = await apiClient.get("/api/patients/my");
        patientId = existingPatientRes.data.id;
      } catch {
        // If not found, create new patient
        const patientRes = await apiClient.post("/api/patients", {
          firstname,
          lastname,
          preferredName,
          email,
          dateOfBirth,
          gender,
          address,
          contactNumber,
        });
        patientId = patientRes.data.id;
      }

      // Create appointment
      const appointmentRes = await apiClient.post(
        "/api/appointments",
        {},
        {
          params: {
            doctorId,
            appointmentTypeId,
            dateTime,
            note,
            patientId,
          },
        }
      );

      const createdAppointment = appointmentRes.data;

      if (!createdAppointment.id || !createdAppointment.amount) {
        throw new Error("Appointment creation response missing id or amount");
      }

      setAppointmentId(createdAppointment.id);
      setAmountInCents(Math.round(createdAppointment.amount * 100));
      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded shadow p-6 mt-10">
      <h1 className="text-2xl font-semibold mb-4">Quick Booking appointment</h1>

      <div className="flex border-b mb-4">
        {["Basic Information", "Appointment Details", "Payment"].map((label, idx) => (
          <button
            key={idx}
            onClick={() => setStep(idx)}
            className={`py-2 px-4 border-b-2 ${
              step === idx
                ? "border-blue-500 text-blue-600 font-medium"
                : "border-transparent text-gray-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <PatientInfoForm
          firstname={firstname}
          setFirstname={setFirstname}
          lastname={lastname}
          setLastname={setLastname}
          email={email}
          setEmail={setEmail}
          dateOfBirth={dateOfBirth}
          setDateOfBirth={setDateOfBirth}
          gender={gender}
          setGender={setGender}
          address={address}
          setAddress={setAddress}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <AppointmentDetailsForm
          doctorId={doctorId}
          setDoctorId={setDoctorId}
          appointmentTypeId={appointmentTypeId}
          setAppointmentTypeId={setAppointmentTypeId}
          dateTime={dateTime}
          setDateTime={setDateTime}
          note={note}
          setNote={setNote}
          doctors={doctors}
          appointmentTypes={appointmentTypes}
          onBack={() => setStep(0)}
          onNext={handleCreateAppointment}
          loading={loading}
        />
      )}

      {step === 2 && appointmentId && amountInCents !== null && (
        <PaymentForm
          onBack={() => setStep(1)}
          onSubmitSuccess={() => {
            toast.success("Registration and payment completed!");
            router.push("/public/confirmation");
          }}
          loading={loading}
          appointmentId={appointmentId}
          amountInCents={amountInCents}
        />
      )}
    </div>
  );
}
