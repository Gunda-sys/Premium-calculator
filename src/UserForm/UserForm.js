import { useState } from "react";
import { useForm } from "react-hook-form";
import "./UserForm.css";

const RATINGS = {
  Professional: 1.5,
  "White Collar": 2.25,
  "Light Manual": 11.5,
  "Heavy Manual": 31.75,
};

const OCCUPATIONS = [
  { label: "Cleaner", rating: "Light Manual" },
  { label: "Doctor", rating: "Professional" },
  { label: "Author", rating: "White Collar" },
  { label: "Farmer", rating: "Heavy Manual" },
  { label: "Mechanic", rating: "Heavy Manual" },
  { label: "Florist", rating: "Light Manual" },
  { label: "Other", rating: "Heavy Manual" },
];

const calculatePremium = (amount, factor, age) => {
  if (!amount || !factor || !age) return 0;
  return ((amount * factor * age) / 1000) * 12;
};

export default function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      age: "",
      dob: "",
      occupation: "",
      deathSumInsured: "",
    },
  });

  const [premium, setPremium] = useState(0);

  const onSubmit = (data) => {
    const selectedOcc = OCCUPATIONS.find((o) => o.label === data.occupation);
    if (selectedOcc) {
      const factor = RATINGS[selectedOcc.rating];
      const result = calculatePremium(
        Number(data.deathSumInsured),
        factor,
        Number(data.age)
      );
      setPremium(result.toFixed(2));
    } else {
      setPremium(0);
    }
  };

  return (
    <div className="user-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">Name:</label><br />
          <input
            id="name"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter full name"
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

        {/* Age */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="age">Age Next Birthday:</label><br />
          <input
            id="age"
            type="number"
            {...register("age", {
              required: "Age is required",
              min: { value: 1, message: "Age must be greater than 0" },
            })}
            placeholder="Enter age"
          />
          {errors.age && <p className="error">{errors.age.message}</p>}
        </div>

        {/* DOB */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="dob">Date of Birth (MM/YYYY):</label><br />
          <input
            id="dob"
            type="month"
            {...register("dob", { required: "Date of birth is required" })}
          />
          {errors.dob && <p className="error">{errors.dob.message}</p>}
        </div>

        {/* Occupation */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="occupation">Usual Occupation:</label><br />
          <select
            id="occupation"
            {...register("occupation", { required: "Occupation is required" })}
          >
            <option value="">-- Select Occupation --</option>
            {OCCUPATIONS.map((o) => (
              <option key={o.label} value={o.label}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.occupation && (
            <p className="error">{errors.occupation.message}</p>
          )}
        </div>

        {/* Sum Insured */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="deathSumInsured">Death – Sum Insured:</label><br />
          <input
            id="deathSumInsured"
            type="number"
            {...register("deathSumInsured", {
              required: "Sum insured is required",
              min: { value: 1, message: "Must be greater than 0" },
            })}
            placeholder="Enter amount"
          />
          {errors.deathSumInsured && (
            <p className="error">{errors.deathSumInsured.message}</p>
          )}
        </div>

        <hr />

        <button type="submit">Calculate Premium</button>

        <h3>Calculated Monthly Premium:</h3>
        <div
          style={{
            backgroundColor: "#f2f2f2",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "1.2rem",
          }}
        >
          ${premium}
        </div>
      </form>
    </div>
  );
}
