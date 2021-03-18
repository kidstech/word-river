package umm3601.wordlists;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Word {
  public String word;
  public String[] forms;
  @JsonCreator
  public Word(@JsonProperty("word") String word,@JsonProperty("forms") String[] forms){
    this.word = word;
    this.forms = forms;
  }
}
