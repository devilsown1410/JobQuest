import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 py-4 text-gray-300">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">About MyJob Portal</h3>
          <p className="text-gray-400">
            MyJob Portal is your go-to platform for finding the best job opportunities and connecting with top companies worldwide.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <ul>
            <li className="mb-2">
              <a href="/find-jobs" className="hover:underline">Find Jobs</a>
            </li>
            <li className="mb-2">
              <a href="/companies" className="hover:underline">Companies</a>
            </li>
            <li className="mb-2">
              <a href="/support" className="hover:underline">Support</a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/profile.php?id=100028354182033" className="text-gray-400 hover:text-white">
              <i className="fab fa-facebook-f"></i> Facebook
            </a>
            <a href="https://x.com/rahulsingh23184" className="text-gray-400 hover:text-white">
              <i className="fab fa-twitter"></i> Twitter
            </a>
            <a href="https://www.linkedin.com/in/rahul-b498a9250/" className="text-gray-400 hover:text-white">
              <i className="fab fa-linkedin-in"></i> LinkedIn
            </a>
            <a href="https://www.instagram.com/itz_rahul_singh_28/" className="text-gray-400 hover:text-white">
              <i className="fab fa-instagram"></i> Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center">
        <p>&copy; 2024 JobQuest. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
