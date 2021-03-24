package umm3601.mongotest;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.*;
import org.bson.Document;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import static com.mongodb.client.model.Filters.*;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Some simple "tests" that demonstrate our ability to
 * connect to a Mongo database and run some basic queries
 * against it.
 * <p>
 * Note that none of these are actually tests of any of our
 * code; they are mostly demonstrations of the behavior of
 * the MongoDB Java libraries. Thus if they test anything,
 * they test that code, and perhaps our understanding of it.
 * <p>
 * To test "our" code we'd want the tests to confirm that
 * the behavior of methods in things like the UserController
 * do the "right" thing.
 * <p>
 * Created by mcphee on 20/2/17.
 */
public class MongoSpec {

  private MongoCollection<Document> contextPackDocuments;

  static MongoClient mongoClient;
  static MongoDatabase db;

  @BeforeAll
  public static void setupDB() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
      MongoClientSettings.builder()
      .applyToClusterSettings(builder ->
        builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
      .build());

    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  public void clearAndPopulateDB() {
   //Setup database
  contextPackDocuments = db.getCollection("packs");
  contextPackDocuments.drop();
  ArrayList<Document> testPacks = new ArrayList<>();
  testPacks.add(
    new Document()
      .append("name", "iron man")
      .append("icon", "iron.png")
      .append("enabled", true)
      .append("wordlist", Arrays.asList(new Document().append("name", "iron man").append("enabled", true)
      .append("nouns", Arrays.asList(new Document("word", "suit").append("forms", Arrays.asList( "suit", "suits"))))
      .append("verbs", Arrays.asList(new Document("word", "fight").append("forms", Arrays.asList("fight", "fights"))))
      .append("adjectives", Arrays.asList(new Document("word", "big").append("forms", Arrays.asList("big", "biggish"))))
      .append("misc", Arrays.asList(new Document("word", "the").append("forms", Arrays.asList("the")))) )
      ));

  testPacks.add(
    new Document()
      .append("name", "captain america")
      .append("icon", "cap.png")
      .append("enabled", false)
      .append("wordlist", Arrays.asList(new Document().append("name", "captain america").append("enabled", true)
      .append("nouns", Arrays.asList(new Document("word", "suit").append("forms", Arrays.asList("suit", "suits"))))
      .append("verbs", Arrays.asList(new Document("word", "fight").append("forms", Arrays.asList("fight", "fights"))))
      .append("adjectives", Arrays.asList(new Document("word", "big").append("forms", Arrays.asList( "big","biggish"))))
      .append("misc", Arrays.asList(new Document("word", "the").append("forms", Arrays.asList("the")))) )
      ));

  contextPackDocuments.insertMany(testPacks);
  }

  private List<Document> intoList(MongoIterable<Document> documents) {
    List<Document> contextPacks = new ArrayList<>();
    documents.into(contextPacks);
    return contextPacks;
  }

  private int countContextPacks(FindIterable<Document> documents) {
    List<Document> contextPacks = intoList(documents);
    return contextPacks.size();
  }

  @Test
  public void shouldBeTwoContextPacks() {
    FindIterable<Document> documents = contextPackDocuments.find();
    int numberOfUsers = countContextPacks(documents);
    assertEquals(2, numberOfUsers, "Should be 2 total context packs");
  }

  @Test
  public void shouldBeOneCaptainAmerica() {
    FindIterable<Document> documents = contextPackDocuments.find(eq("name", "captain america"));
    int numberOfContextPacks = countContextPacks(documents);
    assertEquals(1, numberOfContextPacks, "Should be 1 Captain America");
  }

  @Test
  public void shouldBeOneEnabled() {
    FindIterable<Document> documents = contextPackDocuments.find(eq("enabled", true));
    int numberOfContextPacks = countContextPacks(documents);
    assertEquals(1, numberOfContextPacks, "Should be 1 enabled");
  }

  @Test
  public void shouldHaveCapIcon() {
    FindIterable<Document> documents = contextPackDocuments.find(gt("icon", "cap.png"));
    int numberOfContextPacks = countContextPacks(documents);
    assertEquals(1, numberOfContextPacks, "Should be 1 with cap.png");
  }

}
