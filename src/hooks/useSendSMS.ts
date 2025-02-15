// hooks/useSendSMS.ts
import { useState } from "react";
import axios from "axios";

interface AppointmentDetails {
  appointmentId?: string;
  contact?: string;
  selectedDate?: string;
  timeRange?: string;
  selectedOffice?: string;
  selectedPersonnel?: string;
  declineReason?: string;
  phoneNumber?: string;
  name?: string;
  officeCode?: string;
  selectedService?: string;
  purpose?: string;
}

interface SendSMSResponse {
  success: boolean;
  error?: string;
}

export const useSendSMS = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendAppointSMS = async (
    appointment: AppointmentDetails
  ): Promise<SendSMSResponse> => {
    setIsSending(true);
    setError(null);
    try {
      console.log("appointmentID", appointment.appointmentId);
      const response = await axios.post(
        "/pages/api/send-sms",
        {
          contact: appointment.phoneNumber,
          messageBody: `${appointment.name} book an appointment on ${
            appointment.selectedDate
          } at ${appointment.timeRange}.\n\nCODE: ${
            appointment.officeCode || ""
          }${appointment.appointmentId}\nOFFICE: ${appointment.selectedOffice}/nSERVICE: ${appointment.selectedService}/nPURPOSE: ${appointment.purpose}`,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError("Failed to send SMS: " + errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSending(false);
    }
  };

  const sendApproveSMS = async (
    appointment: AppointmentDetails
  ): Promise<SendSMSResponse> => {
    setIsSending(true);
    setError(null);
    try {
      const response = await axios.post(
        "/pages/api/send-sms",
        {
          contact: appointment.contact,
          messageBody: `Your appointment has been approved.\n \nCode: ${
            appointment.officeCode || ""
          }${appointment.appointmentId}\n\nDate: ${
            appointment.selectedDate
          }\nTime: ${appointment.timeRange}\nOffice: ${
            appointment.selectedOffice
          }\nService: ${appointment.selectedService}\nPurpose: ${
            appointment.purpose
          }.`,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError("Failed to send SMS: " + errorMessage);
      console.log("err", err);
      return { success: false, error: errorMessage };
    } finally {
      setIsSending(false);
    }
  };

  const sendDeclineSMS = async (
    appointment: AppointmentDetails
  ): Promise<SendSMSResponse> => {
    setIsSending(true);
    setError(null);
    try {
      const response = await axios.post(
        "/pages/api/send-sms",
        {
          contact: appointment.contact,
          messageBody: `Hello ${appointment.name}, we’re sorry to inform you that your appointment on ${appointment.selectedDate} at ${appointment.timeRange} has been canceled due to ${appointment.declineReason}. We understand this may be inconvenient, and we appreciate your patience. You may reschedule through ${window.location.origin}/client/appointment`,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError("Failed to send SMS: " + errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSending(false);
    }
  };

  const sendReschedSMS = async (
    appointment: AppointmentDetails
  ): Promise<SendSMSResponse> => {
    setIsSending(true);
    setError(null);
    try {
      const response = await axios.post(
        "/pages/api/send-sms",
        {
          contact: appointment.contact,
          messageBody: `Your appointment has been Rescheduled.\n \nCode: ${
            appointment.officeCode || ""
          }${appointment.appointmentId} \n\nDate: ${
            appointment.selectedDate
          }\nTime: ${appointment.timeRange}\nOffice: ${
            appointment.selectedOffice
          }\n\nYou can cancel the appointment in the appointment page and choose another time slot or date if needed.`,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError("Failed to send SMS: " + errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSending(false);
    }
  };

  
  return {
    sendAppointSMS,
    sendApproveSMS,
    sendDeclineSMS,
    sendReschedSMS,
    isSending,
    error,
  };
};
