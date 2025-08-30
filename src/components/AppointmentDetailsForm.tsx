'use client';

import { AppointmentDetailsProps } from "@/types/Appointment";

export default function AppointmentDetailsForm({
  doctorId, setDoctorId,
  appointmentTypeId, setAppointmentTypeId,
  dateTime, setDateTime,
  note, setNote,
  doctors, appointmentTypes,
  onNext, onBack,
}: AppointmentDetailsProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-4"
    >
      {/* Doctor */}
      <div>
        <label className="block mb-1">Doctor *</label>
        <select
          required
          value={doctorId}
          onChange={(e) => setDoctorId(Number(e.target.value))}
          className="w-full border p-2 rounded"
        >
          <option value={0} disabled>Select doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}{d.hospitalName ? ` (${d.hospitalName})` : ''}
            </option>

          ))}
        </select>
      </div>
      {/* Appointment Type */}
      <div>
        <label className="block mb-1">Appointment Type *</label>
        <select
          required
          value={appointmentTypeId}
          onChange={(e) => setAppointmentTypeId(Number(e.target.value))}
          className="w-full border p-2 rounded"
        >
          <option value={0} disabled>Select type</option>
          {appointmentTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} (${t.price} | {t.duration} mins)
            </option>
          ))}

        </select>
      </div>
      {/* DateTime */}
      <div>
        <label className="block mb-1">Date & Time *</label>
        <input
          type="datetime-local"
          required
          min={new Date().toISOString().slice(0,16)}
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      {/* Note */}
      <div>
        <label className="block mb-1">Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border p-2 rounded"
          rows={3}
        />
      </div>
      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onBack}
          className="border px-4 py-2 rounded"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Next →
        </button>
      </div>
    </form>
  );
}
