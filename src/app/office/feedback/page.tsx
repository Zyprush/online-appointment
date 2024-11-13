"use client";
import NavLayout from "@/components/NavLayout";
import React, { useEffect, useState } from "react";
import { useOffice } from "@/hooks/useOffice";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebase";

interface Feedback {
  id: string;
  office: string;
  clientId: string;
  date: string;
  completed: boolean;
  SQDO0: number;
  SQDO1: number;
  SQDO2: number;
  SQDO3: number;
  SQDO4: number;
  SQDO5: number;
  SQDO6: number;
  SQDO7: number;
  SQDO8: number;
}

interface OfficeData {
  office: string;
}

const questions = [
  "I am satisfied with the service that I availed.",
  "I spent a reasonable amount of time for my transaction.",
  "The office allowed the transaction's requirements and steps based on the information provided.",
  "The steps (including payment) I needed to do for my transaction were easy and simple.",
  "I easily found information about my transaction from the office or its website.",
  "I paid a reasonable amount of fees for my transaction.",
  "I feel the office was fair to everyone, or 'walang palakasan', during my transaction.",
  "I was treated courteously by the staff, and (if I asked for help) the staff was helpful.",
  "I got what I needed from the government office, or (if denied) denial of request was sufficiently explained to me.",
];

// const options = ["Very Poor", "Poor", "Fair", "Good", "Excellent"];

const OfficeFeedback: React.FC = () => {
    const officeData = useOffice() as OfficeData | null;
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const years = Array.from(
      new Set(
        feedbacks.map(feedback => 
          new Date(feedback.date).getFullYear()
        )
      )
    ).sort((a, b) => b - a);
  
    useEffect(() => {
      const fetchFeedbacks = async () => {
        if (officeData?.office) {
          const feedbackQuery = query(
            collection(db, "feedbacks"),
            where("office", "==", officeData.office),
            where("completed", "==", true)
          );
  
          const querySnapshot = await getDocs(feedbackQuery);
          const feedbackData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Feedback[];
          
          setFeedbacks(feedbackData);
          setFilteredFeedbacks(feedbackData);
          setLoading(false);
        }
      };
  
      fetchFeedbacks();
    }, [officeData]);
  
    useEffect(() => {
      let filtered = [...feedbacks];
  
      if (selectedMonth || selectedYear) {
        filtered = feedbacks.filter(feedback => {
          const date = new Date(feedback.date);
          const month = date.getMonth();
          const year = date.getFullYear();
  
          const monthMatch = !selectedMonth || month === parseInt(selectedMonth);
          const yearMatch = !selectedYear || year === parseInt(selectedYear);
  
          return monthMatch && yearMatch;
        });
      }
  
      setFilteredFeedbacks(filtered);
    }, [selectedMonth, selectedYear, feedbacks]);
  
    const calculateAverages = () => {
      const questionAverages = Array(9).fill(0);
      const questionCounts = Array(9).fill(0);
  
      filteredFeedbacks.forEach((feedback) => {
        for (let i = 0; i < 9; i++) {
          const value = feedback[`SQDO${i}` as keyof Feedback] as number;
          if (value) {
            questionAverages[i] += value;
            questionCounts[i]++;
          }
        }
      });
  
      return questionAverages.map((sum, index) => 
        questionCounts[index] ? (sum / questionCounts[index]).toFixed(2) : 0
      );
    };
  
    const averages = calculateAverages();
  
    return (
      <NavLayout>
        <div className="p-5 md:p-10">
          <h1 className="text-2xl font-bold mb-3 text-primary">
            Feedback Analysis
          </h1>
          {loading ? (
            <p>Loading feedback...</p>
          ) : feedbacks && feedbacks.length > 0 ? (
            <div>
              <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="month" className="font-medium">Month:</label>
                  <select
                    id="month"
                    className="border rounded p-2"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">All Months</option>
                    {months.map((month, index) => (
                      <option key={month} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div className="flex items-center gap-2">
                  <label htmlFor="year" className="font-medium">Year:</label>
                  <select
                    id="year"
                    className="border rounded p-2"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
  
              <p className="mb-4">
                Filtered Responses: {filteredFeedbacks.length}
              </p>
  
              <table className="w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Question</th>
                    <th className="border border-gray-300 p-2">Average Rating</th>
                    <th className="border border-gray-300 p-2">Satisfaction Level</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => {
                    const avg = Number(averages[index]);
                    let satisfactionLevel = "";
                    if (avg <= 1) satisfactionLevel = "Very Poor";
                    else if (avg <= 2) satisfactionLevel = "Poor";
                    else if (avg <= 3) satisfactionLevel = "Fair";
                    else if (avg <= 4) satisfactionLevel = "Good";
                    else satisfactionLevel = "Excellent";
  
                    return (
                      <tr key={index} className="border border-gray-300">
                        <td className="border border-gray-300 p-2 text-sm">
                          {question}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {averages[index]}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {satisfactionLevel}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No feedback found.</p>
          )}
        </div>
      </NavLayout>
    );
  };
  
  export default OfficeFeedback;