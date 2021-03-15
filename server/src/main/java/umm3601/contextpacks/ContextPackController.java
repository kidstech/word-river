package umm3601.contextpacks;

import com.mongodb.client.MongoDatabase;

import static com.mongodb.client.model.Filters.eq;

import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.NotFoundResponse;

public class ContextPackController {

  private final JacksonMongoCollection<ContextPack> ContextPackCollection;

  /**
   * Construct a controller for ContextPacks.
   *
   * @param database the database containing ContextPack data
   */
  public ContextPackController(MongoDatabase database) {
    ContextPackCollection = JacksonMongoCollection.builder().build(database, "contextpacks", ContextPack.class);
  }

  /**
   * Get the default contextpack
   *
   * @param ctx a Javalin HTTP context
   */
  public ContextPack getDefaultContextPack() {
    String name = "Birthday Pack";
    ContextPack ContextPack;

    try {
      ContextPack = ContextPackCollection.find(eq("name", name)).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested ContextPack id wasn't a legal Mongo Object ID.");
    }
    if (ContextPack == null) {
      throw new NotFoundResponse("The requested ContextPack was not found");
    } else {
      return ContextPack;
    }
  }

  public void updateContextPack(ContextPack contextPack) {
    ContextPackCollection.replaceOne(eq("name", contextPack.name), contextPack);
  }

}
