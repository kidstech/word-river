package umm3601.wordRiver;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

public class LearnerDataControllerSpec {

    MockHttpServletRequest mockReq = new MockHttpServletRequest();
    MockHttpServletResponse mockRes = new MockHttpServletResponse();

    private LearnerDataController learnerDataController;
    private ObjectId johnDoeId;
    private Map<String, Integer> wordCounts = new HashMap<String, Integer>();
    private Map<String, String> sessionTimes = new HashMap<String, String>();

    static MongoClient mongoClient;
    static MongoDatabase db;
    static ObjectMapper jsonMapper = new ObjectMapper();


    @BeforeAll
    public static void setupDatabase() {
        String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

        mongoClient = MongoClients.create(MongoClientSettings.builder()
                .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr)))).build());

        db = mongoClient.getDatabase("test");
    }

    @BeforeEach
    public void setupEach() throws IOException {
        mockReq.resetAll();
        mockRes.resetAll();

        // create fake wordcounts entries
        wordCounts.put("away", 19);
        wordCounts.put("big", 2);
        wordCounts.put("find", 1);
        wordCounts.put("i", 1);
        wordCounts.put("blue", 14);

        // create fake sessionTime entries
        sessionTimes.put("9/12/2021 2:10:18 PM", "00:00:26");
        sessionTimes.put("9/18/2021 10:19:05 PM", "00:00:11");


        // need to make example learner data like this
        /*
         * { "_id": { "$oid": "60c6752204d2066d29d73a20" }, "learnerId":
         * "1623445120497", "learnerName": "Carl", "wordCounts": { "away": 19, "big": 2,
         * "find": 1, "i": 1, "alphabet": 47, "ate": 5, "an": 3, "aunt": 24, "blanket":
         * 16, "blue": 14, "book": 4, "burn": 5, "candle": 5, "active": 25, "and": 17,
         * "a": 5, "ant": 6, "nineteen": 1, "no": 1, "phone": 1, "pack": 1, "on": 1,
         * "now": 1, "our": 1, "out": 1, "all": 5, "little": 1 }, "sessionTimes": {
         * "9/12/2021 2:10:18 PM": "", "9/12/2021 2:11:35 PM": "",
         * "9/12/2021 2:13:36 PM": "", "9/12/2021 2:29:08 PM": "00:01:47",
         * "9/12/2021 2:50:22 PM": "00:04:53", "9/12/2021 3:21:18 PM": "",
         * "9/12/2021 3:22:54 PM": "", "9/12/2021 3:28:44 PM": "00:01:02",
         * "9/12/2021 3:34:38 PM": "00:00:15", "9/12/2021 6:07:06 PM": "",
         * "9/12/2021 6:08:55 PM": "00:00:26", "9/12/2021 6:47:54 PM": "00:00:23",
         * "9/12/2021 8:19:57 PM": "00:00:23", "9/12/2021 8:22:46 PM": "00:00:07",
         * "9/18/2021 2:13:38 PM": "00:01:41", "9/18/2021 8:59:13 PM": "00:00:21",
         * "9/18/2021 9:00:19 PM": "00:00:43", "9/18/2021 9:09:45 PM": "00:00:14",
         * "9/18/2021 9:40:48 PM": "00:00:31", "9/18/2021 9:48:49 PM": "00:00:08",
         * "9/18/2021 9:56:16 PM": "00:01:42", "9/18/2021 9:58:12 PM": "00:02:07",
         * "9/18/2021 10:19:05 PM": "00:00:11" } }
         */

        MongoCollection<Document> ctxDocuments = db.getCollection("learnerdata");
        ctxDocuments.drop();
        johnDoeId = new ObjectId();
        Document johnDoe = new Document().append("_id", johnDoeId).append("learnerId", "1623445120497").append("learnerName", "John Doe");

        ctxDocuments.insertOne(johnDoe);


        learnerDataController = new LearnerDataController(db);
    }

    @AfterAll
    public static void teardown()
    {
        db.drop();
        mongoClient.close();
    }

    @Test
    public void GetLearnerDataWithValidLearnerId()
    {
      String testLearnerId = "1623445120497";
      Context ctx = ContextUtil.init(mockReq, mockRes, "api/learnerData/:learnerId", ImmutableMap.of("learnerId", testLearnerId));
          learnerDataController.getLearnerData(ctx);

       String result = ctx.resultString();
       LearnerData resultData = JavalinJson.fromJson(result, LearnerData.class);
       System.out.println("This is the result: " + result);

      assertEquals("John Doe", resultData.learnerName);
    }

     @Test
    public void GetLearnerDataWithBadLearnerId()
    {
      String testLearnerId = "10987654321";
        Context ctx = ContextUtil.init(mockReq, mockRes, "api/learnerData/:learnerId", ImmutableMap.of("learnerId", testLearnerId));

        assertThrows(NotFoundResponse.class, () -> {learnerDataController.getLearnerData(ctx);});
    }

   @Test
    public void StoreValidLearnerData()
    {

        String mongoId = johnDoeId.toHexString();

        String fakeLearnerData  = "{" + "\"_id\": " + '"' + mongoId  + '"' + "," + "\"learnerId\": \"1623445120497\"," + "\"learnerName\": \"Carl\"," + "\"wordCounts\": {}," + "\"sessionTimes\": {}" + "}";


        String testId = "1623445120497";
        mockReq.setBodyContent(fakeLearnerData);
        mockReq.setMethod("POST");
        Context ctx = ContextUtil.init(mockReq, mockRes, "/api/learnerData/:learnerId", ImmutableMap.of("learnerId", testId));
        learnerDataController.postLearnerData(ctx);

        assertEquals(201, mockRes.getStatus());

        Document modifiedLearnerData = db.getCollection("learnerdata").find(eq("learnerId", "1623445120497")).first();

        assertEquals("Carl", modifiedLearnerData.get("learnerName"));

    }

    @Test
    public void StoreBadLearnerData()
    {

    }

    @Test
    public void CreateEmptyLearnerData()
    {

    }

}
