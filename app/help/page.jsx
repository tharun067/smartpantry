'use client'
import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi'

export default function HelpPage() {
    const [activeSection, setActiveSection] = useState(null)

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section)
    }

    const faqs = [
        {
        question: "How do I add a new container?",
        answer: "Go to the Dashboard and click 'Add Container'. Fill in the product details and weight thresholds."
        },
        {
        question: "How do shopping lists work?",
        answer: "Items are automatically added when products reach their alert weight. You can also manually add items."
        },
        {
        question: "Can I share my pantry with family members?",
        answer: "Yes! Go to the Members page to invite household members."
        },
        {
        question: "How do notifications work?",
        answer: "You'll receive alerts when products are running low, based on your preferred notification method."
        }
    ]

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Help Center</h1>
            
            {/* Contact Support Section */}
            <section className="mb-12 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center p-4 border rounded-lg">
                        <FiMail className="text-indigo-600 mr-3 text-xl" />
                        <div>
                            <h3 className="font-medium">Email Us</h3>
                            <p className="text-sm text-gray-600">support@smartpantry.com</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 border rounded-lg">
                        <FiPhone className="text-indigo-600 mr-3 text-xl" />
                        <div>
                            <h3 className="font-medium">Call Us</h3>
                            <p className="text-sm text-gray-600">(555) 123-4567</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 border rounded-lg">
                        <FiMessageSquare className="text-indigo-600 mr-3 text-xl" />
                        <div>
                            <h3 className="font-medium">Live Chat</h3>
                            <p className="text-sm text-gray-600">Available 9AM-5PM EST</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                            <button
                                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
                                onClick={() => toggleSection(index)}
                            >
                                <h3 className="font-medium text-left">{faq.question}</h3>
                                {activeSection === index ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                            {activeSection === index && (
                                <div className="p-4 bg-white">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Video Tutorials Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Video Tutorials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 aspect-video flex items-center justify-center rounded-lg">
                        <p className="text-gray-500">Getting Started with SmartPantry</p>
                    </div>
                    <div className="bg-gray-100 aspect-video flex items-center justify-center rounded-lg">
                        <p className="text-gray-500">Managing Your Shopping List</p>
                    </div>
                </div>
            </section>
        </div>
    );
}