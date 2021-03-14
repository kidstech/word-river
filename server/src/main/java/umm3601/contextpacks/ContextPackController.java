package umm3601.contextpacks;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;

import com.mongodb.client.FindIterable;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
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
   * Get the single ContextPack specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public ContextPack getContextPack() {
    String id = "604c11a46f45325d0d1f34fb";
    ContextPack ContextPack;

    try {
      ContextPack = ContextPackCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested ContextPack id wasn't a legal Mongo Object ID.");
    }
    if (ContextPack == null) {
      throw new NotFoundResponse("The requested ContextPack was not found");
    } else {
      return ContextPack;
    }
  }

  public void getContextPackByName(Context ctx) {
    String name = ctx.pathParam("name");
    ContextPack ContextPack;

    try {
      ContextPack = ContextPackCollection.find(eq("name", name)).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested ContextPack id wasn't a legal Mongo Object ID.");
    }
    if (ContextPack == null) {
      throw new NotFoundResponse("The requested ContextPack was not found");
    } else {
      ctx.json(ContextPack);
    }
  }

  /**
   * Delete the ContextPack specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deleteContextPack(Context ctx) {
    String id = ctx.pathParam("id");
    ContextPackCollection.deleteOne(eq("_id", new ObjectId(id)));
  }

  /**
   * Get a JSON response with a list of all the ContextPacks.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getContextPacks(Context ctx) {

    ctx.json(ContextPackCollection.find(new Document()).into(new ArrayList<>()));
  }

  /**
   * Get a JSON response with a list of all the ContextPacks.
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewContextPack(Context ctx) {
    ContextPack newContextPack = ctx.bodyValidator(ContextPack.class)
        .check(pack -> pack.name != null && pack.name.length() > 0) // Verify that the ContextPack has a name that is
                                                                    // not blank
        .check(pack -> pack.icon != null && pack.icon.length() > 0) // Verify that the ContextPack has a company that is
                                                                    // not blank
        .get();
    if (ContextPackCollection.countDocuments(eq("name", newContextPack.name)) > 0) {
      throw new IllegalArgumentException("ContextPack already exists.");
    }

    // Generate ContextPack avatar (you won't need this part for todos)
    try {
      newContextPack.icon = "https://gravatar.com/avatar/" + md5(newContextPack.name) + "?d=identicon"; // generate
                                                                                                        // unique md5
                                                                                                        // code for
                                                                                                        // identicon
    } catch (NoSuchAlgorithmException ignored) {
      newContextPack.icon = "https://gravatar.com/avatar/?d=mp"; // set to mystery person
    }

    ContextPackCollection.insertOne(newContextPack);
    ctx.status(201);
    ctx.json(ImmutableMap.of("id", newContextPack.id));
  }

  /**
   * Utility function to generate the md5 hash for a given string
   *
   * @param str the string to generate a md5 for
   */
  @SuppressWarnings("lgtm[java/weak-cryptographic-algorithm]")
  public String md5(String str) throws NoSuchAlgorithmException {
    MessageDigest md = MessageDigest.getInstance("MD5");
    byte[] hashInBytes = md.digest(str.toLowerCase().getBytes(StandardCharsets.UTF_8));

    StringBuilder result = new StringBuilder();
    for (byte b : hashInBytes) {
      result.append(String.format("%02x", b));
    }
    return result.toString();
  }
}
