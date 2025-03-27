'use client'
import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import SlotTable from '@/components/SlotTable';
import { toast } from 'react-toastify';


const Page = () => {
  const [slots, setSlots] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/slots`);
        if(response.data.status === 400){
          toast.error(response.data.error)
          setSlots([])
          return;
        }
        setSlots(response.data.slots);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching slots:", error);
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
  return (
    <SlotTable slots={slots} onApprove={handleApprove} onReject={handleReject} />
  )
}

export default Page