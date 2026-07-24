// Seeds the database with the same demo data the old frontend had hardcoded,
// so the app looks populated immediately after deployment.
// Run with: npm run seed
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import SponsorProfile from "../models/SponsorProfile.js";

const organizers = [
  { name: "Aarav Mehta", email: "aarav@iitbombay.edu", password: "password123", role: "organizer", org: "IIT Bombay" },
  { name: "Neha Iyer", email: "neha@iitdelhi.edu", password: "password123", role: "organizer", org: "IIT Delhi" },
  { name: "Riya Sharma", email: "riya@vitvellore.edu", password: "password123", role: "organizer", org: "VIT Vellore" },
  { name: "Karan Patel", email: "karan@bitspilani.edu", password: "password123", role: "organizer", org: "BITS Pilani" },
];

const sponsors = [
  {
    name: "Priya Nair", email: "priya@freshbrew.com", password: "password123", role: "sponsor", org: "FreshBrew Café",
    profile: { name: "FreshBrew Café", category: "Food & Beverage", location: "Mumbai", budget: "₹50K – ₹2L", rating: 4.8, description: "Artisanal coffee brand looking to reach college students through event stalls and sampling.", interests: ["Cultural Fests", "Tech Events"], images: ["https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200&h=200&fit=crop"] },
  },
  {
    name: "Rohan Gupta", email: "rohan@codecraft.com", password: "password123", role: "sponsor", org: "CodeCraft Academy",
    profile: { name: "CodeCraft Academy", category: "EdTech", location: "Bangalore", budget: "₹1L – ₹5L", rating: 4.9, description: "Online coding bootcamp eager to sponsor hackathons and tech competitions.", interests: ["Hackathons", "Tech Fests"], images: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop"] },
  },
];

const seed = async () => {
  await connectDB();
  console.log("[seed] Clearing existing demo collections...");
  await Promise.all([User.deleteMany({}), Event.deleteMany({}), SponsorProfile.deleteMany({})]);

  console.log("[seed] Creating organizers...");
  const createdOrganizers = await User.create(organizers);

  console.log("[seed] Creating sponsors + profiles...");
  const createdSponsors = [];
  for (const s of sponsors) {
    const { profile, ...userData } = s;
    const user = await User.create(userData);
    await SponsorProfile.create({ ...profile, user: user._id });
    createdSponsors.push(user);
  }

  console.log("[seed] Creating events...");
  await Event.create([
    {
      organizer: createdOrganizers[0]._id,
      name: "TechFest 2026", college: "IIT Bombay", location: "Mumbai", date: "Apr 15–17, 2026",
      attendees: "15,000+", category: "Tech", budget: "₹2L – ₹10L",
      description: "India's largest science and technology festival with coding competitions, robotics, and workshops.",
      images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop"],
      stallTypes: ["Food Court", "Tech Demo Booths", "Merch Stalls", "Startup Showcase", "Gaming Zone"],
      sponsorsRequired: ["Title Sponsor", "Co-Sponsor", "Food Partner", "Tech Partner", "Media Partner"],
      highlights: ["3-day event", "50+ competitions", "Celebrity keynotes", "Live project demos"],
    },
    {
      organizer: createdOrganizers[1]._id,
      name: "E-Summit", college: "IIT Delhi", location: "New Delhi", date: "Mar 20–22, 2026",
      attendees: "8,000+", category: "Business", budget: "₹1L – ₹5L",
      description: "Entrepreneurship summit with startup pitches, investor meetups, and panel discussions.",
      images: ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop"],
      stallTypes: ["Startup Booths", "Investor Lounge", "Networking Zone", "Workshop Area"],
      sponsorsRequired: ["Title Sponsor", "Innovation Partner", "Networking Partner", "Prize Sponsor"],
      highlights: ["Investor meetups", "Pitch competitions", "Panel discussions", "Networking sessions"],
    },
    {
      organizer: createdOrganizers[2]._id,
      name: "Riviera 2026", college: "VIT Vellore", location: "Vellore", date: "Jun 5–8, 2026",
      attendees: "25,000+", category: "Cultural", budget: "₹3L – ₹15L",
      description: "One of South India's biggest cultural and technical fests with celebrity performances.",
      images: ["https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=400&fit=crop"],
      stallTypes: ["Food Court", "Gaming Arena", "Art & Craft", "DJ Stage"],
      sponsorsRequired: ["Title Sponsor", "Entertainment Partner", "Food Partner", "Gaming Partner"],
      highlights: ["25,000+ footfall", "Celebrity night", "Gaming tournaments", "Flash mobs"],
    },
    {
      organizer: createdOrganizers[3]._id,
      name: "Hackathon X", college: "BITS Pilani", location: "Pilani", date: "Apr 10–11, 2026",
      attendees: "2,000+", category: "Tech", budget: "₹50K – ₹3L",
      description: "24-hour hackathon bringing together the best developers from across the country.",
      images: ["https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop"],
      stallTypes: ["Snack Station", "Energy Drinks Zone", "Hardware Lab", "Chill Lounge"],
      sponsorsRequired: ["Title Sponsor", "Prize Sponsor", "Tech Partner", "Refreshments Partner"],
      highlights: ["24-hour coding", "₹5L+ prize pool", "Mentorship sessions", "Job offers"],
    },
  ]);

  console.log("[seed] Done. Demo login (all users): password123");
  console.log("[seed] Organizer login example: aarav@iitbombay.edu / password123");
  console.log("[seed] Sponsor login example: priya@freshbrew.com / password123");

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
