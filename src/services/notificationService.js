const { AppDataSource } = require('../config/database');
const { NotificationType } = require('../entities/Notification');
const { ComplaintStatus } = require('../entities/Complaint');

const notificationRepository = AppDataSource.getRepository('Notification');

const handleComplaintStatusChange = async (complaint, oldStatus, newStatus) => {
  if (newStatus === ComplaintStatus.IN_PROGRESS || newStatus === ComplaintStatus.RESOLVED) {
    const notificationContent = getComplaintStatusNotificationContent(newStatus, complaint);
    
    const notification = notificationRepository.create({
      user_id: complaint.user_id,
      type: NotificationType.COMPLAINT_STATUS,
      title: notificationContent.title,
      body: notificationContent.body,
      is_sent: false,
      metadata: {
        complaint_id: complaint.id,
        old_status: oldStatus,
        new_status: newStatus
      }
    });

    await notificationRepository.save(notification);
    await sendNotification(notification);
  }
};

const getComplaintStatusNotificationContent = (status, complaint) => {
  switch (status) {
    case ComplaintStatus.IN_PROGRESS:
      return {
        title: 'Complaint Update: Now In Progress',
        body: `Your complaint #${complaint.id} regarding ${complaint.complaint_type} is now being processed by our team. We'll keep you updated on the progress.`
      };
    
    case ComplaintStatus.RESOLVED:
      return {
        title: 'Complaint Resolved',
        body: `Great news! Your complaint #${complaint.id} regarding ${complaint.complaint_type} has been resolved. If you have any further questions, please don't hesitate to reach out.`
      };
    
    default:
      return {
        title: 'Complaint Status Update',
        body: `Your complaint #${complaint.id} status has been updated to ${status}.`
      };
  }
};

const sendOnboardingReminder = async (userId, stage, reminderLevel) => {
  const content = getOnboardingReminderContent(stage, reminderLevel);
  
  const notification = notificationRepository.create({
    user_id: userId,
    type: NotificationType.ONBOARDING_REMINDER,
    title: content.title,
    body: content.body,
    is_sent: false,
    metadata: {
      stage,
      reminder_level: reminderLevel
    }
  });

  await notificationRepository.save(notification);
  await sendNotification(notification);
};

const getOnboardingReminderContent = (stage, reminderLevel) => {
  const stageNames = ['Getting Started', 'Basic Setup', 'Advanced Features'];
  const stageName = stageNames[stage] || `Stage ${stage}`;

  const reminderMessages = [
    {
      stage: 0,
      messages: [
        {
          title: '👋 Welcome! Complete Your Profile',
          body: 'Hi there! We noticed you haven\'t completed your profile setup yet. It only takes 2 minutes and will help you get the most out of our platform. Let\'s get started!'
        },
        {
          title: '⏰ 3 Days In - Don\'t Miss Out!',
          body: 'You\'re missing out on some great features! Complete your profile setup to unlock personalized recommendations and start your journey with us.'
        },
        {
          title: '🚀 Last Reminder - Complete Setup Today',
          body: 'This is our final reminder to complete your profile setup. Don\'t let this opportunity pass - finish your onboarding and discover everything we have to offer!'
        }
      ]
    },
    {
      stage: 1,
      messages: [
        {
          title: '✨ Next Step: Basic Configuration',
          body: 'Great progress! Now let\'s set up your basic configurations. This will help personalize your experience and make the platform work better for you.'
        },
        {
          title: '📊 Complete Your Basic Setup',
          body: 'You\'re almost there! Complete your basic configuration to start using advanced features. It won\'t take long, and the benefits are worth it.'
        }
      ]
    },
    {
      stage: 2,
      messages: [
        {
          title: '🎯 Unlock Advanced Features',
          body: 'You\'re doing great! Let\'s explore the advanced features that will take your experience to the next level. Complete this final step to become a power user.'
        },
        {
          title: '⚡ Day 1 Check-in: Advanced Setup',
          body: 'How\'s it going? Don\'t forget to explore our advanced features. They\'re designed to save you time and boost your productivity.'
        },
        {
          title: '🌟 3 Days Left: Complete Your Journey',
          body: 'You\'ve come so far! Complete the advanced setup to unlock all premium features and get the full experience of our platform.'
        },
        {
          title: '🏁 Final Call: Complete Onboarding',
          body: 'This is your last chance to complete the full onboarding process. Finish the advanced setup today and join our community of power users!'
        }
      ]
    }
  ];

  const stageReminders = reminderMessages.find(r => r.stage === stage);
  if (stageReminders && reminderLevel < stageReminders.messages.length) {
    return stageReminders.messages[reminderLevel];
  }

  return {
    title: `${stageName} - Reminder ${reminderLevel + 1}`,
    body: `Don't forget to complete your ${stageName.toLowerCase()} to continue your onboarding journey!`
  };
};

const sendNotification = async (notification) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 NOTIFICATION SENT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`To: User ID ${notification.user_id}`);
  console.log(`Type: ${notification.type}`);
  console.log(`Title: ${notification.title}`);
  console.log(`Body: ${notification.body}`);
  console.log(`Sent At: ${new Date().toISOString()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  notification.is_sent = true;
  await notificationRepository.save(notification);
};

module.exports = {
  handleComplaintStatusChange,
  sendOnboardingReminder,
  sendNotification,
  getComplaintStatusNotificationContent,
  getOnboardingReminderContent
};