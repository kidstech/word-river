package umm3601.wordRiver;

import java.util.ArrayList;
import java.util.List;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;


public class StoryController {

    protected final JacksonMongoCollection<Story> storyCollection;

    public StoryController(MongoDatabase database) {
        storyCollection = JacksonMongoCollection.builder().build(database, "stories", Story.class);
      }

    public void postStory(Context ctx) {
        Story story = ctx.bodyValidator(Story.class).get();

        if(story.pages != null)
        {
            storyCollection.insert(story);
        }
        ctx.status(201);
        System.out.println("story has been posted!");
    }

    
}
