"use client";
import NavLayout from "@/components/NavLayout";
import React, { useEffect, useState } from "react";
import { useOffice } from "@/hooks/useOffice";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import { db } from "@/firebase";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const OfficeFeedback = () => {
    const [averages, setAverages] = useState<number[]>([]);
    const officeData = useOffice();

    useEffect(() => {
        const fetchFeedbacks = async () => {
            if (officeData?.office) {
                const feedbackQuery = query(
                    collection(db, "feedbacks"),
                    where("office", "==", officeData.office),
                    where("completed", "==", true)
                );

                const querySnapshot = await getDocs(feedbackQuery);

                const questionTotals = Array(9).fill(0);
                let feedbackCount = 0;

                querySnapshot.forEach((doc) => {
                    const feedback = doc.data();
                    console.log('doc.data()', doc.data())
                    for (let i = 0; i < questionTotals.length; i++) {
                        questionTotals[i] += feedback[`SQD0${i}`] || 0;
                    }
                    feedbackCount++;
                });

                const questionAverages = questionTotals.map(total => 
                    feedbackCount > 0 ? total / feedbackCount : 0
                );
                setAverages(questionAverages);
            }
        };

        fetchFeedbacks();
    }, [officeData, db]);

    const data = {
        labels: ["SQD00", "SQD01", "SQD02", "SQD03", "SQD04", "SQD05", "SQD06", "SQD07", "SQD08"],
        datasets: [
            {
                label: "Average Rating",
                data: averages,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Office Feedback Ratings',
                font: {
                    size: 16,
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 5, // Assuming ratings are from 0-5
                ticks: {
                    stepSize: 1,
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
    };

    return (
        <NavLayout>
            <div className="p-5">
                <h1 className="text-2xl font-bold mb-4">Office Feedback</h1>
                <div className="w-full h-[600px] bg-white rounded-lg shadow-lg p-4">
                    {averages.length > 0 ? (
                        <Bar data={data} options={options} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Loading feedback data...</p>
                        </div>
                    )}
                </div>
            </div>
        </NavLayout>
    );
};

export default OfficeFeedback;