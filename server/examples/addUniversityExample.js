// Example of how to add a single university with complex majors structure
const University = require('../models/university');

async function addSingleUniversity() {
  const newUniversity = {
    name: "MIT (Massachusetts Institute of Technology)",
    country: "United States",
    province: "Massachusetts", 
    city: "Cambridge",
    majors: [
      {
        name: "Computer Science and Engineering",
        acceptanceRate: "3.9%",
        avgGPA: "3.97",
        avgSAT: "1540",
        avgACT: "35",
        requirements: [
          "Advanced mathematics (Calculus, Linear Algebra)",
          "Strong programming skills",
          "AP Computer Science A and B",
          "Physics and Chemistry",
          "Research or project experience",
          "Competitive programming experience"
        ]
      },
      {
        name: "Mechanical Engineering",
        acceptanceRate: "4.2%",
        avgGPA: "3.95",
        avgSAT: "1530",
        avgACT: "34",
        requirements: [
          "Advanced mathematics",
          "Physics (Mechanics, Electricity & Magnetism)",
          "Chemistry",
          "Engineering design experience",
          "AP Physics C",
          "Robotics or mechanical projects"
        ]
      },
      {
        name: "Physics",
        acceptanceRate: "4.8%",
        avgGPA: "3.96",
        avgSAT: "1535",
        avgACT: "35",
        requirements: [
          "Advanced mathematics",
          "AP Physics C (Mechanics and E&M)",
          "AP Calculus BC",
          "Research experience in physics",
          "Physics competitions",
          "Strong analytical thinking"
        ]
      }
    ],
    overallAcceptanceRate: "3.9%",
    avgGPA: "3.96",
    avgSAT: "1535",
    avgACT: "35",
    tuition: {
      domestic: "$57,986",
      international: "$57,986"
    },
    ranking: {
      national: 1,
      world: 2
    },
    website: "https://www.mit.edu",
    description: "MIT is a private research university in Cambridge, Massachusetts, known for its research and education in physical sciences and engineering.",
    imageUrl: "https://example.com/mit.jpg",
    tags: ["Private", "Research University", "Engineering", "Technology", "Science"]
  };

  try {
    const university = new University(newUniversity);
    const savedUniversity = await university.save();
    console.log('University added successfully:', savedUniversity.name);
    return savedUniversity;
  } catch (error) {
    console.error('Error adding university:', error.message);
    throw error;
  }
}

// Example of how to add multiple universities at once
async function addMultipleUniversities() {
  const universities = [
    {
      name: "UC Berkeley",
      country: "United States",
      province: "California",
      city: "Berkeley",
      majors: [
        {
          name: "Computer Science",
          acceptanceRate: "8.5%",
          avgGPA: "3.89",
          avgSAT: "1450",
          avgACT: "32",
          requirements: [
            "Strong mathematics background",
            "Programming experience",
            "AP Computer Science",
            "Extracurricular activities"
          ]
        }
      ],
      overallAcceptanceRate: "14.5%",
      avgGPA: "3.89",
      avgSAT: "1450",
      avgACT: "32",
      tuition: {
        domestic: "$14,312",
        international: "$44,066"
      },
      ranking: {
        national: 22,
        world: 13
      },
      website: "https://www.berkeley.edu",
      description: "UC Berkeley is a public research university in Berkeley, California.",
      imageUrl: "https://example.com/berkeley.jpg",
      tags: ["Public", "Research University", "California", "UC System"]
    },
    {
      name: "Yale University",
      country: "United States",
      province: "Connecticut",
      city: "New Haven",
      majors: [
        {
          name: "Economics",
          acceptanceRate: "4.6%",
          avgGPA: "3.95",
          avgSAT: "1540",
          avgACT: "35",
          requirements: [
            "Strong mathematics background",
            "AP Calculus",
            "Economics coursework",
            "Analytical thinking skills"
          ]
        }
      ],
      overallAcceptanceRate: "4.6%",
      avgGPA: "3.95",
      avgSAT: "1540",
      avgACT: "35",
      tuition: {
        domestic: "$59,950",
        international: "$59,950"
      },
      ranking: {
        national: 3,
        world: 8
      },
      website: "https://www.yale.edu",
      description: "Yale University is a private Ivy League research university in New Haven, Connecticut.",
      imageUrl: "https://example.com/yale.jpg",
      tags: ["Ivy League", "Private", "Research University", "Liberal Arts"]
    }
  ];

  try {
    const savedUniversities = await University.insertMany(universities);
    console.log(`Successfully added ${savedUniversities.length} universities`);
    return savedUniversities;
  } catch (error) {
    console.error('Error adding universities:', error.message);
    throw error;
  }
}

module.exports = { addSingleUniversity, addMultipleUniversities };


