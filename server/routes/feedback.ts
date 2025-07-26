import { RequestHandler } from 'express';
import { EmailService } from '../services/emailService';

interface FeedbackSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  feedbackType: string;
  serviceUsed?: string;
  overallRating: number;
  experienceRating: {
    booking: number;
    service: number;
    communication: number;
    value: number;
  };
  wouldRecommend: string;
  improvementAreas: string[];
  positiveAspects?: string;
  suggestions?: string;
  additionalComments?: string;
  submitted: string;
}

// In-memory storage for demo purposes - replace with database
let feedbacks: FeedbackSubmission[] = [
  {
    id: 'FB001',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 9876543210',
    feedbackType: 'service',
    serviceUsed: 'Homestays',
    overallRating: 5,
    experienceRating: {
      booking: 5,
      service: 5,
      communication: 4,
      value: 5
    },
    wouldRecommend: 'definitely',
    improvementAreas: [],
    positiveAspects: 'Amazing hospitality and authentic local food',
    suggestions: 'Maybe add more activities for families',
    submitted: '2024-01-15T10:30:00Z'
  },
  {
    id: 'FB002',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    feedbackType: 'general',
    serviceUsed: 'Transportation/Drivers',
    overallRating: 4,
    experienceRating: {
      booking: 4,
      service: 4,
      communication: 5,
      value: 4
    },
    wouldRecommend: 'probably',
    improvementAreas: ['Pricing'],
    positiveAspects: 'Very reliable and punctual drivers',
    submitted: '2024-01-14T15:45:00Z'
  }
];

export const submitFeedback: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      feedbackType,
      serviceUsed,
      overallRating,
      experienceRating,
      wouldRecommend,
      improvementAreas,
      positiveAspects,
      suggestions,
      additionalComments
    } = req.body;

    // Validate required fields
    if (!name || !email || !feedbackType || !overallRating || !wouldRecommend) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Generate feedback ID
    const feedbackId = `FB${String(feedbacks.length + 1).padStart(3, '0')}`;
    
    const newFeedback: FeedbackSubmission = {
      id: feedbackId,
      name,
      email,
      phone,
      feedbackType,
      serviceUsed,
      overallRating,
      experienceRating: experienceRating || { booking: 0, service: 0, communication: 0, value: 0 },
      wouldRecommend,
      improvementAreas: improvementAreas || [],
      positiveAspects,
      suggestions,
      additionalComments,
      submitted: new Date().toISOString()
    };

    feedbacks.push(newFeedback);

    // Send email notifications
    try {
      // Email to admin
      const adminEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF5722, #F44336); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Customer Feedback</h1>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Feedback Details</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Feedback ID:</td>
                <td style="padding: 10px; color: #333;">${feedbackId}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Name:</td>
                <td style="padding: 10px; color: #333;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 10px; color: #333;">${email}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Type:</td>
                <td style="padding: 10px; color: #333;">${feedbackType}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Service Used:</td>
                <td style="padding: 10px; color: #333;">${serviceUsed || 'Not specified'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Overall Rating:</td>
                <td style="padding: 10px; color: #333;">${overallRating}/5 stars</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Would Recommend:</td>
                <td style="padding: 10px; color: #333;">${wouldRecommend}</td>
              </tr>
            </table>

            ${experienceRating ? `
            <h3 style="color: #333; margin-bottom: 10px;">Experience Ratings:</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p>Booking Process: ${experienceRating.booking}/5</p>
              <p>Service Quality: ${experienceRating.service}/5</p>
              <p>Communication: ${experienceRating.communication}/5</p>
              <p>Value for Money: ${experienceRating.value}/5</p>
            </div>
            ` : ''}

            ${positiveAspects ? `
            <h3 style="color: #333; margin-bottom: 10px;">What They Liked:</h3>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; color: #333; margin-bottom: 20px;">
              ${positiveAspects.replace(/\n/g, '<br>')}
            </div>
            ` : ''}

            ${suggestions ? `
            <h3 style="color: #333; margin-bottom: 10px;">Suggestions:</h3>
            <div style="background: #fff4e6; padding: 15px; border-radius: 5px; color: #333; margin-bottom: 20px;">
              ${suggestions.replace(/\n/g, '<br>')}
            </div>
            ` : ''}

            ${improvementAreas && improvementAreas.length > 0 ? `
            <h3 style="color: #333; margin-bottom: 10px;">Areas for Improvement:</h3>
            <div style="background: #ffe6e6; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <ul style="margin: 0; padding-left: 20px;">
                ${improvementAreas.map(area => `<li>${area}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            ${additionalComments ? `
            <h3 style="color: #333; margin-bottom: 10px;">Additional Comments:</h3>
            <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; color: #333;">
              ${additionalComments.replace(/\n/g, '<br>')}
            </div>
            ` : ''}
          </div>
        </div>
      `;

      await EmailService.sendEmail(
        'feedback@coastalconnect.in',
        `New Customer Feedback [${feedbackId}] - ${overallRating}/5 stars`,
        adminEmailContent,
        `New Feedback: ${feedbackId}\n\nFrom: ${name} (${email})\nRating: ${overallRating}/5\nType: ${feedbackType}\n\n${positiveAspects ? `Positives: ${positiveAspects}\n` : ''}${suggestions ? `Suggestions: ${suggestions}\n` : ''}`
      );

      // Thank you email to customer
      const customerEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF5722, #F44336); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Your Feedback!</h1>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${name},</h2>
            
            <p style="color: #555; line-height: 1.6;">
              Thank you for taking the time to share your feedback with CoastalConnect. 
              Your input is invaluable in helping us improve our services and create better 
              experiences for all our travelers.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Feedback Summary:</h3>
              <p style="margin: 5px 0; color: #555;"><strong>Feedback ID:</strong> ${feedbackId}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Overall Rating:</strong> ${overallRating}/5 stars</p>
              <p style="margin: 5px 0; color: #555;"><strong>Type:</strong> ${feedbackType}</p>
              ${serviceUsed ? `<p style="margin: 5px 0; color: #555;"><strong>Service:</strong> ${serviceUsed}</p>` : ''}
            </div>
            
            ${overallRating >= 4 ? `
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #2d7738; margin: 0; font-size: 18px;">
                🌟 We're thrilled you had a great experience! 🌟
              </p>
            </div>
            ` : ''}

            ${overallRating <= 3 ? `
            <div style="background: #fff4e6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #d97706; margin: 0;">
                We're sorry your experience wasn't perfect. We'll use your feedback to improve our services.
              </p>
            </div>
            ` : ''}
            
            <p style="color: #555; line-height: 1.6;">
              Your feedback helps us:
            </p>
            <ul style="color: #555; line-height: 1.6;">
              <li>Improve our services and offerings</li>
              <li>Train our team members better</li>
              <li>Create better experiences for future travelers</li>
              <li>Support our local partners and creators</li>
            </ul>
            
            <div style="background: #FF5722; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Stay Connected!</strong></p>
              <p style="margin: 5px 0;">Follow us for travel tips and updates</p>
              <p style="margin: 5px 0;">📧 newsletter@coastalconnect.in</p>
            </div>
            
            <p style="color: #555; margin-top: 30px;">
              Thank you for being part of the CoastalConnect community!<br><br>
              Best regards,<br>
              <strong>The CoastalConnect Team</strong>
            </p>
          </div>
        </div>
      `;

      await EmailService.sendEmail(
        email,
        'Thank You for Your Valuable Feedback - CoastalConnect',
        customerEmailContent,
        `Hi ${name},\n\nThank you for your feedback!\n\nFeedback ID: ${feedbackId}\nOverall Rating: ${overallRating}/5\n\nWe appreciate your input and will use it to improve our services.\n\nBest regards,\nCoastalConnect Team`
      );

    } catch (emailError) {
      console.error('Failed to send feedback emails:', emailError);
      // Continue even if email fails
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        feedbackId: newFeedback.id,
        submitted: newFeedback.submitted
      }
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
};

export const getFeedbacks: RequestHandler = async (req, res) => {
  try {
    const { type, rating, limit = 50 } = req.query;
    
    let filteredFeedbacks = feedbacks;
    
    // Filter by type if provided
    if (type) {
      filteredFeedbacks = filteredFeedbacks.filter(feedback => 
        feedback.feedbackType === type
      );
    }

    // Filter by minimum rating if provided
    if (rating) {
      const minRating = parseInt(rating as string);
      filteredFeedbacks = filteredFeedbacks.filter(feedback => 
        feedback.overallRating >= minRating
      );
    }

    // Sort by submission date (newest first)
    filteredFeedbacks.sort((a, b) => 
      new Date(b.submitted).getTime() - new Date(a.submitted).getTime()
    );

    // Apply limit
    const limitNum = parseInt(limit as string);
    filteredFeedbacks = filteredFeedbacks.slice(0, limitNum);

    res.json({
      success: true,
      data: filteredFeedbacks,
      total: filteredFeedbacks.length
    });

  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feedbacks'
    });
  }
};

export const getFeedbackStats: RequestHandler = async (req, res) => {
  try {
    const totalFeedbacks = feedbacks.length;
    const averageRating = totalFeedbacks > 0 
      ? feedbacks.reduce((sum, feedback) => sum + feedback.overallRating, 0) / totalFeedbacks 
      : 0;

    const recommendationStats = feedbacks.reduce((acc, feedback) => {
      acc[feedback.wouldRecommend] = (acc[feedback.wouldRecommend] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const wouldRecommendPercentage = totalFeedbacks > 0 
      ? Math.round(((recommendationStats.definitely || 0) + (recommendationStats.probably || 0)) / totalFeedbacks * 100)
      : 0;

    const ratingDistribution = feedbacks.reduce((acc, feedback) => {
      acc[feedback.overallRating] = (acc[feedback.overallRating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const customerSatisfaction = totalFeedbacks > 0 
      ? Math.round(feedbacks.filter(f => f.overallRating >= 4).length / totalFeedbacks * 100)
      : 0;

    res.json({
      success: true,
      data: {
        totalFeedbacks,
        averageRating: Math.round(averageRating * 10) / 10,
        wouldRecommendPercentage,
        customerSatisfaction,
        recommendationStats,
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feedback statistics'
    });
  }
};
