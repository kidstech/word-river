package umm3601.wordRiver;
import static com.mongodb.client.model.Filters.eq;
import com.mongodb.client.MongoDatabase;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

public class LearnerDataController {

  protected final JacksonMongoCollection<LearnerData> learnerDataCollection;

/**
*Construct a controller for learnerData
* @param learnerDatabase 
*/
public LearnerDataController(MongoDatabase userDatabase) {
    learnerDataCollection = JacksonMongoCollection.builder().build(userDatabase, "learnerdata", LearnerData.class);
}

/*
debugging findings:
learnerDataCollection does seem to actually have a document in it...
not sure why I can't seem to actuallly get it out of the collection
might just not be parsing correctly?
*/
public void getLearnerData(Context ctx) {
    String learnerId = ctx.pathParam("id");
    System.out.println("learner id from context: " + learnerId);
    LearnerData data = learnerDataCollection.find(eq("learnerId", learnerId)).first();
        if(data == null) {
            throw new NotFoundResponse("The LearnerData was not found in the system.");
        }
    System.out.println("learnerCollection functions should have been called.");
    ctx.json(data);
    }
}