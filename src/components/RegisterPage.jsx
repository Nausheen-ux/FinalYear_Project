

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// /*
//  Register page:
//  - name, email, password
//  - idProof file (image/pdf) -> store filename + if image store dataURL
//  - passport photo (image) -> store dataURL for preview
// */
// export default function RegisterPage({ onRegister }) {
//   const nav = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     idProofName: "",
//     idProofDataUrl: null,
//     photoDataUrl: null,
//   });
//   const [errors, setErrors] = useState("");

//   const handleText = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const readFileAsDataUrl = (file) =>
//     new Promise((res, rej) => {
//       const reader = new FileReader();
//       reader.onload = () => res(reader.result);
//       reader.onerror = rej;
//       reader.readAsDataURL(file);
//     });

//   const handleIdProof = async (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     let dataUrl = null;
//     if (f.type.startsWith("image/")) {
//       dataUrl = await readFileAsDataUrl(f);
//     }
//     setForm((p) => ({ ...p, idProofName: f.name, idProofDataUrl: dataUrl }));
//   };

//   const handlePhoto = async (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     if (!f.type.startsWith("image/")) {
//       setErrors("Passport photo must be an image file.");
//       return;
//     }
//     const dataUrl = await readFileAsDataUrl(f);
//     setForm((p) => ({ ...p, photoDataUrl: dataUrl }));
//     setErrors("");
//   };

//   const handleSubmit = (ev) => {
//     ev.preventDefault();
//     setErrors("");
//     // basic validation
//     if (!form.name.trim() || !form.email.trim() || !form.password) {
//       setErrors("Please fill name, email and password.");
//       return;
//     }
//     if (!form.idProofName) {
//       setErrors("Please upload an ID proof (Aadhaar / Voter / Passport).");
//       return;
//     }
//     if (!form.photoDataUrl) {
//       setErrors("Please upload a passport-size photo.");
//       return;
//     }

//     // Compose user object
//     const user = {
//       name: form.name.trim(),
//       email: form.email.trim().toLowerCase(),
//       password: form.password,
//       idProofName: form.idProofName,
//       idProofDataUrl: form.idProofDataUrl,
//       photoDataUrl: form.photoDataUrl,
//     };

//     const result = onRegister(user);
//     if (!result || !result.ok) {
//       setErrors(result?.message || "Registration error.");
//       return;
//     }

//     alert("Registration successful — please login.");
//     nav("/login");
//   };

//   return (
//     <div className="container">
//       <div className="card">
//         <div className="header">
//           <h2>Register</h2>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="form-row">
//             <label>Name</label>
//             <input className="input" name="name" value={form.name} onChange={handleText} required />
//           </div>

//           <div className="form-row">
//             <label>Email</label>
//             <input className="input" name="email" type="email" value={form.email} onChange={handleText} required />
//           </div>

//           <div className="form-row">
//             <label>Password</label>
//             <input className="input" name="password" type="password" value={form.password} onChange={handleText} required />
//             <div className="note">Use a simple password for testing (demo app).</div>
//           </div>

//           <div className="form-row">
//             <label>ID Proof (Aadhaar / Voter / Passport) — image or PDF</label>
//             <input className="input" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleIdProof} />
//             {form.idProofName && <div className="file-preview">Selected: {form.idProofName}</div>}
//           </div>

//           <div className="form-row">
//             <label>Passport-size photo (image)</label>
//             <input className="input" type="file" accept="image/*" onChange={handlePhoto} />
//             {form.photoDataUrl && (
//               <div style={{ marginTop: 8 }}>
//                 <img src={form.photoDataUrl} alt="preview" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }} />
//               </div>
//             )}
//           </div>

//           {errors && <div style={{ color: "crimson", marginBottom: 8 }}>{errors}</div>}

//           <div style={{ display: "flex", gap: 8 }}>
//             <button type="submit" className="btn btn-primary">Register</button>
//             <button type="button" className="btn btn-ghost" onClick={() => (window.location.href = "/login")}>Go to Login</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
//--------------------------------------------06-10----------------------------------------------------------

// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function RegisterChoice() {
//   const navigate = useNavigate();

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-[90%] max-w-md">
//         <h1 className="text-3xl font-bold mb-8 text-gray-800">Register As</h1>

//         <div className="flex flex-col space-y-4">
//           <button
//             onClick={() => navigate("/register/student")}
//             className="bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
//           >
//             Student
//           </button>

//           <button
//             onClick={() => navigate("/register/landlord")}
//             className="bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
//           >
//             Property Owner
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/RegisterChoice.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8f3ef] to-white font-poppins">
      {/* Card container */}
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md text-center border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Register As</h1>
        <p className="text-gray-600 mb-8">
          Choose your role to continue registration
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/register/student")}
            className="w-full py-3 rounded-xl bg-[#e6424f] text-white text-lg font-semibold hover:bg-[#d83945] transition duration-300 shadow-md"
          >
            🎓 Student
          </button>

          <button
            onClick={() => navigate("/register/landlord")}
            className="w-full py-3 rounded-xl border border-[#e6424f] text-[#e6424f] text-lg font-semibold hover:bg-[#fce8ea] transition duration-300 shadow-sm"
          >
            🏠 Property Owner
          </button>
        </div>

        <p className="mt-8 text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#e6424f] cursor-pointer font-medium hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterChoice;


