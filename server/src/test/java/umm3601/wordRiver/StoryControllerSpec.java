package umm3601.wordRiver;
import java.io.IOException;
import java.util.Arrays;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static com.mongodb.client.model.Filters.eq;
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
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;

public class StoryControllerSpec {
    MockHttpServletRequest mockReq = new MockHttpServletRequest();
    MockHttpServletResponse mockRes = new MockHttpServletResponse();

    private StoryController storyController;

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
        mockReq.resetAll();
        mockRes.resetAll();

        MongoCollection<Document> ctxDocuments = db.getCollection("stories");
        ctxDocuments.drop();

        Document johnDoeStory = new Document().append("learnerId", "123456").append("storyName", "Batman and Robin")
        .append("font", "Comic Sans haha").append("sentences", Arrays.asList("banana", "orange", "apple", "grape"));

        Document johnDoeStory2 = new Document().append("learnerId", "123456").append("storyName", "Batman and Nightwing")
        .append("font", "Comic Sans haha").append("sentences", Arrays.asList("banana", "apple", "I like turtles"));

        Document steveDoeStory = new Document().append("learnerId", "789101112").append("storyName", "Batman and Robin")
        .append("font", "Comic Sans haha").append("sentences", Arrays.asList("Is mayonnaise an instrument?","Ravioli, ravioli. Give me the formuoli", "The inner machinations of my mind are an enigma"));

        ctxDocuments.insertOne(johnDoeStory);
        ctxDocuments.insertOne(johnDoeStory2);
        ctxDocuments.insertOne(steveDoeStory);

        storyController = new StoryController(db);
    }

    @AfterAll
    public static void teardown() {
        db.drop();
        mongoClient.close();
    }

   @Test
    public void postValidStory() {
      String storyData  = "{"  + "\"learnerId\": \"1623445120497\"," + "\"storyName\": \"Jimmy's Pizza\"," + "\"font\": \"Comic Sans?\"," + "\"sentences\": []" + "}";

      String testId = "1623445120497";
      mockReq.setBodyContent(storyData);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/stories/:learnerId", ImmutableMap.of("learnerId", testId));
      storyController.postStory(ctx);

      assertEquals(201, mockRes.getStatus());

      Document modifiedLearnerData = db.getCollection("stories").find(eq("learnerId", "1623445120497")).first();

      assertEquals("Jimmy's Pizza", modifiedLearnerData.get("storyName"));
    }

    @Test
    public void postInvalidSentencesStory() {
      String storyData  = "{"  + "\"learnerId\": \"1623445120497\"," + "\"storyName\": \"Jimmy's Pizza\"," + "\"font\": \"Comic Sans?\"," + "}";

      String testId = "1623445120497";
      mockReq.setBodyContent(storyData);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/stories/:learnerId", ImmutableMap.of("learnerId", testId));

      assertThrows(BadRequestResponse.class, () -> {
        storyController.postStory(ctx);
      });
    }

    @Test
    public void postInvalidStory() {
      String storyData  = "{"  + "}";

      String testId = "1623445120497";
      mockReq.setBodyContent(storyData);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/stories/:learnerId", ImmutableMap.of("learnerId", testId));

      assertThrows(BadRequestResponse.class, () -> {
        storyController.postStory(ctx);
      });
    }

    @Test
    public void getLearnerStories() {
      String testId = "123456";

      Context ctx = ContextUtil.init(mockReq, mockRes, "api/stories/:learnerId", ImmutableMap.of("learnerId", testId));
      storyController.getLearnerStories(ctx);

      assertEquals(200, mockRes.getStatus());

      String result = ctx.resultString();
      Story[] resultStories = JavalinJson.fromJson(result, Story[].class);
      assertEquals(resultStories.length, 2);
      assertEquals(resultStories[0].storyName, "Batman and Robin");
      assertEquals(resultStories[1].storyName, "Batman and Nightwing");
    }
  }
