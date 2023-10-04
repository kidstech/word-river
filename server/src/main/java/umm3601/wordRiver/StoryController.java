package umm3601.wordRiver;
import static com.mongodb.client.model.Filters.eq;
import java.util.ArrayList;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.Context;


public class StoryController {

    protected final JacksonMongoCollection<Story> storyCollection;

    public StoryController(MongoDatabase database) {
        storyCollection = JacksonMongoCollection.builder().build(database, "stories", Story.class);
      }

    public void postStory(Context ctx) {
        Story story = ctx.bodyValidator(Story.class).check(s -> s.sentences != null).get();
        storyCollection.insert(story);
        ctx.status(201);
        System.out.println("Story has been posted!");
        System.out.println(story.font);
    }

    public void getLearnerStories(Context ctx) {
      String learnerId = ctx.pathParam("learnerId");
      ArrayList<Story> theLearnerStories = new ArrayList<>();
      FindIterable<Story> learnerStories = storyCollection.find(eq("learnerId", learnerId));
      for(Story st : learnerStories) {
        if(st.learnerId.equals(learnerId)) {
          theLearnerStories.add(st);
        }
      }
      ctx.status(200);
      ctx.json(learnerStories);
    }

    public void getLearnerStory(Context ctx) {
      String storyId = ctx.pathParam("storyId");
      String storyName = ctx.pathParam("storyName");
      Story theStory = new Story();
      FindIterable<Story> matchedStories = storyCollection.find(eq("storyName", storyName));
      for(Story story: matchedStories) {
        if(story._id.equals(storyId)) {
          theStory = story;
        }
      }
      ctx.json(theStory);
    }

    public String getRecentStory(String learnerId) {
      Story recentStory = storyCollection.find(eq("learnerId", learnerId)).sort(new Document("_id", -1)).first();
      System.out.println(recentStory);
      if(recentStory == null) {
        //This is necessary in the instance where the learner needs to get their sentences but has not constructed their first story
        return "oops";
      }
      //System.out.println("The most recent time was actually found " + recentStory.timeSubmitted);
      return recentStory.timeSubmitted;
    }
  }
