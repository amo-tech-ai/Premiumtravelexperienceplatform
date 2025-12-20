import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';

const faqs = [
  {
    question: 'What is the 14-day free trial?',
    answer: 'Try Curator or Concierge risk-free for 14 days. No credit card required. Cancel anytime during the trial period and you won\'t be charged.'
  },
  {
    question: 'Can I switch plans later?',
    answer: 'Yes! Upgrade or downgrade anytime. Your data stays with you, and pricing is prorated. If you upgrade mid-cycle, you\'ll only pay the difference for the remaining period.'
  },
  {
    question: 'What are AI Agents?',
    answer: 'AI Agents are specialized assistants that handle specific tasks: finding restaurants, optimizing routes, tracking budgets, booking reservations, and more. Each tier unlocks more agents with advanced capabilities.'
  },
  {
    question: 'Do I need a credit card for the free plan?',
    answer: 'No. The Explorer plan is completely free forever. No credit card required, no hidden fees, no trial period. Start planning trips immediately.'
  },
  {
    question: 'How does billing work?',
    answer: 'You can pay monthly or annually. Annual plans save 15-17%. Billing happens automatically on your chosen date, and you can cancel anytime from your account settings. You\'ll receive an email receipt for each payment.'
  },
  {
    question: 'Can I collaborate with friends on the free plan?',
    answer: 'The free plan is single-user. Curator allows up to 4 collaborators per trip. Concierge has unlimited collaboration, perfect for large groups or travel agencies.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, Amex, Discover) and PayPal via Stripe, our secure payment processor.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use bank-level encryption (SSL/TLS), and all data is stored securely on Supabase with automatic backups. We never share your data with third parties. You can export or delete your data anytime.'
  },
  {
    question: 'What happens if I cancel?',
    answer: 'You can export all your trip data before canceling. Your account remains active until the end of your billing period. After cancellation, your data is retained for 30 days in case you change your mind.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes. If you\'re not satisfied within the first 30 days, contact us for a full refund, no questions asked. We want you to be completely happy with your choice.'
  }
];

export const PricingFAQ: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
          Questions? We've Got Answers.
        </h2>
        <p className="text-xl text-slate-600">
          Everything you need to know about our pricing and plans
        </p>
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <AccordionItem 
                value={`item-${index}`}
                className="bg-white rounded-2xl border border-slate-200 px-6 hover:border-emerald-300 transition-colors shadow-sm hover:shadow-md"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-700 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-12 border border-emerald-200">
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Chat with our AI Concierge or reach out to our support team. We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all"
            >
              <a href="/concierge">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with AI Concierge
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-xl border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50"
            >
              <a href="mailto:support@ilovemedellín.com">
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
