const { AppDataSource } = require('../config/database');

const userRepository = AppDataSource.getRepository('User');
const complaintRepository = AppDataSource.getRepository('Complaint');

const getUserDetails = async (req, res) => {
  try {
    const user = await userRepository.findOne({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const complaintsCount = await complaintRepository.count({
      where: { user_id: req.userId }
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      onboarding_stage: user.onboarding_stage,
      complaints_count: complaintsCount,
      onboarding_complete: user.onboarding_complete
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

const updateOnboardingStage = async (req, res) => {
  try {
    const { stage } = req.body;

    if (stage < 0 || stage > 2) {
      return res.status(400).json({ error: 'Invalid stage. Must be 0, 1, or 2' });
    }

    const user = await userRepository.findOne({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.onboarding_stage = stage;
    
    if (stage === 2) {
      user.onboarding_complete = true;
    }

    await userRepository.save(user);

    res.json({
      message: 'Onboarding stage updated successfully',
      onboarding_stage: user.onboarding_stage,
      onboarding_complete: user.onboarding_complete
    });
  } catch (error) {
    console.error('Update onboarding stage error:', error);
    res.status(500).json({ error: 'Failed to update onboarding stage' });
  }
};

module.exports = { getUserDetails, updateOnboardingStage };