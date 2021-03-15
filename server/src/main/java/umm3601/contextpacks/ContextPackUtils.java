package umm3601.contextpacks;

import java.util.Arrays;
import java.util.List;

import io.javalin.http.NotFoundResponse;
import umm3601.wordlists.WordList;

public class ContextPackUtils {
  ContextPack contextPack;
  public ContextPackUtils(ContextPack cp){
    contextPack = cp;
  }
  public void addWordList(WordList wordList) {
    if (wordListsContain(wordList.name))
      throw new RuntimeException();

    WordList[] result = Arrays.copyOf(contextPack.wordlists, contextPack.wordlists.length + 1);
    result[contextPack.wordlists.length] = wordList;
    contextPack.wordlists = result;
  }

  public void deleteWordList(String name) {
    if (contextPack.wordlists.length == 0)
      throw new RuntimeException();
    WordList[] copy = new WordList[contextPack.wordlists.length - 1];

    for (int i = 0, j = 0; i < contextPack.wordlists.length; i++) {
      if (!contextPack.wordlists[i].name.equals(name)) {
        copy[j++] = contextPack.wordlists[i];
      }
    }

    contextPack.wordlists = copy;
  }

  public WordList getWordListByName(String name) {
    List<WordList> temp = Arrays.asList(contextPack.wordlists);
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

    WordList[] copy = new WordList[contextPack.wordlists.length];

    for (int i = 0, j = 0; i < contextPack.wordlists.length; i++) {
      if (!contextPack.wordlists[i].name.equals(name)) {
        copy[j++] = contextPack.wordlists[i];
      } else {
        copy[j++] = wordList;
      }
    }

    contextPack.wordlists = copy;
  }

  public boolean wordListsContain(String name) {
    return Arrays.asList(contextPack.wordlists).stream().anyMatch(i -> i.name.equals(name));
  }

  public WordList[] getWordLists() {
    return contextPack.wordlists;
  }

  public ContextPack getContextPack() {
    return contextPack;
  }
}
