package umm3601.contextpacks;

import com.mongodb.client.MongoDatabase;

import static com.mongodb.client.model.Filters.eq;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.mongojack.JacksonMongoCollection;

import io.javalin.http.NotFoundResponse;

public class ContextPackController {

  private final JacksonMongoCollection<ContextPack> ContextPackCollection;
  String def = "{\r\n\"name\":\"Birthday Pack\",\r\n\"enabled\":true,\r\n\"icon\":\"testicon1\",\r\n\"wordlists\":[\r\n{\r\n\"name\":\"birthday\",\r\n\"enabled\":true,\r\n\"nouns\":[\r\n{\r\n\"word\":\"somestuff\",\r\n\"forms\":[\r\n\"cake\",\r\n\"cakes\"\r\n]\r\n}\r\n],\r\n\"verbs\":[\r\n{\r\n\"word\":\"blow\",\r\n\"forms\":[\r\n\"blow\",\r\n\"blows\",\r\n\"blew\",\r\n\"blown\",\r\n\"blowing\"\r\n]\r\n}\r\n],\r\n\"adjectives\":[\r\n{\r\n\"word\":\"fun\",\r\n\"forms\":[\r\n\"fun\"\r\n]\r\n}\r\n],\r\n\"misc\":[]\r\n}\r\n]\r\n}";

  /**
   * Construct a controller for ContextPacks.
   *
   * @param database the database containing ContextPack data
   */
  public ContextPackController(MongoDatabase database) {
    ContextPackCollection = JacksonMongoCollection.builder().build(database, "contextpacks", ContextPack.class);
  }

  /**
   * Get the default contextpack
   *
   * @param ctx a Javalin HTTP context
   * @throws JsonProcessingException
   * @throws JsonMappingException
   */
  public ContextPack getDefaultContextPack() {
    String name = "Birthday Pack";
    ContextPack contextPack = new ContextPack();
    contextPack = ContextPackCollection.find(eq("name", name)).first();
    if (contextPack == null) {
      ObjectMapper objectMapper = new ObjectMapper();
      try {
        contextPack = objectMapper.readValue(def, umm3601.contextpacks.ContextPack.class);
        ContextPackCollection.insertOne(contextPack);
      } catch (JsonProcessingException e1) {
        throw new NotFoundResponse("Default pack could not be found.");
      }
    }
    return contextPack;
  }

  public void updateContextPack(ContextPack contextPack) {
    ContextPackCollection.replaceOne(eq("name", contextPack.name), contextPack);
  }

}
