import Link from 'next/link';
import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Terms of Use
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Welcome to OMSC Appointment System. These terms and conditions outline
          the rules and regulations for the use of our service.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          1. Acceptance of Terms
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          By accessing or using our service, you agree to be bound by these
          terms and conditions, all applicable laws, and regulations. If you do
          not agree with any of these terms, you are prohibited from using this
          service.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          2. Changes to the Terms
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          OMSC reserves the right to modify or update these terms at any time
          without prior notice. You are responsible for regularly reviewing the
          terms. Continued use of the service after any changes indicates your
          acceptance of those changes.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          3. User Responsibilities
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          As a user, you agree to use the service only for lawful purposes. You
          are prohibited from using the service in any way that could damage or
          interfere with the service or the experience of other users.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          4. Intellectual Property
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          All content, including but not limited to text, graphics, logos,
          images, and software, is the property of OMSC or its licensors. You
          may not copy, modify, distribute, or use any part of the content
          without prior written consent.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          5. Termination
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          We reserve the right to terminate or suspend your access to the
          service at any time for any reason, including but not limited to
          breaches of these terms.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          6. Limitation of Liability
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          OMSC will not be liable for any damages arising from the use or
          inability to use the service. In no event shall OMSC be liable for any
          indirect, incidental, or consequential damages.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          7. Governing Law
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          These terms are governed by and construed in accordance with the laws
          of [Your Jurisdiction], and you submit to the exclusive jurisdiction
          of the courts in that location.
        </p>

        <p className="text-sm text-gray-600 mb-6">
          If you have any questions about these Terms, please contact us at{' '}
          <a
            href="mailto:mambuappoint@gmail.com"
            className="text-blue-600 hover:underline"
          >
            mambuappoint@gmail.com
          </a>
          .
        </p>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Last Updated: September 2024
        </p>
      </div>
      <Link href="/log-in" className='bg-primary text-white rounded-lg py-3 hover:bg-blue-600 transition duration-300 mb-4 fixed bottom-4 right-4 px-4'>
        back
      </Link>
    </div>
  );
};

export default TermsOfUse;
