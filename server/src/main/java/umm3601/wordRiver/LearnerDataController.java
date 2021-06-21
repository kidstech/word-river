package umm3601.wordRiver;

import static com.mongodb.client.model.Filters.eq;

import java.util.HashMap;

import com.mongodb.client.MongoDatabase;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import java.util.regex.Pattern;

public class LearnerDataController {

  protected final JacksonMongoCollection<LearnerData> learnerDataCollection;


  /**
   * Construct a controller for learnerData
   *
   * @param database
   */
  public LearnerDataController(MongoDatabase database) {
    learnerDataCollection = JacksonMongoCollection.builder().build(database, "learnerdata", LearnerData.class);
  }

  /**
   * Get the learnerdata for a learner
   *
   * @param ctx
   */
  public void getLearnerData(Context ctx) {
    String learnerId = ctx.pathParam("learnerId");
    LearnerData data = null;
    data = learnerDataCollection.find(eq("learnerId", learnerId)).first();
    // if we didn't find anything, but the learnerId seems legit... (13 digits exactly)
    if (data == null && Pattern.matches("\\b\\d{13}\\b", learnerId)) {
      // create new learnerData in our DB
      createEmptyLearnerData(learnerId);
      // and then send that info back (really just want an objectId)
      getLearnerData(ctx);
      return;
    }
    else if (data == null)
    {
      throw new NotFoundResponse("The LearnerData was not found in the system.");
    }
    ctx.json(data);
  }
  
  public void createEmptyLearnerData(String learnerId)
  {
    LearnerData learnerData = new LearnerData();
    learnerData.learnerId = learnerId;
    learnerData.learnerName = "";
    learnerData.wordCounts = new HashMap<String, Integer>();
    learnerData.sessionTimes = new HashMap<String, String>();
    learnerDataCollection.insert(learnerData);
  }

  public void postLearnerData(Context ctx) {
    // grab learner data from context and make sure we don't have any null fields
    LearnerData learnerData = ctx.bodyValidator(LearnerData.class).check(ld -> ld.wordCounts != null && ld.learnerId != null && ld.learnerName != null).get();
    // if we don't already have an entry with that learnerId...
    if(learnerData._id == null) // learnerData should only have a mongo Id if there already exists a learnerData in the database (given value from get request to server after learner login)
    {
      // create it
      learnerDataCollection.insert(learnerData);
    }
    else // update it
    {
      learnerDataCollection.replaceOneById(learnerData._id, learnerData);
    }
    ctx.status(201);
  }
  
}
