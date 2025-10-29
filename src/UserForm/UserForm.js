import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./UserForm.css";

const RATINGS = {
  "Professional": 1.5,
  "White Collar": 2.25,
  "Light Manual": 11.5,
  "Heavy Manual": 31.75
};

const OCCUPATIONS = [
  { label: "Cleaner", rating: "Light Manual" },
  { label: "Doctor", rating: "Professional" },
  { label: "Author", rating: "White Collar" },
  { label: "Farmer", rating: "Heavy Manual" },
  { label: "Mechanic", rating: "Heavy Manual" },
  { label: "Florist", rating: "Light Manual" },
  { label: "Other", rating: "Heavy Manual" }
];

const calculatePremium = (amount, factor, age) => {
  if (!amount || !factor || !age) return 0;
  return ((amount * factor * age) / 1000) * 12;
};

export default function UserForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      age: "",
      dob: "",
      occupation: "",
      deathSumInsured: ""
    }
  });

  const [premium, setPremium] = useState(0);

  const values = watch(["age", "occupation", "deathSumInsured"]);

  // 🔹 Only calculate premium when the form is valid (after submit)
  const onSubmit = (data) => {
    const selectedOcc = OCCUPATIONS.find(o => o.label === data.occupation);
    if (selectedOcc) {
      const factor = RATINGS[selectedOcc.rating];
      const result = calculatePremium(Number(data.deathSumInsured), factor, Number(data.age));
      setPremium(result.toFixed(2));
    }
  };

  return (
    <div className="user-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Name:</label><br />
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Enter full name"
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Age Next Birthday:</label><br />
          <input
            type="number"
            {...register("age", {
              required: "Age is required",
              min: { value: 1, message: "Age must be greater than 0" }
            })}
            placeholder="Enter age"
          />
          {errors.age && <p className="error">{errors.age.message}</p>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Date of Birth (MM/YYYY):</label><br />
          <input
            type="month"
            {...register("dob", { required: "Date of birth is required" })}
          />
          {errors.dob && <p className="error">{errors.dob.message}</p>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Usual Occupation:</label><br />
          <select
            {...register("occupation", { required: "Occupation is required" })}
          >
            <option value="">-- Select Occupation --</option>
            {OCCUPATIONS.map((o) => (
              <option key={o.label} value={o.label}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.occupation && <p className="error">{errors.occupation.message}</p>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Death – Sum Insured:</label><br />
          <input
            type="number"
            {...register("deathSumInsured", {
              required: "Sum insured is required",
              min: { value: 1, message: "Must be greater than 0" }
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
        <div style={{
          backgroundColor: "#f2f2f2",
          padding: "10px",
          borderRadius: "4px",
          fontSize: "1.2rem"
        }}>
          ${premium}
        </div>
      </form>
    </div>
  );
}
