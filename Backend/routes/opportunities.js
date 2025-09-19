const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

// @route   POST /api/opportunities/create
// @desc    Create a new opportunity (for NGOs)
// @access  Private (requires token)
router.post("/create", authMiddleware, async (req, res) => {
  const { title, description, required_skills, duration, location } = req.body;
  const ngoId = req.user.id;

  try {
    const newOpportunity = new Opportunity({
      title,
      ngo_id: ngoId,
      description,
      required_skills,
      duration,
      location,
    });
    await newOpportunity.save();
    res.json(newOpportunity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/opportunities/:id/edit
// @desc    Update an existing opportunity
// @access  Private (requires token)
router.put("/:id/edit", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, required_skills, duration, location } = req.body;

  try {
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ msg: 'Opportunity not found' });
    }

    if (opportunity.ngo_id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to edit this opportunity' });
    }

    opportunity.title = title || opportunity.title;
    opportunity.description = description || opportunity.description;
    opportunity.required_skills = required_skills || opportunity.required_skills;
    opportunity.duration = duration || opportunity.duration;
    opportunity.location = location || opportunity.location;

    await opportunity.save();
    res.json(opportunity);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/opportunities
// @desc    Get all opportunities
// @access  Public
router.get("/", async (req, res) => {
  try {
    const opportunities = await Opportunity.find().populate('ngo_id', 'organization_name');
    
    // Filter out opportunities from unknown NGOs
    const validOpportunities = opportunities.filter(opp => opp.ngo_id && opp.ngo_id.organization_name);
    res.json(validOpportunities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/opportunities/ngo
// @desc    Get all opportunities for a specific NGO
// @access  Private (requires token)
router.get("/ngo", authMiddleware, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ ngo_id: req.user.id });
    res.json(opportunities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/opportunities/apply
// @desc    Submit an application for an opportunity
// @access  Private (requires token)
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    // Check if the user is a volunteer
    const user = await User.findById(req.user.id);
    if (user.role !== 'volunteer') {
      return res.status(401).json({ msg: 'Only volunteers can apply for opportunities' });
    }
    
    const { opportunityId } = req.body;
    const volunteerId = req.user.id;

    const existingApplication = await Application.findOne({
      opportunityId,
      volunteerId,
    });
    if (existingApplication) {
      return res.status(400).json({ msg: "You have already applied for this opportunity" });
    }

    const newApplication = new Application({
      opportunityId,
      volunteerId,
      status: "pending",
    });

    await newApplication.save();

    res.json({ msg: "Application submitted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/opportunities/applications/me
// @desc    Get all applications for the logged-in volunteer
// @access  Private (requires token)
router.get("/applications/me", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ volunteerId: req.user.id })
      .populate({
        path: 'opportunityId',
        select: 'title description ngo_id',
        populate: {
          path: 'ngo_id',
          select: 'organization_name'
        }
      });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/opportunities/applications/ngo
// @desc    Get all applications for a specific NGO's opportunities
// @access  Private (requires token)
router.get("/applications/ngo", authMiddleware, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ ngo_id: req.user.id });
    const opportunityIds = opportunities.map(opp => opp._id);
    const applications = await Application.find({ opportunityId: { $in: opportunityIds } })
      .populate('volunteerId', 'name email skills location')
      .populate('opportunityId', 'title');
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// @route   GET /api/opportunities/:id
// @desc    Get a single opportunity by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      "ngo_id",
      "organization_name"
    );

    if (!opportunity) {
      return res.status(404).json({ msg: "Opportunity not found" });
    }

    res.json(opportunity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// @route   PUT /api/opportunities/applications/:id/status
// @desc    Update the status of an application
// @access  Private (requires token)
router.put("/applications/:id/status", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findById(id).populate('opportunityId');

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }
    
    if (application.opportunityId.ngo_id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to change this application status' });
    }
    
    application.status = status;
    await application.save();

    res.json({ msg: `Application status updated to ${status}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;