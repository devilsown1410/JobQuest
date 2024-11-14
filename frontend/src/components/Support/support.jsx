import React, { useState } from 'react';
import SuccessModal from '../HomePage/SuccessModal';

const Support = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, message } = formData;

        // Basic validation
        if (!name || !email || !message) {
            setError('All fields are required.');
            return;
        }

        // Simulate form submission
        console.log('Form submitted:', formData);
        setShowModal(true);
        setError('');
        setFormData({ name: '', email: '', message: '' }); // Reset form

        // Automatically close the modal after 3 seconds
        setTimeout(() => {
            setShowModal(false);
        }, 3000);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="support-company-area">
                <div className="support-location-img relative bg-blue-800 p-6 rounded-lg mb-6">
                    <div className="support-img-cap">
                        <span className="text-6xl text-white text-center uppercase font-bold leading-tight block mb-2">
                            Support
                        </span>
                        <p className="text-white text-lg text-center leading-tight">We're here to help you!</p>
                    </div>
                </div>
                <div className="right-caption relative mb-10">
                    <div className="support-caption pr-36 lg:pr-16 sm:pr-0 xs:pr-0">
                        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                                    rows="4"
                                    placeholder="Enter your message"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {showModal && (
                <SuccessModal message="Your message has been sent successfully!" onClose={() => setShowModal(false)} />
            )}
        </div>
    );
};

export default Support;