'use client';

import { PatientInfoFormProps } from "@/types/Patient";

export default function PatientInfoForm(props: PatientInfoFormProps) {
  const {
    firstname, setFirstname,
    lastname, setLastname,
    email, setEmail,
    dateOfBirth, setDateOfBirth,
    gender, setGender,
    address, setAddress,
    onNext,
  } = props;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <input
          type="text"
          required
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <input
          type="text"
          required
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <input
          type="date"
          required
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Gender</label>
        <div className="flex space-x-2">
          {["MALE", "FEMALE", "OTHER"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 border rounded p-2 ${
                gender === g ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {g[0] + g.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Address</label>
        <div className="md:col-span-2">
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded p-2 h-24 resize-none"
            placeholder="Enter your full address"
          />
        </div>

      </div>
      <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </form>
  );
}
