package umm3601.wordRiver;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.mongojack.Id;
import org.mongojack.ObjectId;


public class LearnerData {
  @ObjectId @Id
  public String _id;  
  public String leanerId;

  public String learnerName;
  // java equivalent of the C# dictionary
  public Map<String, Integer> wordCounts = new HashMap<String, Integer>();
}