import DoctorProfile from '@/components/DoctorProfile';
import React from 'react'

const page = () => {
    const doctorData = {
        name: "Dr. Jane Doe",
        qualification: "MBBS, DDS",
        specialty: "Dentist",
        experience: 9,
        rating: 4.5,
        image: "/doc.png",
        clinic: "Green Dental Care",
        location: "New York, USA",
        about:
          "Dr. Jane Doe is a highly experienced dentist specializing in cosmetic and general dentistry. With 9 years of practice, she is dedicated to providing the best dental care with a focus on patient comfort and precision.",
      };
  return (
    <div>
        <DoctorProfile {...doctorData}/>
    </div>
  )
}

export default page