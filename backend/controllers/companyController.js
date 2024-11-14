import { usersCollection } from "../db.js"; // Ensure the correct path and extension

export const getCompanies = async (req, res) => {
    try {
        const companies = await usersCollection.find({ userType: 'recruiter' }).toArray();
        res.status(200).json(companies); // Return the array directly
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ message: 'Internal server error' }); // Provide a generic error message
    }
};