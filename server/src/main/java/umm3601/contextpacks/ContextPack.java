package umm3601.contextpacks;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnoreType;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.google.common.collect.Lists;

import org.eclipse.jetty.util.ajax.JSONPojoConvertor;
import org.mongojack.ObjectId;

import io.javalin.http.NotFoundResponse;
import io.javalin.http.HttpResponseException;
import umm3601.wordlists.WordList;

public class ContextPack {
  @ObjectId
  @Id
  public String id;
  public String name;
  public String icon;
  public boolean enabled;
  public WordList[] wordlists;


  public void addWordList(WordList wordList) {
    if (wordListsContain(wordList.name))
      throw new RuntimeException();

    WordList[] result = Arrays.copyOf(wordlists, wordlists.length + 1);
    result[wordlists.length] = wordList;
    wordlists = result;
  }

  public void deleteWordList(String name) {
    if (wordlists.length == 0)
      throw new RuntimeException();
    WordList[] copy = new WordList[wordlists.length - 1];

    for (int i = 0, j = 0; i < wordlists.length; i++) {
      if (!wordlists[i].name.equals(name)) {
        copy[j++] = wordlists[i];
      }
    }

    wordlists = copy;
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
    if (!wordListsContain(name))
      throw new RuntimeException();

    WordList[] copy = new WordList[wordlists.length];

    for (int i = 0, j = 0; i < wordlists.length; i++) {
      if (!wordlists[i].name.equals(name)) {
        copy[j++] = wordlists[i];
      } else {
        copy[j++] = wordList;
      }
    }

    wordlists = copy;
  }

  public boolean wordListsContain(String name) {
    return Arrays.asList(wordlists).stream().anyMatch(i -> i.name.equals(name));
  }

  public WordList[] getWordLists() {
    return wordlists;
  }
}
