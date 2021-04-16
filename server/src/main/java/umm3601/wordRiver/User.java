package umm3601.wordRiver;
import java.util.ArrayList;
import org.mongojack.Id;
import org.mongojack.ObjectId;


public class User {

  @ObjectId @Id
  public String _id;

  public String name;
  public String icon;
  public ArrayList<String> learners;
  public ArrayList<String> cps;

}
