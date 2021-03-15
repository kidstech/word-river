package umm3601.mongotest;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.*;
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
    contextPackDocuments = db.getCollection("ContextPacks");
    contextPackDocuments.drop();
    List<Document> testContextPacks = new ArrayList<>();
    Document t = Document.parse("{\r\n\"name\":\"Farm Pack\",\r\n\"enabled\":true,\r\n\"icon\":\"\",\r\n\"wordlists\":[\r\n{\r\n\"name\":\"farm\",\r\n\"enabled\":true,\r\n\"nouns\":[\r\n{\r\n\"word\":\"somestuff\",\r\n\"forms\":[\r\n\"cake\",\r\n\"cakes\"\r\n]\r\n}\r\n],\r\n\"verbs\":[\r\n{\r\n\"word\":\"blow\",\r\n\"forms\":[\r\n\"blow\",\r\n\"blows\",\r\n\"blew\",\r\n\"blown\",\r\n\"blowing\"\r\n]\r\n}\r\n],\r\n\"adjectives\":[\r\n{\r\n\"word\":\"fun\",\r\n\"forms\":[\r\n\"fun\"\r\n]\r\n}\r\n],\r\n\"misc\":[]\r\n}\r\n]\r\n}");
    Document t1 = Document.parse("{\r\n\"name\":\"Sad Pack\",\r\n\"enabled\":false,\r\n\"icon\":\"\",\r\n\"wordlists\":[\r\n{\r\n\"name\":\"sad\",\r\n\"enabled\":false,\r\n\"nouns\":[\r\n{\r\n\"word\":\"somestuff\",\r\n\"forms\":[\r\n\"cake\",\r\n\"cakes\"\r\n]\r\n}\r\n],\r\n\"verbs\":[\r\n{\r\n\"word\":\"cry\",\r\n\"forms\":[\r\n\"cried\",\r\n\"crying\",\r\n\"blew\",\r\n\"blown\",\r\n\"blowing\"\r\n]\r\n}\r\n],\r\n\"adjectives\":[\r\n{\r\n\"word\":\"sad\",\r\n\"forms\":[\r\n\"sad\"\r\n]\r\n}\r\n],\r\n\"misc\":[]\r\n}\r\n]\r\n}");
    Document t2 = Document.parse("{\r\n\"name\":\"Fun Pack\",\r\n\"enabled\":true,\r\n\"icon\":\"testicon3\",\r\n\"wordlists\":[\r\n{\r\n\"name\":\"fun\",\r\n\"enabled\":true,\r\n\"nouns\":[\r\n{\r\n\"word\":\"somestuff\",\r\n\"forms\":[\r\n\"cake\",\r\n\"cakes\"\r\n]\r\n}\r\n],\r\n\"verbs\":[\r\n{\r\n\"word\":\"blow\",\r\n\"forms\":[\r\n\"blow\",\r\n\"blows\",\r\n\"blew\",\r\n\"blown\",\r\n\"blowing\"\r\n]\r\n}\r\n],\r\n\"adjectives\":[\r\n{\r\n\"word\":\"Sad\",\r\n\"forms\":[\r\n\"sad\"\r\n]\r\n}\r\n],\r\n\"misc\":[]\r\n}\r\n]\r\n}");

    testContextPacks.add(t);
    testContextPacks.add(t1);
    testContextPacks.add(t2);

    contextPackDocuments.insertMany(testContextPacks);
  }

  private List<Document> intoList(MongoIterable<Document> documents) {
    List<Document> ContextPacks = new ArrayList<>();
    documents.into(ContextPacks);
    return ContextPacks;
  }

  private int countContextPacks(FindIterable<Document> documents) {
    List<Document> ContextPacks = intoList(documents);
    return ContextPacks.size();
  }

  @Test
  public void shouldBeThreeContextPacks() {
    FindIterable<Document> documents = contextPackDocuments.find();
    int numberOfContextPacks = countContextPacks(documents);
    assertEquals(3, numberOfContextPacks, "Should be 3 total ContextPacks");
  }

  @Test
  public void shouldBeOneFarmPack() {
    FindIterable<Document> documents = contextPackDocuments.find(eq("name", "Farm Pack"));
    int numberOfContextPacks = countContextPacks(documents);
    assertEquals(1, numberOfContextPacks, "Should be 1 Chris");
  }

  @Test
  public void shouldBeTwoEnabled() {
    FindIterable<Document> documents = contextPackDocuments.find(eq("enabled", true));
    int numberOfContextPacks = countContextPacks(documents);
    assertEquals(2, numberOfContextPacks, "Should be 2 enabled");
  }

  @Test
  public void hasIcon() {
    FindIterable<Document> documents = contextPackDocuments.find(ne("icon", ""));
    int numberOfContextPacks = countContextPacks(documents);
    assertEquals(1, numberOfContextPacks, "Should be 1 with icon");
  }//(* ￣︿￣)

  @Test
  public void enabledAndHasIcon() {
    FindIterable<Document> documents
      = contextPackDocuments.find(and(eq("enabled", true),
      ne("icon", "")));
    List<Document> docs = intoList(documents);
    assertEquals(1, docs.size(), "Should be 1");
    assertEquals("Fun Pack", docs.get(0).get("name"), "Name should be Fun Pack");
  }// ლ(╹◡╹ლ) <

  @Test
  public void justNameAndEnabled() {
    FindIterable<Document> documents
      = contextPackDocuments.find().projection(fields(include("name", "enabled")));
    List<Document> docs = intoList(documents);
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Sad Pack", docs.get(1).get("name"), "Second pack should be Sad Pack");
    assertNotNull(docs.get(1).get("enabled"), "Second pack should not have enabled field");
    assertNull(docs.get(1).get("icon"), "Second pack shouldn't have 'icon'");
  } //(●'◡'●)（＾∀＾●）ﾉｼ
}
