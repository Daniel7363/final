
import { supabase } from "@/integrations/supabase/client";
import { recordUserActivity } from "./userService";

// Record exam completion
export const recordExamCompletion = async (
  subjectId: string,
  score: number,
  totalQuestions: number,
  examTitle: string
) => {
  try {
    // Calculate score percentage
    const scorePercentage = Math.round((score / totalQuestions) * 100);
    
    // Insert directly to our user_exams table
    // This will trigger our database functions to update progress and activities
    try {
      // Call the RPC function using a more generic approach
      const { data, error } = await supabase.functions.invoke("insert_user_exam", {
        body: { 
          p_subject_id: subjectId,
          p_score: score,
          p_total_questions: totalQuestions
        }
      });
        
      if (error) {
        console.error('Failed to insert exam into database:', error);
        // Fallback to the activity record if database insert failed
        await recordUserActivity(
          'exam_completed',
          examTitle,
          subjectId,
          { 
            score: scorePercentage, 
            totalQuestions,
            completed: true
          }
        );
      }
    } catch (error) {
      console.log('Failed to record exam in Supabase, will use local storage');
      // The AppContext will handle storing in localStorage
    }
    
    return true;
  } catch (error) {
    console.error('Error recording exam completion:', error);
    return false;
  }
};

// Record topic started
export const recordTopicStarted = async (
  subjectId: string,
  topicTitle: string
) => {
  try {
    // Record a small study session (5 minutes) to trigger our database functions
    try {
      // Call the RPC function using a more generic approach
      const { data, error } = await supabase.functions.invoke("insert_study_session", {
        body: {
          p_subject_id: subjectId,
          p_duration: 5
        }
      });
        
      if (error) {
        console.error('Failed to insert study session:', error);
        // Fallback to activity record
        await recordUserActivity(
          'topic_started',
          topicTitle,
          subjectId,
          { started: true }
        );
      }
    } catch (error) {
      console.log('Failed to record topic activity in Supabase, will use local storage');
      // The AppContext will handle storing in localStorage
    }
    
    return true;
  } catch (error) {
    console.error('Error recording topic started:', error);
    return false;
  }
};

// Record resource downloaded
export const recordResourceDownloaded = async (
  subjectId: string,
  resourceTitle: string,
  resourceType: string
) => {
  try {
    // Use our user_activities table directly through RPC
    try {
      // Call the RPC function using a more generic approach
      const { data, error } = await supabase.functions.invoke("insert_user_activity", {
        body: {
          p_activity_type: 'resource_downloaded',
          p_subject_id: subjectId,
          p_title: resourceTitle,
          p_details: JSON.stringify({ type: resourceType })
        }
      });
        
      if (error) {
        console.error('Failed to record resource download:', error);
      }
    } catch (error) {
      console.log('Failed to record resource download in Supabase, will use local storage');
    }
    
    return true;
  } catch (error) {
    console.error('Error recording resource downloaded:', error);
    return false;
  }
};

// Record study session
export const recordStudySession = async (
  subjectId: string,
  durationMinutes: number
) => {
  try {
    // Insert study session into our database using RPC
    try {
      // Call the RPC function using a more generic approach
      const { data, error } = await supabase.functions.invoke("insert_study_session", {
        body: {
          p_subject_id: subjectId,
          p_duration: durationMinutes
        }
      });
        
      if (error) {
        console.error('Failed to record study session:', error);
      }
    } catch (error) {
      console.log('Failed to record study session in Supabase, will use local storage');
    }
    
    return true;
  } catch (error) {
    console.error('Error recording study session:', error);
    return false;
  }
};
