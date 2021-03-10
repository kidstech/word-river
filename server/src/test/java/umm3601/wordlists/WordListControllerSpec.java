package umm3601.wordlists;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;

public class WordListControllerSpec {

    MockHttpServletRequest mockReq = new MockHttpServletRequest();
    MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private WordListController wordListController;

  private ObjectId samsName;

  static MongoClient mongoClient;
  static MongoDatabase db;

  static ObjectMapper jsonMapper = new ObjectMapper();

  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
    MongoClientSettings.builder()
    .applyToClusterSettings(builder ->
    builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
    .build());

    db = mongoClient.getDatabase("test");
  }

  @BeforeEach
  public void setupEach() throws IOException {

    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();





    // Setup database
    MongoCollection<Document> wordListDocuments = db.getCollection("wordlist");
    wordListDocuments.drop();
    List<Document> testWordLists = new ArrayList<>();

    ArrayList<Word> verbs1 = (ArrayList<Word>) Arrays.asList(new Word("Run", new String[]{"Ran", "Runs"}), new Word("Jump", new String[]{"Jumped", "Jumping"}));
    ArrayList<Word> nouns1 = (ArrayList<Word>) Arrays.asList(new Word("Apple", new String[]{"Apples"}), new Word("Orange", new String[]{"Oranges"}));
    ArrayList<Word> adj1 = (ArrayList<Word>) Arrays.asList(new Word("Happy", new String[]{"Happier", "Happiest"}), new Word("Sad", new String[]{"Sadder", "Saddest"}));
    ArrayList<Word> misc1 = (ArrayList<Word>) Arrays.asList(new Word("a", new String[]{}), new Word("Who", new String[]{"Whom"}));

    ArrayList<Word> verbs2 = (ArrayList<Word>) Arrays.asList(new Word("Jog", new String[]{"Jogged", "Jogging", "Jogger"}), new Word("Stand", new String[]{"Stood"}));
    ArrayList<Word> nouns2 = (ArrayList<Word>) Arrays.asList(new Word("New York City", new String[]{"NY","Big Apple"}), new Word("John", new String[]{"Johnny"}));
    ArrayList<Word> adj2 = (ArrayList<Word>) Arrays.asList(new Word("Silly", new String[]{"Sillier", "Silliest"}), new Word("Red", new String[]{"Redder", "Reddest"}));
    ArrayList<Word> misc2 = (ArrayList<Word>) Arrays.asList(new Word("The", new String[]{}), new Word("They", new String[]{"Them"}));


    testWordLists.add(
      new Document()
        .append("name", "Basic Words I")
        .append("enabled", true)
        .append("nouns", nouns1)
        .append("verbs", verbs1)
        .append("adjectives", adj1)
        .append("misc", misc1));
    testWordLists.add(
      new Document()
        .append("name", "Basic Words II")
        .append("enabled", true)
        .append("nouns",nouns2)
        .append("verbs", verbs2)
        .append("adjectives", adj2)
        .append("misc", misc2));


    wordListDocuments.insertMany(testWordLists);
    wordListController = new WordListController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @Test
  public void GetAllWordLists() throws IOException {

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists");
    wordListController.getWordLists(ctx);


    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertEquals(db.getCollection("wordLists").countDocuments(), JavalinJson.fromJson(result, WordList[].class).length);
  }

  @Test
  public void GetWordListWithExistentName() throws IOException {

    String testName = samsName.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists/:name", ImmutableMap.of("name", testName));
    wordListController.getWordListByName(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    WordList resultWordList = JavalinJson.fromJson(result, WordList.class);

    assertEquals(resultWordList.name, samsName.toHexString());
    assertEquals(resultWordList.name, "Basic Verbs");
  }

  @Test
  public void GetWordListWithBadName() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists/:name", ImmutableMap.of("name", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      wordListController.getWordListByName(ctx);
    });
  }

  @Test
  public void GetWordListWithNonexistentName() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists/:name", ImmutableMap.of("name", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      wordListController.getWordListByName(ctx);
    });
  }

  @Test
  public void AddWordList() throws IOException {

    ArrayList<Word> testVerb = (ArrayList<Word>) Arrays.asList(new Word("Run", new String[]{"Ran", "Runs"}), new Word("Jump", new String[]{"Jumped", "Jumping"}));
    String testNewWordList = "{"
      + "\"name\": \"Test Word List\","
      + "\"enabled\": true,"
      + "\"nouns\": \"testers\","
      + "\"verbs\": \"test@example.com\","
      + "\"adjectives\": \"test@example.com\","
      + "\"misc\": \"viewer\""
      + "}";

    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");

    userController.addNewUser(ctx);

    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("users").countDocuments(eq("_id", new ObjectId(id))));

    //verify user was added to the database and the correct ID
    Document addedUser = db.getCollection("users").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedUser);
    assertEquals("Test User", addedUser.getString("name"));
    assertEquals(25, addedUser.getInteger("age"));
    assertEquals("testers", addedUser.getString("company"));
    assertEquals("test@example.com", addedUser.getString("email"));
    assertEquals("viewer", addedUser.getString("role"));
    assertTrue(addedUser.containsKey("avatar"));
  }
}
