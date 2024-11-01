// hooks/useSendSMS.ts
import { useState } from "react";
import axios from "axios";

interface AppointmentDetails {
  appointmentId: string;
  contact: string;
  selectedDate: string;
  timeRange: string;
  selectedOffice: string;
  selectedPersonnel: string;
  declineReason?: string;
}

interface SendSMSResponse {
  success: boolean;
  error?: string;
}

export const useSendSMS = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendApproveSMS = async (
    appointment: AppointmentDetails,
  ): Promise<SendSMSResponse> => {
    setIsSending(true);
    setError(null);
    try {
      const response = await axios.post(
        "/pages/api/approve-sms",
        {
          appointmentId: appointment.appointmentId,
          contact: appointment.contact,
          selectedDate: appointment.selectedDate,
          timeRange: appointment.timeRange,
          selectedOffice: appointment.selectedOffice,
          selectedPersonnel: appointment.selectedPersonnel,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError("Failed to send SMS: " + errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSending(false);
    }
  };

  const sendDeclineSMS = async (
    appointment: AppointmentDetails,
  ): Promise<SendSMSResponse> => {
    setIsSending(true);
    setError(null);
    try {
      const response = await axios.post(
        "/pages/api/decline-sms",
        {
          appointmentId: appointment.appointmentId,
          contact: appointment.contact,
          selectedDate: appointment.selectedDate,
          timeRange: appointment.timeRange,
          selectedOffice: appointment.selectedOffice,
          selectedPersonnel: appointment.selectedPersonnel,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError("Failed to send SMS: " + errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSending(false);
    }
  };

  return { sendApproveSMS, sendDeclineSMS, isSending, error };
};
