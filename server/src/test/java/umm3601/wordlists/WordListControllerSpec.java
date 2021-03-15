package umm3601.wordlists;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.util.Arrays;

import com.fasterxml.jackson.databind.ObjectMapper;
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

    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();




    // Setup database
    MongoCollection<Document> contextPacks = db.getCollection("contextpacks");
    contextPacks.drop();


    Word[] verbs1 = new Word[]{new Word("Run", new String[]{"Ran", "Runs"}), new Word("Jump", new String[]{"Jumped", "Jumping"})};
    Word[] nouns1 = new Word[]{new Word("Runner", new String[]{"Running", "Runners"}), new Word("Jumper", new String[]{"Jumping", "Jumpers"})};
    Word[] adj1 = new Word[]{new Word("Pretty", new String[]{"Prettier", "Prettiest"}), new Word("Ugly", new String[]{"Uglier", "Ugliest"})};
    Word[] misc1 = new Word[]{new Word("Quickly", new String[]{"Quicker", "Quickest"}), new Word("Under", new String[]{"Unders", "Undri"})};

    WordList wordList1 = new WordList("list1",true,nouns1,verbs1,adj1,misc1);

    Word[] verbs2 = new Word[]{new Word("Jog", new String[]{"jag", "jogs"}), new Word("slide", new String[]{"slid", "sliding"})};
    Word[] nouns2 = new Word[]{new Word("bunny", new String[]{"bunnies", "bunny"}), new Word("Ton", new String[]{"Tons", "Toning"})};
    Word[] adj2 = new Word[]{new Word("Swift", new String[]{"Swifting", "Swifter"}), new Word("Old", new String[]{"Older", "Oldest"})};
    Word[] misc2 = new Word[]{new Word("Run", new String[]{"Ran", "Runs"}), new Word("Jump", new String[]{"Jumped", "Jumping"})};

    WordList wordList2 = new WordList("list2",true,nouns2,verbs2,adj2,misc2);

    Document t = Document.parse("{\r\n\"name\":\"Birthday Pack\",\r\n\"enabled\":true,\r\n\"icon\":\"testicon1\",\r\n\"wordlists\":[\r\n{\r\n\"name\":\"birthday\",\r\n\"enabled\":true,\r\n\"nouns\":[\r\n{\r\n\"word\":\"somestuff\",\r\n\"forms\":[\r\n\"cake\",\r\n\"cakes\"\r\n]\r\n}\r\n],\r\n\"verbs\":[\r\n{\r\n\"word\":\"blow\",\r\n\"forms\":[\r\n\"blow\",\r\n\"blows\",\r\n\"blew\",\r\n\"blown\",\r\n\"blowing\"\r\n]\r\n}\r\n],\r\n\"adjectives\":[\r\n{\r\n\"word\":\"fun\",\r\n\"forms\":[\r\n\"fun\"\r\n]\r\n}\r\n],\r\n\"misc\":[]\r\n}\r\n]\r\n}");
    // t.put("name", "Basic Words I");
    // t.put("enabled", true);
    // t.put("icon", "testicon1");
    // t.put("wordlists", Arrays.asList(wordList1,wordList2));


    contextPacks.insertOne(t);
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
    assertEquals(JavalinJson.fromJson(result, WordList[].class).length, 1);
  }

  @Test
  public void GetWordListWithExistentName() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists/:name", ImmutableMap.of("name", "birthday"));
    wordListController.getWordListByName(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    WordList resultWordList = JavalinJson.fromJson(result, WordList.class);

    assertEquals(resultWordList.name, "birthday");
  }

  @Test
  public void GetWordListWithBadName() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists/:name", ImmutableMap.of("name", ""));

    assertThrows(BadRequestResponse.class, () -> {
      wordListController.getWordListByName(ctx);
    });
  }

  @Test
  public void GetWordListWithNonexistentName() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists/:name",
        ImmutableMap.of("name", "definitelynotarealname"));

    assertThrows(NotFoundResponse.class, () -> {
      wordListController.getWordListByName(ctx);
    });
  }

  @Test
  public void AddWordList() throws IOException {

    String testNewUser = "{\n\"name\":\"birthday21\",\n\"enabled\":true,\n\"nouns\":[\n{\n\"word\":\"somestuff\",\n\"forms\":[\n\"cake\",\n\"cakes\"\n]\n}\n],\n\"verbs\":[\n{\n\"word\":\"blow\",\n\"forms\":[\n\"blow\",\n\"blows\",\n\"blew\",\n\"blown\",\n\"blowing\"\n]\n}\n],\n\"adjectives\":[\n{\n\"word\":\"fun\",\n\"forms\":[\n\"fun\"\n]\n}\n],\n\"misc\":[]\n}";

    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists");

    wordListController.addWordList(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    WordList wordlist = jsonMapper.readValue(result, WordList.class);
    assertNotNull(wordlist);
    String name = wordlist.name;
    assertNotEquals("", name);
    System.out.println(name);

    assertEquals(name,"birthday21");

  }

  private Document pojoToDoc(WordList pojo){
    Document doc = new Document();

    doc.put("name",pojo.name);
    doc.put("enabled",pojo.enabled);
    doc.put("nouns",pojo.nouns);
    doc.put("verbs",pojo.verbs);
    doc.put("adjectives",pojo.adjectives);
    doc.put("misc",pojo.misc);


    return doc;
}
}
