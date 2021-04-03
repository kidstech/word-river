package umm3601.wordRiver;

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
import com.mongodb.client.model.Filters;
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

public class WordRiverControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private WordRiverController wordRiverController;

  private ObjectId batmanId;
  private ObjectId noWordListsId;

  static MongoClient mongoClient;
  static MongoDatabase db;

  static ObjectMapper jsonMapper = new ObjectMapper();

  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(MongoClientSettings.builder()
        .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr)))).build());

    db = mongoClient.getDatabase("test");
  }

  @BeforeEach
  public void setupEach() throws IOException {
    // Reset out mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

    // Setup database
    MongoCollection<Document> ctxDocuments = db.getCollection("packs");
    ctxDocuments.drop();
    List<Document> testPacks = new ArrayList<>();
    testPacks
        .add(new Document().append("name", "iron man").append("icon", "iron.png").append("enabled", "true")
            .append("wordlists", Arrays.asList(new Document().append("name", "iron man").append("enabled", true)
                .append("nouns",
                    Arrays.asList(new Document("word", "suit").append("forms", Arrays.asList("suit", "suits"))))
                .append("verbs",
                    Arrays.asList(new Document("word", "fight").append("forms", Arrays.asList("fight", "fights"))))
                .append("adjectives",
                    Arrays.asList(new Document("word", "big").append("forms", Arrays.asList("big", "biggish"))))
                .append("misc", Arrays.asList(new Document("word", "the").append("forms", Arrays.asList("the")))))));

    testPacks
        .add(new Document().append("name", "captain america").append("icon", "cap.png").append("enabled", "false")
            .append("wordlists", Arrays.asList(new Document().append("name", "iron man").append("enabled", true)
                .append("nouns",
                    Arrays.asList(new Document("word", "suit").append("forms", Arrays.asList("suit", "suits"))))
                .append("verbs",
                    Arrays.asList(new Document("word", "fight").append("forms", Arrays.asList("fight", "fights"))))
                .append("adjectives",
                    Arrays.asList(new Document("word", "big").append("forms", Arrays.asList("big", "biggish"))))
                .append("misc", Arrays.asList(new Document("word", "the").append("forms", Arrays.asList("the")))))));


    batmanId = new ObjectId();
    Document batman = new Document().append("_id", batmanId).append("name", "batman").append("icon", "batman.png")
        .append("enabled", "true").append("wordlists",
            Arrays.asList(new Document().append("name", "iron man").append("enabled", true)
                .append("nouns", Arrays.asList(new Document("word", "suit").append("forms", Arrays.asList("suits"))))
                .append("verbs", Arrays.asList(new Document("word", "fight").append("forms", Arrays.asList("fights"))))
                .append("adjectives",
                    Arrays.asList(new Document("word", "big").append("forms", Arrays.asList("biggish"))))
                .append("misc", Arrays.asList(new Document("word", "the").append("forms", Arrays.asList("the")))),
                new Document().append("name", "captain america").append("enabled", true)
                .append("nouns", Arrays.asList(new Document("word", "suit").append("forms", Arrays.asList("suits"))))
                .append("verbs", Arrays.asList(new Document("word", "fight").append("forms", Arrays.asList("fights"))))
                .append("adjectives",
                    Arrays.asList(new Document("word", "big").append("forms", Arrays.asList("biggish"))))
                .append("misc", Arrays.asList(new Document("word", "the").append("forms", Arrays.asList("the"))))
                ));

    noWordListsId = new ObjectId();
    Document noWordLists = new Document().append("_id", noWordListsId).append("name", "batman").append("icon", "batman.png")
        .append("enabled", "true").append("wordlists", null);

    ctxDocuments.insertMany(testPacks);
    ctxDocuments.insertOne(batman);
    ctxDocuments.insertOne(noWordLists);

    wordRiverController = new WordRiverController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @Test
  public void GetAllPacks() throws IOException {
    // Create fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs");
    wordRiverController.getPacks(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertEquals(db.getCollection("packs").countDocuments(), JavalinJson.fromJson(result, ContextPack[].class).length);
  }

  @Test
  public void AddContextPack() throws IOException {

    String testNewContextPack = "{" + "\"schema\": \"Test schema\"," + "\"name\": \"Test Context Pack\","
        + "\"icon\": \"image.png\"," + "\"enabled\": true," + "\"wordlists\": []" + "}";

    mockReq.setBodyContent(testNewContextPack);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs");
    wordRiverController.addNewContextPack(ctx);

    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("packs").countDocuments(eq("_id", new ObjectId(id))));

    // Verify the context pack was added to the database with the correct ID
    Document addedContextPack = db.getCollection("packs").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedContextPack);
    assertEquals("Test Context Pack", addedContextPack.getString("name"));
    assertEquals("image.png", addedContextPack.getString("icon"));
    assertEquals(true, addedContextPack.getBoolean("enabled"));
    assertNotNull(addedContextPack.get("wordlists"));
  }

  @Test
  public void AddNewWordList() throws IOException {

    String testNewWordList = "{" + "\"name\": \"Test Wordlist\"," + "\"enabled\": true," + "\"nouns\": [],"
        + "\"verbs\": []," + "\"adjectives\": []," + "\"misc\": []" + "}";

    String testID = batmanId.toHexString();
    mockReq.setBodyContent(testNewWordList);
    mockReq.setMethod("POST");

    ObjectId theId = batmanId;

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", testID));
    wordRiverController.addNewWordList(ctx);

    assertEquals(201, mockRes.getStatus());
    Document ContextPack = db.getCollection("packs").find(Filters.eq("_id", theId)).first();

    @SuppressWarnings("unchecked")
    ArrayList<WordList> cpWordLists = (ArrayList<WordList>) ContextPack.get("wordlists");
    String theContextPackWordLists = cpWordLists.toString();

    assertTrue(theContextPackWordLists
        .contains("Document{{name=Test Wordlist, enabled=true, nouns=[], verbs=[], adjectives=[], misc=[]}}"));
  }

  @Test
  public void AddNewWordListWithNullName() throws IOException {

    String testNewWordList = "{" + "\"enabled\": true," + "\"nouns\": [],"
        + "\"verbs\": []," + "\"adjectives\": []," + "\"misc\": []" + "}";

    String testID = batmanId.toHexString();
    mockReq.setBodyContent(testNewWordList);
    mockReq.setMethod("POST");


    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", testID));

    assertThrows(BadRequestResponse.class, () -> {
      wordRiverController.addNewWordList(ctx);
    });;
  }

  @Test
  public void AddNewWordListWithInvalidName() throws IOException {

    String testNewWordList = "{" + "\"name\": \"\"," + "\"enabled\": true," + "\"nouns\": [],"
        + "\"verbs\": []," + "\"adjectives\": []," + "\"misc\": []" + "}";

    String testID = batmanId.toHexString();
    mockReq.setBodyContent(testNewWordList);
    mockReq.setMethod("POST");


    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", testID));

    assertThrows(BadRequestResponse.class, () -> {
      wordRiverController.addNewWordList(ctx);
    });;
  }



  @Test
  public void AddDuplicateWordList() throws IOException {

    String testNewWordList = "{" + "\"name\": \"Iron Man\"," + "\"enabled\": true," + "\"nouns\": [],"
        + "\"verbs\": []," + "\"adjectives\": []," + "\"misc\": []" + "}";

    String testID = batmanId.toHexString();
    mockReq.setBodyContent(testNewWordList);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", testID));

    assertThrows(BadRequestResponse.class, () -> {
      wordRiverController.addNewWordList(ctx);
    });
  }

  @Test
  public void AddInvalidName() throws IOException {

    String testNewContextPack = "{" + "\"schema\": \"Test schema\"," + "\"name\": \"\"," + "\"icon\": \"image.png\","
        + "\"enabled\": true," + "\"wordlists\": []" + "}";

    mockReq.setBodyContent(testNewContextPack);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs");

    assertThrows(BadRequestResponse.class, () -> {
      wordRiverController.addNewContextPack(ctx);
    });
  }

  @Test
  public void AddNullName() throws IOException {

    String testNewContextPack = "{" + "\"schema\": \"Test schema\"," + "\"icon\": \"image.png\"," + "\"enabled\": true,"
        + "\"wordlists\": []" + "}";

    mockReq.setBodyContent(testNewContextPack);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs");

    assertThrows(BadRequestResponse.class, () -> {
      wordRiverController.addNewContextPack(ctx);
    });
  }

  @Test
  public void AddNullIcon() throws IOException {

    String testNewContextPack = "{" + "\"schema\": \"Test schema\"," + "\"name\": \"Test Context Pack\","
        + "\"enabled\": true," + "\"wordlists\": []" + "}";

    mockReq.setBodyContent(testNewContextPack);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs");

    assertThrows(BadRequestResponse.class, () -> {
      wordRiverController.addNewContextPack(ctx);
    });
  }

  @Test
  public void secureSchema() {
    ContextPack schema = new ContextPack();
    assertEquals("https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json",
        schema.schema);
  }

  @Test
  public void GetContextPackWithExistentId() throws IOException {

    String testID = batmanId.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", testID));
    wordRiverController.getPack(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, batmanId.toHexString());
    assertEquals(resultPack.name, "batman");
  }

  @Test
  public void GetContextPackWithBadId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      wordRiverController.getPack(ctx);
    });
  }

  @Test
  public void GetContextPackWithNonexistentId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id",
        ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      wordRiverController.getPack(ctx);
    });
  }

  @Test
  public void getWordLists() throws IOException {
    String testID = batmanId.toHexString();
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", testID));
    mockReq.setMethod("GET");
    wordRiverController.getWordLists(ctx);

    String result = ctx.resultString();
    WordList[] resultPack = JavalinJson.fromJson(result, WordList[].class);
    assertEquals(resultPack.length, 2);
  }
  @Test
  public void getWordListsByInvalidID() throws IOException {
    String testID = "69"; // nice
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", testID));
    mockReq.setMethod("GET");

    assertThrows(BadRequestResponse.class, () -> {
      wordRiverController.getWordLists(ctx);
    });
  }

  @Test
  public void getWordListsWithNullWordLists() throws IOException {
    String testID = noWordListsId.toHexString();
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", testID));
    mockReq.setMethod("GET");

    assertThrows(NotFoundResponse.class, () -> {
      wordRiverController.getWordLists(ctx);
    });
  }
  @Test
  public void getWordList() throws IOException {
    String testID = batmanId.toHexString();
    String name = "iron man";
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id/:name", ImmutableMap.of("id", testID, "name", name));
    mockReq.setMethod("GET");
    wordRiverController.getWordList(ctx);

    String result = ctx.resultString();
    WordList resultList = JavalinJson.fromJson(result, WordList.class);

    assertEquals(resultList.name, name);
  }

  @Test
  public void getWordListWithBadId() throws IOException {
    String testID = "bad ID";
    String name = "iron man";
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id/:name", ImmutableMap.of("id", testID, "name", name));
    mockReq.setMethod("GET");

    assertThrows(BadRequestResponse.class, () -> {
      wordRiverController.getWordList(ctx);
    });
  }

  @Test
  public void getWordListWithNonexistentName() throws IOException {
    String testID = batmanId.toHexString();
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id/:name",
        ImmutableMap.of("id", testID, "name", "batmannnnnn"));

    assertThrows(NotFoundResponse.class, () -> {
      wordRiverController.getWordList(ctx);
    });
  }
  @Test
  public void editWordList() throws IOException {

    String testNewWordList = "{" + "\"name\": \"Test Wordlist\"," + "\"enabled\": true," + "\"nouns\": [],"
        + "\"verbs\": []," + "\"adjectives\": []," + "\"misc\": []" + "}";

    String testID = batmanId.toHexString();
    mockReq.setBodyContent(testNewWordList);
    mockReq.setMethod("PUT");

    ObjectId theId = batmanId;

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id/:name", ImmutableMap.of("id", testID, "name", "iron man"));
        wordRiverController.editWordList(ctx);

    Document ContextPack = db.getCollection("packs").find(Filters.eq("_id", theId)).first();

    @SuppressWarnings("unchecked")
    ArrayList<WordList> cpWordLists = (ArrayList<WordList>) ContextPack.get("wordlists");
    String theContextPackWordLists = cpWordLists.toString();

    assertTrue(theContextPackWordLists
           .contains("Document{{name=Test Wordlist, enabled=true, nouns=[], verbs=[], adjectives=[], misc=[]}}"));
  }



  @Test
  public void deleteWordList() throws IOException {

    String testID = batmanId.toHexString();
    mockReq.setMethod("DELETE");

    ObjectId theId = batmanId;

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id/:name", ImmutableMap.of("id", testID, "name", "captain america"));
        wordRiverController.deleteWordList(ctx);

    Document ContextPack = db.getCollection("packs").find(Filters.eq("_id", theId)).first();

    @SuppressWarnings("unchecked")
    ArrayList<WordList> cpWordLists = (ArrayList<WordList>) ContextPack.get("wordlists");

    assertEquals(cpWordLists.size(), 1);
 }

  @Test
  public void deleteContextPack() throws IOException {

    String testID = batmanId.toHexString();
    mockReq.setMethod("DELETE");


    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", testID));
        wordRiverController.deleteContextPack(ctx);

    assertTrue(db.getCollection("packs").countDocuments() == 3);

  }

  @Test
  public void deleteContextPackWithBadId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      wordRiverController.deleteContextPack(ctx);
    });
  }



  @Test
  public void deleteContextPackWithNonExistentId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id", ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      wordRiverController.deleteContextPack(ctx);
    });
  }

}
