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

        storyController = new StoryController(db);
    }

    @AfterAll
    public static void teardown() {
        db.drop();
        mongoClient.close();
    }

   @Test
    public void postValidStory() {
      String storyData  = "{"  + "\"learnerId\": \"1623445120497\"," + "\"storyName\": \"Jimmy's Pizza\"," + "\"font\": \"Comic Sans?\"," + "\"pages\": []" + "}";

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
    public void postInvalidPagesStory() {
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
  }
