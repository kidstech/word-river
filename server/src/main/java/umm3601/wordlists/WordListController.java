package umm3601.wordlists;

import com.mongodb.client.MongoDatabase;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import umm3601.contextpacks.ContextPack;
import umm3601.contextpacks.ContextPackController;
import umm3601.contextpacks.ContextPackUtils;

import java.security.InvalidParameterException;

/**
 * Controller that manages requests for info about word lists.
 */
public class WordListController {
  ContextPackController contextPackController;
  ContextPackUtils utils;
  ContextPack contextPack;

  /**
   * Construct a controller for word lists.
   *
   * @param database the database containing word list data
   */
  public WordListController(MongoDatabase db) {

    // MongoDatabase database = mongoClient.getDatabase(databaseName);

    contextPackController = new ContextPackController(db);
    contextPack = contextPackController.getDefaultContextPack();
    utils = new ContextPackUtils(contextPack);
  }

  /**
   * add a new word list
   *
   * @param ctx a Javalin HTTP context
   */
  public void addWordList(Context ctx) {
    WordList newWordList = ctx.bodyValidator(WordList.class).get();
    try {
      utils.addWordList(newWordList);
    } catch (Exception e) {
      throw new BadRequestResponse("The wordlist with that name already exists.");
    }
    update();
    ctx.json(newWordList);
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
      wordList = utils.getWordListByName(name);
    } catch (InvalidParameterException e) {
      throw new BadRequestResponse("The requested word list name wasn't a legal name.");
    }
    ctx.json(wordList);
  }

  /**
   * Delete a specified word list by the `name` parameter in the request.
   */
  public void deleteWordList(Context ctx) {
    String name = ctx.pathParam("name");
    try {
      utils.deleteWordList(name);
    } catch (UnsupportedOperationException e) {
      throw new BadRequestResponse("Could not delete " + name);
    }
    update();
    ctx.json(name);
  }

  /**
   * Delete a specified word list by the `name` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void editWordList(Context ctx) {
    String name = ctx.pathParam("name");
    WordList newList = ctx.bodyValidator(WordList.class).get();
    try {
      utils.editWordList(name, newList);
    } catch (Exception e) {
      throw new NotFoundResponse("Could not edit " + name);
    }
    update();

    ctx.json(newList);
  }

  public void getWordLists(Context ctx) {
    ctx.json(utils.getWordLists());
  }

  public void update() {
    contextPackController.updateContextPack(utils.getContextPack());
  }
}
