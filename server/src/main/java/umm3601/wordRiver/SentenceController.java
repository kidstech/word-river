package umm3601.wordRiver;

import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.List;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;

import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

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

    public void getRecentSentences(Context ctx) {
      String learnerId = ctx.pathParam("learnerId");
      String mostRecentTime = storyController.getRecentStory();
      String mostRecentDate = "";
      int mostRecentMinute = 0;
      int mostRecentSecond = 0;
      int recentMonth = 0;
      int recentDay = 0;
      int recentYear = 0;
      if (mostRecentTime.equals("oops") || !mostRecentTime.equals("oops")){
          mostRecentDate = mostRecentTime.split(" ")[0];
          System.out.println(mostRecentTime.split(" ")[1].split(":")[1]);
          mostRecentMinute = Integer.parseInt(mostRecentTime.split(" ")[1].split(":")[1]);
          mostRecentSecond = Integer.parseInt(mostRecentTime.split(" ")[1].split(":")[2]);
          recentMonth = Integer.parseInt(mostRecentDate.split("/")[0]);
          recentDay = Integer.parseInt(mostRecentDate.split("/")[1]);
          recentYear = Integer.parseInt(mostRecentDate.split("/")[2]);
      }
      System.out.println(mostRecentTime);
      ArrayList<Sentence> sentences = new ArrayList<Sentence>();
      FindIterable<Sentence> sentenceIterator = sentenceCollection.find(eq("learnerId", learnerId));
      for(Sentence sentence: sentenceIterator) {
        String date = sentence.timeSubmitted.split(" ")[0];
        int month = Integer.parseInt(date.split("/")[0]);
        int day = Integer.parseInt(date.split("/")[1]);
        int year = Integer.parseInt(date.split("/")[2]);
        int minute = Integer.parseInt(sentence.timeSubmitted.split(" ")[1].split(":")[1]);
        int second = Integer.parseInt(sentence.timeSubmitted.split(" ")[1].split(":")[2]);
        if ( (month >= recentMonth && day >= recentDay && year >= recentYear && !sentence.deleted)) {
            if(mostRecentTime.equals("oops") || (minute > mostRecentMinute) || (minute == mostRecentMinute && second > mostRecentSecond) ) {
                //System.out.println(minute > mostRecentMinute);
                //System.out.println("This is the sentence minute: " + minute);
                //System.out.println("This is the most recent story minute: " + mostRecentMinute);
                //System.out.println("I passed the if check: " + sentence.sentenceText);
                sentences.add(sentence);

            }
        }
      }
      ctx.json(sentences);

    }

}
