import React from 'react';
import { motion } from 'motion/react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-stone-600 text-lg mb-12">
            Last updated: December 22, 2024
          </p>

          <div className="prose prose-stone max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                By accessing and using Medellín AI Concierge ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">2. Use License</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                Permission is granted to temporarily access the materials (information or software) on Medellín AI Concierge for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-stone-700">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">3. User Accounts</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">4. Content</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post to the Service, including its legality, reliability, and appropriateness.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">5. Prohibited Uses</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                You may not use the Service:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-stone-700">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial or state regulations</li>
                <li>To infringe upon or violate our intellectual property rights</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">6. AI-Generated Content</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                Our Service uses artificial intelligence to provide recommendations and information. While we strive for accuracy, AI-generated content may not always be completely accurate or up-to-date. Users should verify important information independently.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">7. Intellectual Property</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Medellín AI Concierge and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">8. Termination</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                In no event shall Medellín AI Concierge, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">10. Changes to Terms</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-stone-900 mb-4">11. Contact Us</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none space-y-2 text-stone-700">
                <li>Email: legal@medellinai.com</li>
                <li>Address: Medellín, Colombia</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
