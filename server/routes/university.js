const express = require('express');
const router = express.Router();
const University = require('../models/university');
const auth = require('../middleware/auth');

// Search universities
router.get('/search', async (req, res) => {
  try {
    const {
      major,
      country,
      city,
      cost,
      other,
      limit = 20,
      page = 1
    } = req.query;

    // Build search query
    let query = {};

    // Text search for major/program
    if (major) {
      query.$or = [
        { 'majors.name': { $regex: major, $options: 'i' } },
        { tags: { $regex: major, $options: 'i' } }
      ];
    }

    // Country filter
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    // City filter
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Cost filter (if provided)
    if (cost) {
      // Parse cost range and add to query
      if (cost === '<15000') {
        query['tuition.international'] = { $lt: '15000' };
      } else if (cost === '15000-25000') {
        query['tuition.international'] = { 
          $gte: '15000', 
          $lte: '25000' 
        };
      } else if (cost === '25000-35000') {
        query['tuition.international'] = { 
          $gte: '25000', 
          $lte: '35000' 
        };
      } else if (cost === '>35000') {
        query['tuition.international'] = { $gt: '35000' };
      }
    }

    // Other filters
    if (other) {
      if (other === 'online') {
        query.tags = { $in: [/online/i, /distance/i] };
      } else if (other === 'coop') {
        query.tags = { $in: [/coop/i, /co-op/i, /internship/i] };
      } else if (other === 'scholarship') {
        query.tags = { $in: [/scholarship/i, /financial aid/i] };
      } else if (other === 'international') {
        query.tags = { $in: [/international/i, /global/i] };
      }
    }

    // If no specific filters, return all universities
    if (Object.keys(query).length === 0) {
      query = {};
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const universities = await University.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ 'ranking.national': 1, name: 1 });

    const total = await University.countDocuments(query);

    // Transform data for frontend UI
    const transformedUniversities = universities.map(uni => {
      // Get the first major as the primary program
      const primaryMajor = uni.majors && uni.majors.length > 0 ? uni.majors[0] : null;
      
      return {
        _id: uni._id,
        program: primaryMajor ? primaryMajor.name : 'General Studies',
        university: uni.name,
        location: `${uni.city}, ${uni.country}`,
        cost: uni.tuition?.international || 'Contact for pricing',
        match: Math.floor(Math.random() * 30) + 70, // Random match percentage for demo
        isNew: Math.random() > 0.7, // 30% chance of being "new"
        website: uni.website,
        description: uni.description,
        acceptanceRate: uni.overallAcceptanceRate,
        avgGPA: uni.avgGPA,
        avgSAT: uni.avgSAT,
        ranking: uni.ranking,
        tags: uni.tags
      };
    });

    res.json({
      universities: transformedUniversities,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        totalResults: total
      }
    });

  } catch (error) {
    console.error('University search error:', error);
    res.status(500).json({ error: 'Error searching universities' });
  }
});

// Get all universities (with pagination)
router.get('/', async (req, res) => {
  try {
    const { limit = 50, page = 1, sort = 'name' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const universities = await University.find()
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sort);

    const total = await University.countDocuments();

    res.json({
      universities,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        totalResults: total
      }
    });

  } catch (error) {
    console.error('Get universities error:', error);
    res.status(500).json({ error: 'Error fetching universities' });
  }
});

// Get university by ID
router.get('/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }
    res.json(university);
  } catch (error) {
    console.error('Get university error:', error);
    res.status(500).json({ error: 'Error fetching university' });
  }
});

// Create new university (admin only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = req.user.user || req.user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const university = new University(req.body);
    await university.save();
    res.status(201).json(university);
  } catch (error) {
    console.error('Create university error:', error);
    res.status(500).json({ error: 'Error creating university' });
  }
});

// Update university (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = req.user.user || req.user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const university = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.json(university);
  } catch (error) {
    console.error('Update university error:', error);
    res.status(500).json({ error: 'Error updating university' });
  }
});

// Delete university (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = req.user.user || req.user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const university = await University.findByIdAndDelete(req.params.id);
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.json({ message: 'University deleted successfully' });
  } catch (error) {
    console.error('Delete university error:', error);
    res.status(500).json({ error: 'Error deleting university' });
  }
});

// Seed universities with sample data
router.post('/seed', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = req.user.user || req.user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const sampleUniversities = [
      {
        name: 'Harvard University',
        country: 'USA',
        city: 'Cambridge',
        majors: [
          {
            name: 'Computer Science',
            acceptanceRate: '5%',
            avgGPA: '3.9/4.0',
            avgSAT: '1500/1600',
            avgACT: '34/36',
            requirements: ['Strong math background', 'Programming experience']
          },
          {
            name: 'Business Administration',
            acceptanceRate: '6%',
            avgGPA: '3.8/4.0',
            avgSAT: '1480/1600',
            avgACT: '33/36',
            requirements: ['Leadership experience', 'Strong academic record']
          }
        ],
        overallAcceptanceRate: '5%',
        avgGPA: '3.9/4.0',
        avgSAT: '1500/1600',
        avgACT: '34/36',
        tuition: {
          domestic: '$54,768',
          international: '$54,768'
        },
        ranking: {
          national: 1,
          world: 1
        },
        website: 'https://www.harvard.edu',
        description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts.',
        tags: ['Ivy League', 'Research', 'Liberal Arts', 'Scholarship']
      },
      {
        name: 'Stanford University',
        country: 'USA',
        city: 'Stanford',
        majors: [
          {
            name: 'Computer Science',
            acceptanceRate: '4%',
            avgGPA: '3.9/4.0',
            avgSAT: '1480/1600',
            avgACT: '33/36',
            requirements: ['Strong programming skills', 'Innovation mindset']
          }
        ],
        overallAcceptanceRate: '4%',
        avgGPA: '3.9/4.0',
        avgSAT: '1480/1600',
        avgACT: '33/36',
        tuition: {
          domestic: '$56,169',
          international: '$56,169'
        },
        ranking: {
          national: 2,
          world: 2
        },
        website: 'https://www.stanford.edu',
        description: 'Stanford University is a private research university in Stanford, California.',
        tags: ['Research', 'Technology', 'Innovation', 'Co-op']
      },
      {
        name: 'University of Oxford',
        country: 'UK',
        city: 'Oxford',
        majors: [
          {
            name: 'Computer Science',
            acceptanceRate: '8%',
            avgGPA: '3.8/4.0',
            avgSAT: '1450/1600',
            avgACT: '32/36',
            requirements: ['A-Level Mathematics', 'Strong analytical skills']
          }
        ],
        overallAcceptanceRate: '17%',
        avgGPA: '3.8/4.0',
        avgSAT: '1450/1600',
        avgACT: '32/36',
        tuition: {
          domestic: '£9,250',
          international: '£39,010'
        },
        ranking: {
          national: 1,
          world: 3
        },
        website: 'https://www.ox.ac.uk',
        description: 'The University of Oxford is a collegiate research university in Oxford, England.',
        tags: ['Ancient', 'Research', 'Liberal Arts', 'International']
      },
      {
        name: 'York University',
        country: 'Canada',
        city: 'Toronto',
        majors: [
          {
            name: 'Engineering',
            acceptanceRate: '15%',
            avgGPA: '3.5/4.0',
            avgSAT: '1300/1600',
            avgACT: '28/36',
            requirements: ['Strong math and science background']
          },
          {
            name: 'Commerce',
            acceptanceRate: '20%',
            avgGPA: '3.3/4.0',
            avgSAT: '1250/1600',
            avgACT: '26/36',
            requirements: ['Business aptitude', 'Leadership potential']
          }
        ],
        overallAcceptanceRate: '18%',
        avgGPA: '3.4/4.0',
        avgSAT: '1275/1600',
        avgACT: '27/36',
        tuition: {
          domestic: '$8,000',
          international: '$11,256'
        },
        ranking: {
          national: 15,
          world: 401
        },
        website: 'https://www.yorku.ca',
        description: 'York University is a public research university in Toronto, Ontario, Canada.',
        tags: ['Research', 'Co-op', 'International', 'Scholarship']
      },
      {
        name: 'University of Waterloo',
        country: 'Canada',
        city: 'Waterloo',
        majors: [
          {
            name: 'Software Engineering',
            acceptanceRate: '8%',
            avgGPA: '3.8/4.0',
            avgSAT: '1400/1600',
            avgACT: '30/36',
            requirements: ['Excellent programming skills', 'Co-op experience preferred']
          }
        ],
        overallAcceptanceRate: '12%',
        avgGPA: '3.6/4.0',
        avgSAT: '1350/1600',
        avgACT: '29/36',
        tuition: {
          domestic: '$12,000',
          international: '$20,500'
        },
        ranking: {
          national: 8,
          world: 201
        },
        website: 'https://www.uwaterloo.ca',
        description: 'The University of Waterloo is a public research university in Waterloo, Ontario, Canada.',
        tags: ['Technology', 'Co-op', 'Innovation', 'Research']
      }
    ];

    // Clear existing data and insert sample data
    await University.deleteMany({});
    const universities = await University.insertMany(sampleUniversities);

    res.json({
      message: `Seeded ${universities.length} universities successfully`,
      count: universities.length
    });

  } catch (error) {
    console.error('Seed universities error:', error);
    res.status(500).json({ error: 'Error seeding universities' });
  }
});

module.exports = router; 