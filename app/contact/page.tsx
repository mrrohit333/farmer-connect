'use client';

import React from 'react';

export default function ContactUsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>You can contact us using the information below:</p>
        <p>Email: farmconnect111@gmail.com</p>
        <p>Phone: +91 8778195792</p>
        <p>Address: 123 FarmConnect Lane, Agriculture City, AG 12345</p>
        <h2>Get in Touch</h2>
        <p>If you have any questions or inquiries, please feel free to reach out to us.</p>
        {/* You can add a contact form here later */}
      </div>
    </div>
  );
} 