package umm3601.contextpacks;


import javax.persistence.Id;
import org.mongojack.ObjectId;
import umm3601.wordlists.WordList;

public class ContextPack {
  @ObjectId
  @Id
  public String id;
  public String name;
  public String icon;
  public boolean enabled;
  public WordList[] wordlists;
}
