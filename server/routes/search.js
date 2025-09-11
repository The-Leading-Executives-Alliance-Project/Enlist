const express = require('express');
const router = express.Router();
const University = require('../models/university');

// GET all universities
router.get('/', async (req, res) => {
  try {
    const universities = await University.find({});
    res.json(universities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET universities with search filters
router.get('/universities', async(req,res) =>{
  try{
    const {keyword, discipline, province, city, cost, other } = req.query;
    let query ={};
    if(keyword){
      // 方法1: 使用MongoDB全文搜索，确保包含所有词
      const searchTerms = keyword.split(' ').map(term => `"${term}"`).join(' ');
      query.$text = {$search: searchTerms};     
      console.log('🔤 Keyword search with all terms:', searchTerms);
    }
    if(discipline){
      query['majors.name'] = { $regex: discipline, $options: 'i' };
      console.log('🎓 Added discipline filter (searching in majors.name):', discipline);
    }
    if(province){
      query.province = province;
    }
    if(city){
      query.city = city;
    }
    if(cost){
      const costQuery = {};
      switch(cost) {
        case '<15000':
          costQuery.$lt = 15000;
          break;
        case '15000-25000':
          costQuery.$gte = 15000;
          costQuery.$lt = 25000;
          break;
        case '25000-35000':
          costQuery.$gte = 25000;
          costQuery.$lt = 35000;
          break;
        case '>35000':
          costQuery.$gte = 35000;
          break;
      }
      query['tuition.domestic'] = costQuery;
    }
    if(other){
      query.other = other;
    }
    const unis = await University.find(query);
    res.json(unis);
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
})


module.exports = router;
