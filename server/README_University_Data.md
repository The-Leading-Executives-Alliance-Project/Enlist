# University Data Management

## What is `trim`?

`trim: true` is a Mongoose schema option that automatically removes whitespace from the beginning and end of string values before saving them to the database.

**Example:**
- Input: `"  Harvard University  "` 
- Saved: `"Harvard University"`

This helps keep your data clean and consistent.

## How to Add University Data

### Method 1: Using the Seed Script (Recommended for initial setup)

1. **Run the seed script:**
   ```bash
   cd server
   npm run seed
   ```

2. **Or run directly:**
   ```bash
   node scripts/seedUniversities.js
   ```

This will add sample universities (Harvard, Stanford) to your database.

### Method 2: Using API Endpoints

1. **Add a single university:**
   ```bash
   POST /api/universities
   Content-Type: application/json
   
   {
     "name": "MIT",
     "country": "United States",
     "province": "Massachusetts",
     "city": "Cambridge",
     "majors": [
       {
         "name": "Computer Science",
         "acceptanceRate": "3.9%",
         "avgGPA": "3.97",
         "avgSAT": "1540",
         "avgACT": "35",
         "requirements": [
           "Advanced mathematics",
           "Programming experience",
           "AP Computer Science"
         ]
       }
     ],
     "overallAcceptanceRate": "3.9%",
     "avgGPA": "3.96",
     "avgSAT": "1535",
     "avgACT": "35",
     "tuition": {
       "domestic": "$57,986",
       "international": "$57,986"
     },
     "ranking": {
       "national": 1,
       "world": 2
     },
     "website": "https://www.mit.edu",
     "description": "MIT is a private research university...",
     "imageUrl": "https://example.com/mit.jpg",
     "tags": ["Private", "Research University", "Engineering"]
   }
   ```

2. **Add multiple universities:**
   ```bash
   POST /api/universities/bulk
   Content-Type: application/json
   
   [
     {
       "name": "UC Berkeley",
       "country": "United States",
       "province": "California",
       "city": "Berkeley",
       "majors": [...],
       ...
     },
     {
       "name": "Yale University",
       "country": "United States",
       "province": "Connecticut",
       "city": "New Haven",
       "majors": [...],
       ...
     }
   ]
   ```

### Method 3: Programmatically in Code

```javascript
const { University } = require('./models/university');

// Add single university
const newUniversity = new University({
  name: "MIT",
  country: "United States",
  province: "Massachusetts",
  city: "Cambridge",
  majors: [
    {
      name: "Computer Science",
      acceptanceRate: "3.9%",
      avgGPA: "3.97",
      avgSAT: "1540",
      avgACT: "35",
      requirements: [
        "Advanced mathematics",
        "Programming experience",
        "AP Computer Science"
      ]
    }
  ],
  // ... other fields
});

await newUniversity.save();

// Add multiple universities
const universities = [
  // ... array of university objects
];
await University.insertMany(universities);
```

## University Schema Structure

### Required Fields:
- `name` (String, unique, trimmed)
- `country` (String, required, trimmed)
- `province` (String, required)

### Optional Fields:
- `city` (String, trimmed)
- `majors` (Array of major objects)
- `overallAcceptanceRate` (String, default: 'N/A')
- `avgGPA` (String, default: 'N/A')
- `avgSAT` (String, default: 'N/A')
- `avgACT` (String, default: 'N/A')
- `tuition` (Object with domestic/international)
- `ranking` (Object with national/world)
- `website` (String)
- `description` (String)
- `imageUrl` (String)
- `tags` (Array of strings)

### Major Object Structure:
```javascript
{
  name: String,
  acceptanceRate: String,
  avgGPA: String,
  avgSAT: String,
  avgACT: String,
  requirements: [String]  // Array of requirement strings
}
```

## API Endpoints

- `GET /api/universities` - Get all universities
- `POST /api/universities` - Add a single university
- `POST /api/universities/bulk` - Add multiple universities
- `GET /api/universities/:id` - Get university by ID
- `PUT /api/universities/:id` - Update university
- `DELETE /api/universities/:id` - Delete university

## Examples

See `examples/addUniversityExample.js` for detailed examples of how to add universities with complex majors data.

## Notes

- The `trim` option automatically cleans whitespace from string fields
- All major fields are optional except `name`
- The schema includes timestamps (`createdAt`, `updatedAt`)
- Text search is enabled on name, country, city, major names, and tags
- Unique constraint on university names prevents duplicates


