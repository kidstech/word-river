package umm3601.wordRiver;

import static com.mongodb.client.model.Filters.eq;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
//import java.sql.Date;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;

import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import kotlin.time.TimeSourceKt;

public class SentenceController {

    protected final JacksonMongoCollection<Sentence> sentenceCollection;
    StoryController storyController = null;

    /**
     * Construct a controller for Sentences
     *
     * @param database
     */
    public SentenceController(StoryController storyController, MongoDatabase database) {
        sentenceCollection = JacksonMongoCollection.builder().build(database, "sentences", Sentence.class);
        this.storyController = storyController;
    }

    // need to add proper error checking
    public void getSentences(Context ctx) {
        String learnerId = ctx.pathParam("learnerId");
        List<Sentence> sentences = new ArrayList<Sentence>();
        FindIterable<Sentence> sentenceIterator = sentenceCollection.find(eq("learnerId", learnerId)); // help on FindIterable from https://stackoverflow.com/questions/35768418/how-to-use-finditerabledocument-to-get-the-specific-field-from-mongodb-using-j/35769497
        for (Sentence sentence: sentenceIterator)
        {
            sentences.add(sentence);
        }
        if (sentences.isEmpty())
        {
            throw new NotFoundResponse("The selected learner did not have any sentences.");
        }
        ctx.json(sentences);
    }

    public void postSentence(Context ctx) {
        System.out.println("posting sentence...");
        // make sure the sentence has all the fields we expect
        Sentence sentence = ctx.bodyValidator(Sentence.class).check(sen -> sen.sentenceId != null && sen.learnerId != null && sen.selectedWordForms != null && sen.sentenceText != null && sen.timeSubmitted != null && sen.userId != null && sen.words != null).get();
        sentenceCollection.insert(sentence);
        ctx.status(201);
      }

      public void updateSentence(Context ctx) {
        String sentenceId = ctx.pathParam("sentenceId");
        System.out.println(ctx.pathParam("sentenceId"));
        Sentence sentenceToUpdate = sentenceCollection.findOne(eq("sentenceId", sentenceId));
        sentenceToUpdate.deleted = true;
        System.out.println(sentenceToUpdate.deleted);
        sentenceCollection.replaceOne(eq("_id", new ObjectId(sentenceToUpdate.mongoObjectId)), sentenceToUpdate);
        ctx.status(200);
      }

    public void getRecentSentences(Context ctx) throws ParseException {
      String learnerId = ctx.pathParam("learnerId");
      //Timestamp mostRecentTime = Timestamp.valueOf("2018-09-01 09:01:15");
      //Timestamp mostRecentTime = Date.getTime(storyController.getRecentStory());
      String mostRecentTime = storyController.getRecentStory();
      SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy hh:mm:ss");
      Date parsedDate = dateFormat.parse(mostRecentTime);
      Timestamp timestamp = new Timestamp(parsedDate.getTime());
      System.out.println(mostRecentTime);
      ArrayList<Sentence> sentences = new ArrayList<Sentence>();
      FindIterable<Sentence> sentenceIterator = sentenceCollection.find(eq("learnerId", learnerId));
      for(Sentence sentence: sentenceIterator) {
        String date = sentence.timeSubmitted;
        SimpleDateFormat dateSentenceFormat = new SimpleDateFormat("MM/dd/yyyy hh:mm:ss");
        Date parsedSentenceDate = dateSentenceFormat.parse(date);
        Timestamp sentenceTimeStamp = new Timestamp(parsedSentenceDate.getTime());
        System.out.println(sentenceTimeStamp.after(timestamp));
        if(sentenceTimeStamp.after(timestamp) && !sentence.deleted) {
          sentences.add(sentence);
        }
      }
      ctx.json(sentences);

    }
}
