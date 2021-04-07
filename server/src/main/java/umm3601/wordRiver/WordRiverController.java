package umm3601.wordRiver;

import static com.mongodb.client.model.Filters.eq;
import java.util.ArrayList;
import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

public class WordRiverController {

  private final JacksonMongoCollection<ContextPack> ctxCollection;

  /**
   * Construct a controller for context packs.
   *
   * @param database The database containing context pack data.
   */
  public WordRiverController(MongoDatabase database) {
    ctxCollection = JacksonMongoCollection.builder().build(database, "packs", ContextPack.class);
  }

  /**
   * Get a Json response with a list of all context packs.
   *
   * @param ctx A Javalin HTTP context.
   */
  public void getPacks(Context ctx) {
    ctx.json(ctxCollection.find(new Document()).into(new ArrayList<>()));
  }

  /**
   * Adds a new Context Pack.
   *
   * @param ctx A Javalin HTTP context.
   */
  public void addNewContextPack(Context ctx) {
    ContextPack newContextPack = ctx.bodyValidator(ContextPack.class)
        .check(cp -> cp.name != null && cp.name.length() > 0).check(cp -> cp.icon != null).get();

    ctxCollection.insertOne(newContextPack);
    ctx.status(201);
    ctx.json(ImmutableMap.of("id", newContextPack._id));
  }

  public void getPack(Context ctx) {

    String id = ctx.pathParam("id");
    ContextPack contextPack;


    System.out.println(id);

    try {
      contextPack = ctxCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested context pack id wasn't a legal Mongo Object ID.");
    }
    if (contextPack == null) {
      throw new NotFoundResponse("The requested context pack was not found");
    } else {
      ctx.json(contextPack);
    }
  }

  public void addNewWordList(Context ctx) {
    WordList newWordList = ctx.bodyValidator(WordList.class).check(wl -> wl.name != null && wl.name.length() > 0).get();
    String id = ctx.pathParam("id");
    ContextPack contextPack;
    contextPack = ctxCollection.findOneById(id);
    for (WordList wl : contextPack.wordlists) {
      if (wl.name.toLowerCase().equals(newWordList.name.toLowerCase())) {
        throw new BadRequestResponse("The word list already exists in the context pack");
      }
      else{
        continue;
      }
    }
    ctxCollection.updateById(id, Updates.push("wordlists", newWordList));
    ctx.status(201);
    ctx.json(ImmutableMap.of("id", ctxCollection.findOneById(id)._id));
  }

  public void deleteWordList(Context ctx) {
    String id = ctx.pathParam("id");
    String wordListName = ctx.pathParam("name");
    ContextPack contextPack = ctxCollection.findOneById(id);
    for (int i = 0; i < contextPack.wordlists.size(); i++) {
      WordList theWordList = contextPack.wordlists.get(i);
      if (theWordList.name.equals(wordListName)) {
        ctxCollection.updateById(id, Updates.pull("wordlists", theWordList));
      }
      else{
        continue;
      }
    }
  }

  public void editWordList(Context ctx) {
    String id = ctx.pathParam("id");
    String wordListName = ctx.pathParam("name");
    // todo add some try catch
    ContextPack contextPack = ctxCollection.findOneById(id);
    WordList newList = ctx.bodyValidator(WordList.class).get();
    for (int i = 0; i < contextPack.wordlists.size(); i++) {
      WordList theWordList = contextPack.wordlists.get(i);
      if (theWordList.name.equals(wordListName)) {
        ctxCollection.updateById(id, Updates.pull("wordlists", theWordList));
        ctxCollection.updateById(id, Updates.push("wordlists", newList));
      }
      else{
        continue;
      }
    }
  }

  public void deleteContextPack(Context ctx) {
    String id = ctx.pathParam("id");
    try {
      if (ctxCollection.findOne(eq("_id", new ObjectId(id))) == null)
        throw new NotFoundResponse("That context pack does not exist.");
      ctx.json(ImmutableMap.of("id", ctxCollection.findOneById(id)._id));
      ctxCollection.deleteOne(eq("_id", new ObjectId(id)));
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested context pack id wasn't a legal Mongo Object ID.");
    }

  }

  public void getWordList(Context ctx) {

    String id = ctx.pathParam("id");
    String name = ctx.pathParam("name");
    ContextPack contextPack;
    WordList found = null;
    try {
      contextPack = ctxCollection.findOneById(id);
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested context pack id wasn't a legal Mongo Object ID.");
    }
    for (WordList wl : contextPack.wordlists) {
      if (wl.name.equals(name)) {
        found = wl;
        break;
      }
    }
    if (found == null) {
      throw new NotFoundResponse("The requested word list was not found");
    } else {
      ctx.json(found);
    }
  }

  public void getWordLists(Context ctx) {

    String id = ctx.pathParam("id");

    ArrayList<WordList> wordlists;

    try {
      ContextPack contextPack = ctxCollection.findOneById(id);
      wordlists = contextPack.wordlists;
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested context pack id wasn't a legal Mongo Object ID.");
    }
    if (wordlists == null) {
      throw new NotFoundResponse("The requested word lists were not found");
    } else {
      ctx.json(wordlists);
    }
  }
}
