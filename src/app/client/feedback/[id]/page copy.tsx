"use client";
import NavLayout from "@/components/NavLayout";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface InfoProps {
  params: {
    id: string;
  };
}

interface Feedback {
  id: string;
  clientId: string;
  date: string;
  office: string;
  completed: boolean;
  SQDO0?: number;
  SQDO1?: number;
  SQDO2?: number;
  SQDO3?: number;
  SQDO4?: number;
  SQDO5?: number;
  SQDO6?: number;
  SQDO7?: number;
  SQDO8?: number;
}

const AnswerFeedback: React.FC<InfoProps> = ({ params }) => {
  const { id } = params;
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getFeedback = async () => {
      setLoading(true);
      try {
        const feedbackRef = doc(db, "feedbacks", id);
        const feedbackSnap = await getDoc(feedbackRef);
        
        if (feedbackSnap.exists()) {
          const feedbackData = {
            id: feedbackSnap.id,
            ...(feedbackSnap.data() as Omit<Feedback, "id">)
          };
          setFeedback(feedbackData);
        }
      } catch (error) {
        console.log("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getFeedback();
    }
  }, [id]);

  if (loading) {
    return <NavLayout>Loading...</NavLayout>;
  }

  if (!feedback) {
    return <NavLayout>Feedback not found</NavLayout>;
  }

  return (
    <NavLayout>
      <div className="p-5">
        <h1>Feedback Details</h1>
        <p>Office: {feedback.office}</p>
        <p>Date: {feedback.date}</p>
        <p>Completed: {feedback.completed ? 'Yes' : 'No'}</p>
        {/* Add more feedback details as needed */}
      </div>
    </NavLayout>
  );
};

export default AnswerFeedback;


// const SatisfactionForm: React.FC<SatisfactionFormProps> = ({ setResponses }) => {
//   const questions = [
//     "I am satisfied with the service that I availed.",
//     "I spent a reasonable amount of time for my transaction.",
//     "The office allowed the transaction’s requirements and steps based on the information provided.",
//     "The steps (including payment) I needed to do for my transaction were easy and simple.",
//     "I easily found information about my transaction from the office or its website.",
//     "I paid a reasonable amount of fees for my transaction.",
//     "I feel the office was fair to everyone, or 'walang palakasan', during my transaction.",
//     "I was treated courteously by the staff, and (if I asked for help) the staff was helpful.",
//     "I got what I needed from the government office, or (if denied) denial of request was sufficiently explained to me."
//   ];

//   const options = [
//     "Strongly Disagree",
//     "Disagree",
//     "Neither Agree nor Disagree",
//     "Agree",
//     "Strongly Agree",
//     "N/A (Not Applicable)"
//   ];

//   const [responses, setLocalResponses] = useState<number[]>(Array(questions.length).fill(-1));

//   const handleCheckboxChange = (questionIndex: number, optionIndex: number) => {
//     const updatedResponses = responses.map((response, idx) =>
//       idx === questionIndex ? optionIndex : response
//     );
//     setLocalResponses(updatedResponses);
//     setResponses(updatedResponses); // Update parent component
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-semibold mb-4">Satisfaction Form</h2>
//       <table className="w-full border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border border-gray-300 p-2">Question</th>
//             {options.map((option, index) => (
//               <th key={index} className="border border-gray-300 p-2 text-sm">{option}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {questions.map((question, qIndex) => (
//             <tr key={qIndex} className="border border-gray-300">
//               <td className="border border-gray-300 p-2 text-sm">{question}</td>
//               {options.map((_, oIndex) => (
//                 <td key={oIndex} className="border border-gray-300 text-center">
//                   <input
//                     type="radio"
//                     checked={responses[qIndex] === oIndex}
//                     onChange={() => handleCheckboxChange(qIndex, oIndex)}
//                     className="form-radio h-4 w-4 text-blue-600"
//                   />
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SatisfactionForm;

