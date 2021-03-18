package umm3601.wordlists;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class WordList {

  public String name;
  public boolean enabled;
  public Word[] nouns;
  public Word[] verbs;
  public Word[] adjectives;
  public Word[] misc;

  @JsonCreator
  public WordList(
    @JsonProperty("name") String name,
    @JsonProperty("enabled") boolean enabled,
    @JsonProperty("nouns") Word[] nouns,
    @JsonProperty("verbs") Word[] verbs,
    @JsonProperty("adjectives") Word[] adjectives,
    @JsonProperty("misc") Word[] misc
    ){
    this.name = name;
    this.enabled = enabled;
    this.nouns = nouns;
    this.verbs = verbs;
    this.adjectives = adjectives;
    this.misc = misc;
  }
}
