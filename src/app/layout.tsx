import type { Metadata } from "next";
import { Montserrat } from 'next/font/google'; // Import Montserrat font
import "./globals.css";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'], // Include weights as needed
});

export const metadata: Metadata = {
  title: "OMSC Appointment System",
  description: "Online Appointment Management System with SMS notification",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased text-gray-700`}> {/* Use Montserrat */}
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
