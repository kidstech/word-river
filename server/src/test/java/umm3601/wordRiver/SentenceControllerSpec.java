package umm3601.wordRiver;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.core.JsonParser;
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
import com.mongodb.client.model.Filters;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.eclipse.jetty.util.ajax.JSON;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

public class SentenceControllerSpec {
    MockHttpServletRequest mockReq = new MockHttpServletRequest();
    MockHttpServletResponse mockRes = new MockHttpServletResponse();

    private SentenceController sentenceController;
    private ObjectId sentenceMongoId;

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

        MongoCollection<Document> ctxDocuments = db.getCollection("sentences");
        ctxDocuments.drop();
        sentenceMongoId = new ObjectId();
        Document johnDoeSentences = new Document().append("_id", sentenceMongoId).append("sentenceId", "2f1d0e3d-1660-44af-9bea-cc4deccf546d").append("sentenceText", "a big ant ate my aunt")
        .append("timeSubmitted", "2/20/2022 8:53:12 PM").append("learnerId", "1623445120497").append("words", Arrays.asList(new Document().append("word", "a").append( "forms", Arrays.asList("a")),
        new Document().append("word", "big").append("forms", Arrays.asList("big", "bigger", "biggest")))).append("selectedWordForms", Arrays.asList("a", "big"))
        .append("userId", "60c1a985926f9c1edcc3a6e8").append("contextPackIds", Arrays.asList("610376992c96b6238f61bc1a","60beabcbbbaa96763c50ae16"));

        ctxDocuments.insertOne(johnDoeSentences);

        sentenceController = new SentenceController(db);
    }

    @AfterAll
    public static void teardown() {
        db.drop();
        mongoClient.close();
    }

    @Test
    public void getExistentLearnerSentences() {
      String learnerId = "1623445120497";

      Context ctx = ContextUtil.init(mockReq, mockRes, "api/sentences/:learnerId", ImmutableMap.of("learnerId", learnerId));
      sentenceController.getSentences(ctx);

      String result = ctx.resultString();
      System.out.println(result);
      Sentence[] resultSentences = JavalinJson.fromJson(result, Sentence[].class);
      List<Sentence> maybe = Arrays.asList(resultSentences);

      ObjectId theId = sentenceMongoId;
      Document ExpectedSentences = db.getCollection("sentences").find(Filters.eq("_id", theId)).first();

      assertEquals(ExpectedSentences.get("sentenceId"), maybe.get(0).sentenceId);
      assertEquals(ExpectedSentences.get("sentenceText"), maybe.get(0).sentenceText);
    }

    @Test
    public void getSentencesWithBadLearnerId() {
      String learnerId = "1623445120491";

      Context ctx = ContextUtil.init(mockReq, mockRes, "api/sentences/:learnerId", ImmutableMap.of("learnerId", learnerId));

      assertThrows(NotFoundResponse.class, () -> {sentenceController.getSentences(ctx);});
    }


    @Test
    public void postValidSentence() {
      //String jsonString = "{'sentenceId':'2f1d0e3d-1660-44af-9bea-cc4deccf546d','sentenceText':'Go Tigers','timeSubmitted':'2/20/2022 8:53:12 PM','learnerId':'1623445120497','words': [{";
      String testStory = "{" +
        "\"sentenceId\": \"2f1d0e3d-1660-44af-9bea-cc4deccf546d\"," +
          "\"sentenceText\": \"Go Tigers\"," +
          "\"timeSubmitted\": \"2/20/2022 8:53:12 PM\"," +
          "\"learnerId\": \"1623445120499\"," +
          "\"words\": [" +
            "{" +
              "\"word\": \"Go\"," +
              "\"forms\": [" +
                "\"Go\"" +
              "]" +
            "}," +
            "{" +
              "\"word\": \"Tigers\"," +
              "\"forms\": [" +
                "\"Tiger\"," +
                "\"Tigers\"" +
              "]" +
            "}" +
          "]," +
          "\"selectedWordForms\": [" +
            "\"Go\","+
            "\"Tigers\"" +
          "]," +
          "\"userId\": \"60c1a985926f9c1edcc3a6e8\"," +
          "\"contextPackIds\": [" +
            "\"610376992c96b6238f61bc1a\"," +
            "\"60beabcbbbaa96763c50ae16\"" +
          "]" +
        "}";

        System.out.println(testStory);

      String testId = "1623445120499";
      mockReq.setBodyContent(testStory);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/sentences/:learnerId", ImmutableMap.of("learnerId", testId));
      sentenceController.postSentence(ctx);

      assertEquals(201, mockRes.getStatus());

      Document newSentence = db.getCollection("sentences").find(Filters.eq("learnerId", testId)).first();

      assertEquals("Go Tigers", newSentence.get("sentenceText"));
    }

    @Test
    public void postInvalidSentence() {
      String invalidStory = "banana";
      String testId = "1623445120499";
      mockReq.setBodyContent(invalidStory);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/sentences/:learnerId", ImmutableMap.of("learnerId", testId));

      assertThrows(BadRequestResponse.class, () -> {sentenceController.postSentence(ctx);});
    }

    @Test
    public void postInvalidSentenceNoSentenceId() {
      String invalidStory = "{" +
        "\"sentenceText\": \"Go Tigers\"," +
        "\"timeSubmitted\": \"2/20/2022 8:53:12 PM\"," +
        "\"learnerId\": \"1623445120499\"," +
        "\"words\": [" +
          "{" +
            "\"word\": \"Go\"," +
            "\"forms\": [" +
              "\"Go\"" +
            "]" +
          "}," +
          "{" +
            "\"word\": \"Tigers\"," +
            "\"forms\": [" +
              "\"Tiger\"," +
              "\"Tigers\"" +
            "]" +
          "}" +
        "]," +
        "\"selectedWordForms\": [" +
          "\"Go\","+
          "\"Tigers\"" +
        "]," +
        "\"userId\": \"60c1a985926f9c1edcc3a6e8\"," +
        "\"contextPackIds\": [" +
          "\"610376992c96b6238f61bc1a\"," +
          "\"60beabcbbbaa96763c50ae16\"" +
        "]" +
      "}";
      String testId = "1623445120499";
      mockReq.setBodyContent(invalidStory);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/sentences/:learnerId", ImmutableMap.of("learnerId", testId));

      assertThrows(BadRequestResponse.class, () -> {sentenceController.postSentence(ctx);});

    }

    @Test
    public void postStoryNoLearnerId() {
      String invalidStory = "{" +
      "\"sentenceId\": \"2f1d0e3d-1660-44af-9bea-cc4deccf546d\"," +
        "\"sentenceText\": \"Go Tigers\"," +
        "\"timeSubmitted\": \"2/20/2022 8:53:12 PM\"," +
        "\"words\": [" +
          "{" +
            "\"word\": \"Go\"," +
            "\"forms\": [" +
              "\"Go\"" +
            "]" +
          "}," +
          "{" +
            "\"word\": \"Tigers\"," +
            "\"forms\": [" +
              "\"Tiger\"," +
              "\"Tigers\"" +
            "]" +
          "}" +
        "]," +
        "\"selectedWordForms\": [" +
          "\"Go\","+
          "\"Tigers\"" +
        "]," +
        "\"userId\": \"60c1a985926f9c1edcc3a6e8\"," +
        "\"contextPackIds\": [" +
          "\"610376992c96b6238f61bc1a\"," +
          "\"60beabcbbbaa96763c50ae16\"" +
        "]" +
      "}";

      String testId = "1623445120499";
      mockReq.setBodyContent(invalidStory);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/sentences/:learnerId", ImmutableMap.of("learnerId", testId));

      assertThrows(BadRequestResponse.class, () -> {sentenceController.postSentence(ctx);});
    }

    @Test
    public void postStoryNoSentenceText() {
      String invalidStory = "{" +
      "\"sentenceId\": \"2f1d0e3d-1660-44af-9bea-cc4deccf546d\"," +
        "\"timeSubmitted\": \"2/20/2022 8:53:12 PM\"," +
        "\"learnerId\": \"1623445120499\"," +
        "\"words\": [" +
          "{" +
            "\"word\": \"Go\"," +
            "\"forms\": [" +
              "\"Go\"" +
            "]" +
          "}," +
          "{" +
            "\"word\": \"Tigers\"," +
            "\"forms\": [" +
              "\"Tiger\"," +
              "\"Tigers\"" +
            "]" +
          "}" +
        "]," +
        "\"selectedWordForms\": [" +
          "\"Go\","+
          "\"Tigers\"" +
        "]," +
        "\"userId\": \"60c1a985926f9c1edcc3a6e8\"," +
        "\"contextPackIds\": [" +
          "\"610376992c96b6238f61bc1a\"," +
          "\"60beabcbbbaa96763c50ae16\"" +
        "]" +
      "}";

      String testId = "1623445120499";
      mockReq.setBodyContent(invalidStory);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/sentences/:learnerId", ImmutableMap.of("learnerId", testId));

      assertThrows(BadRequestResponse.class, () -> {sentenceController.postSentence(ctx);});
    }

    @Test
    public void postStoryNoTimeSubmitted() {
      String invalidStory = "{" +
      "\"sentenceId\": \"2f1d0e3d-1660-44af-9bea-cc4deccf546d\"," +
        "\"sentenceText\": \"Go Tigers\"," +
        "\"learnerId\": \"1623445120499\"," +
        "\"words\": [" +
          "{" +
            "\"word\": \"Go\"," +
            "\"forms\": [" +
              "\"Go\"" +
            "]" +
          "}," +
          "{" +
            "\"word\": \"Tigers\"," +
            "\"forms\": [" +
              "\"Tiger\"," +
              "\"Tigers\"" +
            "]" +
          "}" +
        "]," +
        "\"selectedWordForms\": [" +
          "\"Go\","+
          "\"Tigers\"" +
        "]," +
        "\"userId\": \"60c1a985926f9c1edcc3a6e8\"," +
        "\"contextPackIds\": [" +
          "\"610376992c96b6238f61bc1a\"," +
          "\"60beabcbbbaa96763c50ae16\"" +
        "]" +
      "}";

      String testId = "1623445120499";
      mockReq.setBodyContent(invalidStory);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/sentences/:learnerId", ImmutableMap.of("learnerId", testId));

      assertThrows(BadRequestResponse.class, () -> {sentenceController.postSentence(ctx);});
    }

    @Test
    public void postStoryNoWords() {
      String invalidStory = "{" +
      "\"sentenceId\": \"2f1d0e3d-1660-44af-9bea-cc4deccf546d\"," +
        "\"sentenceText\": \"Go Tigers\"," +
        "\"timeSubmitted\": \"2/20/2022 8:53:12 PM\"," +
        "\"learnerId\": \"1623445120499\"," +
        "\"selectedWordForms\": [" +
          "\"Go\","+
          "\"Tigers\"" +
        "]," +
        "\"userId\": \"60c1a985926f9c1edcc3a6e8\"," +
        "\"contextPackIds\": [" +
          "\"610376992c96b6238f61bc1a\"," +
          "\"60beabcbbbaa96763c50ae16\"" +
        "]" +
      "}";

      String testId = "1623445120499";
      mockReq.setBodyContent(invalidStory);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/sentences/:learnerId", ImmutableMap.of("learnerId", testId));

      assertThrows(BadRequestResponse.class, () -> {sentenceController.postSentence(ctx);});
    }

    @Test
    public void postStoryNoSelectedWordForms() {
      String invalidStory = "{" +
      "\"sentenceId\": \"2f1d0e3d-1660-44af-9bea-cc4deccf546d\"," +
        "\"sentenceText\": \"Go Tigers\"," +
        "\"timeSubmitted\": \"2/20/2022 8:53:12 PM\"," +
        "\"learnerId\": \"1623445120499\"," +
        "\"words\": [" +
          "{" +
            "\"word\": \"Go\"," +
            "\"forms\": [" +
              "\"Go\"" +
            "]" +
          "}," +
          "{" +
            "\"word\": \"Tigers\"," +
            "\"forms\": [" +
              "\"Tiger\"," +
              "\"Tigers\"" +
            "]" +
          "}" +
        "]," +
        "\"userId\": \"60c1a985926f9c1edcc3a6e8\"," +
        "\"contextPackIds\": [" +
          "\"610376992c96b6238f61bc1a\"," +
          "\"60beabcbbbaa96763c50ae16\"" +
        "]" +
      "}";

      String testId = "1623445120499";
      mockReq.setBodyContent(invalidStory);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/sentences/:learnerId", ImmutableMap.of("learnerId", testId));

      assertThrows(BadRequestResponse.class, () -> {sentenceController.postSentence(ctx);});
    }

    @Test
    public void postStoryNoUserId() {
      String invalidStory = "{" +
      "\"sentenceId\": \"2f1d0e3d-1660-44af-9bea-cc4deccf546d\"," +
        "\"sentenceText\": \"Go Tigers\"," +
        "\"timeSubmitted\": \"2/20/2022 8:53:12 PM\"," +
        "\"learnerId\": \"1623445120499\"," +
        "\"words\": [" +
          "{" +
            "\"word\": \"Go\"," +
            "\"forms\": [" +
              "\"Go\"" +
            "]" +
          "}," +
          "{" +
            "\"word\": \"Tigers\"," +
            "\"forms\": [" +
              "\"Tiger\"," +
              "\"Tigers\"" +
            "]" +
          "}" +
        "]," +
        "\"selectedWordForms\": [" +
          "\"Go\","+
          "\"Tigers\"" +
        "]," +
        "\"contextPackIds\": [" +
          "\"610376992c96b6238f61bc1a\"," +
          "\"60beabcbbbaa96763c50ae16\"" +
        "]" +
      "}";

      String testId = "1623445120499";
      mockReq.setBodyContent(invalidStory);
      mockReq.setMethod("POST");
      Context ctx = ContextUtil.init(mockReq, mockRes, "/api/sentences/:learnerId", ImmutableMap.of("learnerId", testId));

      assertThrows(BadRequestResponse.class, () -> {sentenceController.postSentence(ctx);});
    }
}
