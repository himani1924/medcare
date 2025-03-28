'use client'
import React from 'react'
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import SlotTable from '@/components/SlotTable';


const Page = () => {
  const [slots, setSlots] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/slots`);
        setSlots(response.data.slots);
        console.log(response);
      } catch (error) {
        if(error instanceof AxiosError){
          if (error.response) {
            console.log('no slots');
            setSlots([]);
            return;
          }
        }
        else{
          console.error("Error fetching slots:", error);
        }
      }
    };

    fetchSlots();
  }, [refreshKey]);

  const handleApprove = async (slotId : number) => {
    try {
      console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/approve-slot/${slotId}`);
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/approve-slot/${slotId}`, { id: slotId });
      setRefreshKey((prev) => prev + 1); 
      // Trigger re-fetch
      console.log(' hit approve', slotId);
    } catch (error) {
      console.error("Error approving slot:", error);
    }
  };

  const handleReject = async (slotId : number) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete-slot/${slotId}`, { id: slotId });
      setRefreshKey((prev) => prev + 1); 
      console.log('hit reject', slotId);
    } catch (error) {
      console.error("Error rejecting slot:", error);
    }
  };
  if(slots.length === 0){
    return(
      <p>No pending slots</p>
    )
  }
  else{
  return (
    <SlotTable slots={slots} onApprove={handleApprove} onReject={handleReject} />
  )
}
}

export default Page