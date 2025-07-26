'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


const AddAddress = () => {

    // FIX: Removed `null` from useAppContext. It should be called without arguments.
    const { getToken, router } = useAppContext();

    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        pincode: '',
        area: '',
        city: '',
        state: '',
    })

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            // Optional: Basic client-side validation for empty fields (good UX)
            for (const key in address) {
                if (address[key].trim() === '') {
                    toast.error(`Please fill in your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                    return; // Stop submission if any field is empty
                }
            }

            const token = await getToken();

            // --- FIX APPLIED HERE: Correctly pass address data as the second argument ---
            const { data } = await axios.post('/api/user/add-address', {
                address: { // <--- THIS IS THE PRIMARY FIX: Correctly sending the 'address' object
                    ...address,
                    pincode: Number(address.pincode) // Ensure pincode is sent as a number if your schema expects it
                }
            }, { // <--- Headers object is the third argument
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' // Explicitly set Content-Type for JSON body
                }
            });
            // --- END FIX ---

            if (data.success) {
                toast.success(data.message);
                router.push('/cart'); // Redirect on success
            } else {
                // This will now display the specific validation error message from the backend
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Frontend Add Address Error:", error); // Log detailed error
            // Improved error message extraction from Axios error response
            toast.error(error.response?.data?.message || error.message || "An error occurred while adding address.");
        }
    } // <--- ADDED THIS CLOSING CURLY BRACE FOR onSubmitHandler

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
                <form onSubmit={onSubmitHandler} className="w-full">
                    <p className="text-2xl md:text-3xl text-gray-500">
                        Add Shipping <span className="font-semibold text-blue-600">Address</span>
                    </p>
                    <div className="space-y-3 max-w-sm mt-10">
                        <input
                            className="px-2 py-2.5 focus:border-blue-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Full name"
                            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                            value={address.fullName}
                            required // Added required attribute for form validation
                        />
                        <input
                            className="px-2 py-2.5 focus:border-blue-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="tel" // Changed to "tel" for phone number for better mobile experience
                            placeholder="Phone number"
                            onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                            value={address.phoneNumber}
                            required
                        />
                        <input
                            className="px-2 py-2.5 focus:border-blue-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="number" // Changed to number type for pincode
                            placeholder="Pin code"
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                            value={address.pincode}
                            required
                        />
                        <textarea
                            className="px-2 py-2.5 focus:border-blue-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
                            rows={4}
                            placeholder="Address (Area and Street)"
                            onChange={(e) => setAddress({ ...address, area: e.target.value })}
                            value={address.area}
                            required
                        ></textarea>
                        <div className="flex space-x-3">
                            <input
                                className="px-2 py-2.5 focus:border-blue-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                type="text"
                                placeholder="City/District/Town"
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                value={address.city}
                                required
                            />
                            <input
                                className="px-2 py-2.5 focus:border-blue-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                type="text"
                                placeholder="State"
                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                value={address.state}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="max-w-sm w-full mt-6 bg-blue-600 text-white py-3 hover:bg-blue-700 uppercase">
                        Save address
                    </button>
                </form>
                <Image
                    className="md:mr-16 mt-16 md:mt-0"
                    src={assets.my_location_image}
                    alt="my_location_image"
                    width={500} // Added width and height for Next.js Image component optimization
                    height={500} // Example height
                />
            </div>
            <Footer />
        </>
    );
};

export default AddAddress;