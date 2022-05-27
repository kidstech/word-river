package umm3601.wordRiver;
import static com.mongodb.client.model.Filters.eq;
import java.util.ArrayList;
import com.google.common.collect.ImmutableMap;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;


public class StoryController {

    protected final JacksonMongoCollection<Story> storyCollection;

    public StoryController(MongoDatabase database) {
        storyCollection = JacksonMongoCollection.builder().build(database, "stories", Story.class);
      }

    public void postStory(Context ctx) {
        Story story = ctx.bodyValidator(Story.class).check(s -> s.pages != null).get();
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

}
