package umm3601.wordRiver;
import org.mongojack.Id;
import org.mongojack.ObjectId;
import java.util.List;

public class Sentence {
    @ObjectId @Id
    // sentence mongo object Id
    public String mongoObjectId;
    public String sentenceId;
    // the sentence contents
    public String sentenceText;
    // the time the sentence was submitted in storybuilder
    public String timeSubmitted;
    // the object id for the learner that submitted the sentence
    public String learnerId;
    public List<Word> words;
    public List<String> selectedWordForms;
    // mongo object Id of associated user
    public String userId;
    public List<String> contextPackIds;
}