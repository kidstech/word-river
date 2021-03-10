package umm3601.mongotest;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.*;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;
import org.bson.Document;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import umm3601.wordlists.Word;

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

  private MongoCollection<Document> wordListDocuments;

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
    wordListDocuments = db.getCollection("wordlists");
    wordListDocuments.drop();
    List<Document> testWordLists = new ArrayList<>();
    testWordLists.add(
      new Document()
        .append("name", "Chris")
        .append("enabled", true)
        .append("nouns", Arrays.asList(new Word("Tuna",new String[]{"Tunas, Tunae"}),new Word("Dog",new String[]{"Doge, Doggo"})))
        .append("verbs", Arrays.asList(new Word("Run", new String[]{"Ran", "Runs"}), new Word("Jump", new String[]{"Jumped", "Jumping"})))
        .append("adjectives", Arrays.asList(new Word("Fluffy", new String[]{"Fluffier", "Fluffiest"})))
        .append("misc", Arrays.asList(new Word("Over", new String[]{"Overs"}), new Word("Above", new String[]{"Aboved"}))));
    testWordLists.add(
      new Document()
        .append("name", "Ann")
        .append("enabled", false)
        .append("nouns", Arrays.asList(new Word("Store",new String[]{"Stores"}),new Word("Cat",new String[]{"Cats"})))
        .append("verbs", Arrays.asList(new Word("Hit", new String[]{"Hits", "Hitting"}), new Word("Spin", new String[]{"Spun", "Spinning"}) ))
        .append("adjectives", Arrays.asList())
        .append("misc", Arrays.asList(new Word("Under", new String[]{"Undering"}))));
    testWordLists.add(
      new Document()
        .append("name", "Mary")
        .append("enabled", false)
        .append("nouns", Arrays.asList(new Word("Fish",new String[]{"Fishes, Fishy"}),new Word("Garbage",new String[]{"Garbages, Garbaged"})))
        .append("verbs", Arrays.asList(new Word("Skip", new String[]{"Skipped", "Skipped"}), new Word("Swirl", new String[]{"Swirled", "Swirls"})))
        .append("adjectives", Arrays.asList(new Word("Hurl", new String[]{"Hurled", "Hurling"}), new Word("Skim", new String[]{"Skimmed", "Skimming"})))
        .append("misc", Arrays.asList(new Word("Around", new String[]{"Arounded"}))));

    wordListDocuments.insertMany(testWordLists);
  }

  private List<Document> intoList(MongoIterable<Document> documents) {
    List<Document> WordLists = new ArrayList<>();
    documents.into(WordLists);
    return WordLists;
  }

  private int countWordLists(FindIterable<Document> documents) {
    List<Document> WordLists = intoList(documents);
    return WordLists.size();
  }

  @Test
  public void shouldBeThreeWordLists() {
    FindIterable<Document> documents = wordListDocuments.find();
    int numberOfWordLists = countWordLists(documents);
    assertEquals(3, numberOfWordLists, "Should be 3 total WordLists");
  }

  @Test
  public void shouldBeOneChris() {
    FindIterable<Document> documents = wordListDocuments.find(eq("name", "Chris"));
    int numberOfWordLists = countWordLists(documents);
    assertEquals(1, numberOfWordLists, "Should be 1 Chris");
  }

  @Test
  public void shouldBeTwoDisabled() {
    FindIterable<Document> documents = wordListDocuments.find(gt("enabled", false));
    int numberOfWordLists = countWordLists(documents);
    assertEquals(2, numberOfWordLists, "Should be disabled");
  }

  @Test
  public void justNameAndNouns() {
    FindIterable<Document> documents
      = wordListDocuments.find()
      .projection(fields(include("name", "nouns")));
    List<Document> docs = intoList(documents);
    assertNotNull(docs.get(0).get("name"));
    assertNotNull(docs.get(0).get("nouns"));
    assertNull(docs.get(0).get("adjectives"));
    assertNull(docs.get(0).get("adverbs"));
    assertNull(docs.get(0).get("misc"));
  }

}
