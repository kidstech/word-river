package umm3601.wordRiver;


import static com.mongodb.client.model.Filters.eq;
import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Updates;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

public class UserController {

  private final JacksonMongoCollection<User> userCollection;

   /**
   * Construct a controller for users
   *
   * @param userDatabase The database containing user data.
   */
  public UserController(MongoDatabase userDatabase) {
    userCollection = JacksonMongoCollection.builder().build(userDatabase, "users", User.class);
  }


  /**
   * Get a user based on their mongo id.
   *
   * @param ctx A Javalin HTTP context.
   */
  public void getUser(Context ctx) {
    String id = ctx.pathParam("id");
    User user;

    try {
      user = userCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested user id wasn't a legal Mongo Object ID.");
    }
    if (user == null) {
      throw new NotFoundResponse("The requested user could not be found");
    } else {
      ctx.json(user);
    }
  }

//   /**
//    * Create a new user
//    */
//   public void createUser(Context ctx) {
//       //stub
//   }

  /**
   * Create a new leaner
   */
  public void createLearner(Context ctx) {

    Learner newLearner = ctx.bodyValidator(Learner.class).check(lnr -> lnr.name != null && lnr.name.length() > 0).get();
    String id = ctx.pathParam("id");
    long idNum = System.currentTimeMillis();
    String learnerId = Long.toString(idNum);
    newLearner._id = learnerId;
    userCollection.updateById(id, Updates.push("learners", newLearner));
    ctx.json(ImmutableMap.of("id", learnerId));
  }


//   /**
//    * Get all of the learners
//    */
//   public void getLearners(Context ctx) {
//       //stub
//   }

//   /**
//    * Get more detailed information about a given learner
//    */
//   public void getLearner(Context ctx) {
//       //stub
//   }

//   /**
//    * Change the name and/or icon of a given learner
//    */
//   public void editLearner(Context ctx) {
//       //stub
//   }

//   /**
//    * Add a context pack to a given learner
//    */
//   public void addPackToLearner(Context ctx) {
//       //stub
//   }

//   /**
//    * Remove a context pack from a given learner
//    */
//   public void removePackFromLearner(Context ctx) {
//       //stub
//   }


}
