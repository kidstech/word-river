package umm3601.contextpacks;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnoreType;
import com.google.common.collect.Lists;

import org.eclipse.jetty.util.ajax.JSONPojoConvertor;
import org.mongojack.ObjectId;

import io.javalin.http.NotFoundResponse;
import umm3601.wordlists.WordList;

public class ContextPack {
  @ObjectId
  @Id
  public String id;
  public String name;
  public String icon;
  public boolean enabled;
  public WordList[] wordlists;

  public void setName(String name) {
    this.name = name;
  }

  public void addWordList(WordList wordList) {
    List<WordList> temp = Arrays.asList(wordlists);
    temp.add(wordList);
    wordlists = (WordList[]) temp.toArray();
  }

  public void deleteWordList(String name) {
    List<WordList> temp = Arrays.asList(wordlists);

    System.out.println();

    if (temp.stream().anyMatch(i -> i.name.equals(name)))
      temp.removeIf(i -> i.name.equals(name));
    else throw new NotFoundResponse("The requested word list was not found");

    wordlists = (WordList[]) temp.toArray();
  }

  public WordList getWordListByName(String name) {
    List<WordList> temp = Arrays.asList(wordlists);
    WordList[] result = new WordList[] { null };
    temp.stream().filter(list -> list.name.equals(name)).findFirst().ifPresent(list -> {
      result[0] = list;
    });
    if (result[0] == null)
      throw new NotFoundResponse("The requested word list was not found");
    else
      return result[0];
  }

  public void editWordList(String name, WordList wordList) {
    List<WordList> temp = Arrays.asList(wordlists);
    WordList original = getWordListByName(name);
    if (temp.contains(original))
      temp.set(temp.indexOf(original), wordList);
    wordlists = (WordList[]) temp.toArray();
  }

  public WordList[] getWordLists() {
    return wordlists;
  }
}
