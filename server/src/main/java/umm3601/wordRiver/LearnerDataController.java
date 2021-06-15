package umm3601.wordRiver;

import static com.mongodb.client.model.Filters.eq;
import com.mongodb.client.MongoDatabase;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

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
    String learnerId = ctx.pathParam("id");
    LearnerData data = null;

    data = learnerDataCollection.find(eq("learnerId", learnerId)).first();
    if (data == null) {
      throw new NotFoundResponse("The LearnerData was not found in the system.");
    }
    ctx.json(data);
  }
}
