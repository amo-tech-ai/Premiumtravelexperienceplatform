import React from 'react';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-stone-600 text-lg mb-12">
            Last updated: December 22, 2024
          </p>

          <div className="prose prose-stone max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">1. Introduction</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                Welcome to Medellín AI Concierge ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">2. Data We Collect</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We may collect, use, store and transfer different kinds of personal data about you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-stone-700">
                <li><strong>Identity Data:</strong> First name, last name, username</li>
                <li><strong>Contact Data:</strong> Email address, telephone numbers</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
                <li><strong>Marketing Data:</strong> Your preferences in receiving marketing from us</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">3. How We Use Your Data</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-stone-700">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">4. Data Security</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">5. Your Legal Rights</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-stone-700">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">6. Cookies</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">7. Third-Party Services</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used. These third parties have access to your personal data only to perform these tasks on our behalf.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">8. Contact Us</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none space-y-2 text-stone-700">
                <li>Email: privacy@medellinai.com</li>
                <li>Address: Medellín, Colombia</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
