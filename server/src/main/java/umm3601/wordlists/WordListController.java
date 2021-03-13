package umm3601.wordlists;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.List;

import com.google.common.collect.ImmutableMap;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.eclipse.jetty.util.ajax.JSON;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import umm3601.contextpacks.ContextPack;
import umm3601.contextpacks.ContextPackController;

import java.util.Arrays;


/**
 * Controller that manages requests for info about word lists.
 */
public class WordListController {

  private final JacksonMongoCollection<ContextPack> contextPackCollection;

  String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");
  String databaseName = System.getenv().getOrDefault("MONGO_DB", "dev");
  ContextPackController contextPackController;

  ContextPack contextPack;

  MongoClient mongoClient
  = MongoClients.create(MongoClientSettings
    .builder()
    .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
    .build());
  /**
   * Construct a controller for word lists.
   *
   * @param database the database containing word list data
   */
  public WordListController() {



    // Setup the MongoDB client object with the information we set earlier


    //  GET /api/contextpacks/:cpname/wordlists/:wlname

    // Get the database
    MongoDatabase database = mongoClient.getDatabase(databaseName);

    contextPackController = new ContextPackController(database);
    contextPack = contextPackController.getContextPack("the father");
  }
  public WordListController(String contextPack){
  }

  /**
   * add a new word list
   *
   * @param ctx a Javalin HTTP context
   */
  public void addWordList(Context ctx) {
    WordList newWordList = ctx.bodyValidator(WordList.class).get();

    contextPack.setName(name);
    contextPack.updatePack(contextPack)
  }

  /**
   * retrieve a specific word list by its name
   *
   * @param ctx a Javalin HTTP context
   */
  public void getWordListByName(Context ctx) {
    String name = ctx.pathParam("name");
    WordList wordList;

    try {
      wordList = wordListCollection.find(eq("name", name)).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested word list name wasn't a legal name.");
    }
    if (wordList == null) {
      throw new NotFoundResponse("The requested word list was not found");
    } else {
      ctx.json(wordList);
    }
  }

  /**
   * Delete a specified word list by the `name` parameter in the request.
   */
  public void deleteWordList(Context ctx) {
    String id = ctx.pathParam("id");
    wordListCollection.deleteOne(eq("_id", new ObjectId(id)));
  }

  /**
   * Delete a specified word list by the `name` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void editWordList(Context ctx) {
    // String name = ctx.pathParam("name");
    // WordList newList = ctx.bodyValidator(WordList.class)
    //   .check(list -> list.name.length() > 0) //Verify that the user has a name that is not blank
    //   .get();
    //   JSON jsonObject = new JSONObject(newList);
    //   String inputJson = jsonObject.toString();
    //   Document inpDoc = Document.parse(inputJson);
    // wordListCollection.updateById(name,inpDoc);
    //TODO: FINISH
  }

  public void getWordLists(Context ctx) {

    ctx.json(wordListCollection.find(new Document()).into(new ArrayList<>()));
  }
}
