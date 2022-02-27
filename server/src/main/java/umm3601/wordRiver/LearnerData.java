package umm3601.wordRiver;
import java.util.Map;
import org.mongojack.Id;
import org.mongojack.ObjectId;


public class LearnerData {
  @ObjectId @Id
  public String _id;
  public String learnerId;

  public String learnerName;
  // mapping of each word a learner has heard to the number of times they've heard it
  public Map<String, Integer> wordCounts;
  // mapping of the date gotten at the start of their session with the time elapsed upon exiting the application
  public Map<String, String> sessionTimes;
}
