package umm3601.wordRiver;
import java.util.ArrayList;
import org.mongojack.Id;
import org.mongojack.ObjectId;

public class ContextPack {

  @ObjectId @Id
  public String _id;

  public String schema = "https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json";
  public String name;
  public String icon;
  public boolean enabled;
  public ArrayList<WordList> wordlists;
}
