package umm3601.wordRiver;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
public class UserControllerSpec {
    MockHttpServletRequest mockReq = new MockHttpServletRequest();
    MockHttpServletResponse mockRes = new MockHttpServletResponse();

    private UserController userController;
    private ObjectId johnDoeId;

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

        MongoCollection<Document> ctxDocuments = db.getCollection("users");
        ctxDocuments.drop();
        johnDoeId = new ObjectId();
        Document johnDoe = new Document().append("_id", johnDoeId).append("name", "John Doe").append("icon", "user.png")
            .append("learners", Arrays.asList(new Document().append("name", "Bob Doe")
                .append("icon","bod.jpg")
                 .append("learnerPacks", Arrays.asList( "ironMan1", "ironMan2"))))
                    .append("contextPacks", Arrays.asList("ironMan1", "ironMan2, ironMan3"));


        ctxDocuments.insertOne(johnDoe);

        userController = new UserController(db);
    }

    @AfterAll
    public static void teardown() {
        db.drop();
        mongoClient.close();
    }

    @Test
    public void GetUserExistentId() throws IOException {

      String testID = johnDoeId.toHexString();

      Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", testID));
      userController.getUser(ctx);

      assertEquals(200, mockRes.getStatus());

      String result = ctx.resultString();
      User resultUser = JavalinJson.fromJson(result, User.class);

      assertEquals(resultUser._id, johnDoeId.toHexString());
      assertEquals(resultUser.name, "John Doe");
    }


  @Test
  public void GetUserWithBadId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      userController.getUser(ctx);
    });
  }

  @Test
  public void GetUserWithNonexistentId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id",
        ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      userController.getUser(ctx);
    });
  }

  @Test
  public void CreateLearner() throws IOException {

    String testNewLearner = "{" +  "\"name\": \"Test Name\"," + "\"icon\": \"image.png\"," + "\"learnerPacks\": []" + "}";

    String testID = johnDoeId.toHexString();
    mockReq.setBodyContent(testNewLearner);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", testID));
    userController.createLearner(ctx);

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();

    assertEquals(200, mockRes.getStatus());
    ObjectId theId = johnDoeId;
    Document User = db.getCollection("users").find(Filters.eq("_id", theId)).first();

    @SuppressWarnings("unchecked")
    ArrayList<Learner> userLearners = (ArrayList<Learner>) User.get("learners");
    String theUserLearners = userLearners.toString();

    System.out.println(theUserLearners);
    System.out.println(id);


    assertTrue(theUserLearners
        .contains("Document{{_id=" + id + ", name=Test Name, icon=image.png, learnerPacks=[]}}"));
  }


  @Test
  public void AddLearnerithNullName() throws IOException {

    String testNewLearner = "{" +  "\"icon\": \"image.png\"," + "\"learnerPacks\": []" + "}";

    String testID = johnDoeId.toHexString();
    mockReq.setBodyContent(testNewLearner);
    mockReq.setMethod("POST");


    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", testID));

    assertThrows(BadRequestResponse.class, () -> {
      userController.createLearner(ctx);
    });;
  }

  @Test
  public void AddNewWordListWithInvalidName() throws IOException {

    String testNewLearner = "{" +  "\"name\": \"\"," + "\"icon\": \"image.png\"," + "\"learnerPacks\": []" + "}";

    String testID = johnDoeId.toHexString();
    mockReq.setBodyContent(testNewLearner);
    mockReq.setMethod("POST");


    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", testID));

    assertThrows(BadRequestResponse.class, () -> {
      userController.createLearner(ctx);
    });;
  }
}
