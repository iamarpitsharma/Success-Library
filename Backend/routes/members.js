const express = require('express');
const router = express.Router();
const { addMember, getAllMembers, updateMember, deleteMember } = require('../controllers/memberController');
const auth = require('../middleware/auth');

// @route   POST api/members
// @desc    Add a new member
// @access  Private
router.post('/', auth, addMember);

// @route   GET api/members
// @desc    Get all members
// @access  Private
router.get('/', auth, getAllMembers);

// @route   PUT api/members/:id
// @desc    Update a member
// @access  Private
router.put('/:id', auth, updateMember);

// @route   DELETE api/members/:id
// @desc    Delete a member
// @access  Private
router.delete('/:id', auth, deleteMember);

module.exports = router;
