'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>This is the privacy policy for FarmConnect.</p>
        <h2>1. Information We Collect</h2>
        <p>We collect certain information from you when you use our platform. This may include personal information and usage data.</p>
        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information to provide and improve our services, communicate with you, and ensure the security of our platform.</p>
        <h2>3. Data Sharing and Disclosure</h2>
        <p>We do not share your personal information with third parties except as necessary to provide our services or comply with legal obligations.</p>
      </div>
    </div>
  );
} 