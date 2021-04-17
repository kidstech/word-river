package umm3601.wordRiver;


import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
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
    String authId = ctx.pathParam("id");
    User user;

    try {
      String mongoId = findByAuthId(authId);
      user = userCollection.find(eq("_id", new ObjectId(mongoId))).first();
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
    String authId = ctx.pathParam("id");
    String mongoId = findByAuthId(authId);
    long idNum = System.currentTimeMillis();
    String learnerId = Long.toString(idNum);
    newLearner._id = learnerId;
    userCollection.updateById(mongoId, Updates.push("learners", newLearner));
    ctx.json(ImmutableMap.of("id", learnerId));
  }


   /**
    * Get all of the learners for a specific user
   */
  public void getLearners(Context ctx) {
    String authId = ctx.pathParam("id");
    String mongoId = findByAuthId(authId);
    User user = userCollection.findOneById(mongoId);
    ArrayList<Learner> learners = user.learners;
    ctx.json(learners);
  }

   /**
   * Get more detailed information about a given learner
   */
     public void getLearner(Context ctx) {
       String authId = ctx.pathParam("id");
       String mongoId = findByAuthId(authId);
       String learnerId = ctx.pathParam("learnerId");
       Learner foundLearner = null;
       User user;
       try{
        user = userCollection.findOneById(mongoId);
       } catch (IllegalArgumentException e) {
         throw new BadRequestResponse("The requested user id wasn't a legal Mongo Object Id");
       }
       for(Learner lr : user.learners) {
         if(lr._id.equals(learnerId)){
           foundLearner = lr;
           break;
         }
       }

       if(foundLearner == null) {
         throw new NotFoundResponse("The requested learner was not found");
       }
       else {
         ctx.json(foundLearner);
       }
   }

  /**
   * Change the name and/or icon of a given learner
   */
  public void editLearner(Context ctx) {
      String authId = ctx.pathParam("id");
      String mongoId = findByAuthId(authId);
      String learnerId = ctx.pathParam("learnerId");
      User user;
      Learner foundLearner = null;

      try{
        user = userCollection.findOneById(mongoId);
      }
      catch (IllegalArgumentException e) {
        throw new BadRequestResponse("The requested user id wasn't a legal Mongo Object Id");
      }

      for(Learner lr: user.learners) {
        if(lr._id.equals(learnerId)){
          foundLearner = lr;
          break;
        }
      }

      if(foundLearner == null) {
        throw new NotFoundResponse("The requested learner was not found");
      }
      else {
        Learner editedLearner = ctx.bodyValidator(Learner.class).get();
        userCollection.updateById(mongoId, Updates.pull("learners", foundLearner));
        userCollection.updateById(mongoId, Updates.push("learners", editedLearner));
      }
    }

  // /**
  //  * Add a context pack to a given learner
  //  */
  // public void addPackToLearner(Context ctx) {
  //   String userId = ctx.pathParam("id");
  //   String learnerId = ctx.pathParam("learnerId");
  //   String contextPackId = ctx.pathParam("packId");


  // }

  // /**
  //  * Remove a given learner
  //  */
  // public void removeLearner(Context ctx) {
  //     String userId = ctx.pathParam("id");
  //     String learnerId = ctx.pathParam("learnerId");

  //     User user = userCollection.findOneById(userId);
  //     for(int i = 0; i < user.learners.size(); i++) {
  //       Learner currentLearner = user.learners.get(i);
  //       if(currentLearner._id == learnerId) {
  //         userCollection.updateById(userId, Updates.pull("learners", currentLearner));
  //       } else {
  //         continue;
  //       }
  //     }
  // }

  public void removePackFromLearner(Context ctx) {
    String authId = ctx.pathParam("id");
    String mongoId = findByAuthId(authId);
    String learnerId = ctx.pathParam("learnerId");
    String contextPackId = ctx.pathParam("packId");


    User user = userCollection.findOneById(mongoId);
    for(int i = 0; i < user.learners.size(); i++) {
      Learner currentLearner = user.learners.get(i);
      if(currentLearner._id.equals(learnerId)) {
        for(int j = 0; j < currentLearner.learnerPacks.size(); j++) {
          String currentPackId = currentLearner.learnerPacks.get(j);
          if(currentPackId.equals(contextPackId)) {
            userCollection.updateById(mongoId, Updates.pull("learners", currentLearner));
            currentLearner.learnerPacks.remove(j);
            userCollection.updateById(mongoId, Updates.push("learners", currentLearner));
            break;
          } else {
            continue;
          }
        }
      } else {
          continue;
      }
    }

  }

  private String findByAuthId(String authId) {
    User user = userCollection.find(Filters.eq("authId", authId)).first();
    return user._id;
  }

}
