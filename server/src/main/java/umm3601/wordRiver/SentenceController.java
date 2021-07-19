package umm3601.wordRiver;

import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.List;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

public class SentenceController {

    protected final JacksonMongoCollection<Sentence> sentenceCollection;

    /**
     * Construct a controller for Sentences
     * 
     * @param database
     */
    public SentenceController(MongoDatabase database) {
        sentenceCollection = JacksonMongoCollection.builder().build(database, "sentences", Sentence.class);
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

}
