package umm3601.wordRiver;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;

import org.mongojack.ObjectId;

public class Story {
  @ObjectId @Id
    public String _id;
    public String learnerId;
    public String storyName;
    public String font;
    public String timeSubmitted;
    public ArrayList<String> sentences;
}
