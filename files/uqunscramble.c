#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>
#include <csse2310a1.h>

// Struct that holds two integers, as these vars are normally used together,
// only need to pass struct instead of two seperate ints.
typedef struct Lengths {
    int givenMinLength;
    int givenMaxLength;
} Lengths;

// A struct holding the main program arguments, so they can be passed easier
// to functions.
typedef struct Arguments {
    char* givenChars;
    bool charsProvided;
    char* givenDict;
    bool dictProvided;
    Lengths* minMax;
    bool lenProvided;
    bool usageError;
} Arguments;

// Parameters needed to run the main game loop, word checking, memory etc.
typedef struct Parameters {
    char* word;
    const char* givenChars;
    Lengths minMax;
    char** guessedWords;
    int* guessedWordsCount;
    char** dict;
    const int* dictLength;
    bool toggleOutput;
} Parameters;

// Parameters needed to load and store dictionaries within the program.
typedef struct DictParams {
    char* givenDict;
    FILE* dict;
    int* dictLength;
    char* givenChars;
    Lengths minMax;
    bool* loadError;
} DictParams;

Arguments process_args(Arguments givenArgs, int argc, char** argv);
void welcome_message(char* givenChars, Lengths minMax);
int end_game_message(int playerScore);
int game_loop(const char* givenChars, char** dict, const int* dictLength,
        Lengths minMax);
char* receive_input();
int scorer(char* word, int currentScore, int givenMaxLength);
bool word_in_dict(char* word, char** dict, int dictLength);
bool word_check(Parameters* wordCheckParams);
bool guessed_words(Parameters* wordCheckParams);
int check_min_length(int givenMinLength);
int check_given_chars(char* givenChars, int givenMinLength);
char** check_given_dict(DictParams check);
char** load_given_dict(DictParams load);
char* read_line(FILE* stream, bool* endOfFileReached);
bool word_in_chars(char* word, const char* givenChars);
void clean_exit(Arguments givenArgs, char** loadedDict, int dictLength);
void free_guessed_words(char** guessedWords, char* guess, int count);
int word_compare(const void* p1, const void* p2);
bool is_input_int(char* num);

const char usageError[] = "Usage: uqunscramble [--min-length len] "
                          "[--chars characters] [--dict dictfile]";
const char defaultDict[] = "/local/courses/csse2310/etc/words";
const int defaultMinLen = 4; // Default for minimum length.
const int minimumMinLen = 3; // Minimum length for minimum length.
const int maximumMinLen = 6; // Maximum length for minimum length.
const int maxNumProgArgs = 7; // Maximum number of program arguments
                              // that will be considered.
const int defaultNumLet = 9; // Default number of letters to retrieve.
const int maxWordLenBonus = 10; // Bonus for getting a word == maxLength.
const int maxGivenChars = 13; // Maximum number of chars that can be provided.

// Exit codes defined by the specification.
enum ExitCodes {
    FINISHED_GAME = 0,
    MAX_LET_ERROR = 1,
    UNPLAYED_GAME = 2,
    DICT_ERROR = 5,
    INVALID_LET_ERROR = 6,
    TOO_FEW_LET_ERROR = 9,
    MIN_LEN_ERROR = 11,
    USAGE_ERROR = 17,
};

/* main()
 * −−−−−−−−−−−−−−−
 * Main program function which can be provided with the following arguments in
 * this order:
 * [--min-length len] [--chars characters] [--dict dictfile]
 * Where --min-length defines the minimum length for the words that can be made
 * in the game.
 * --chars defines the usable characters that words can be made out of.
 * --dict is full path to the dictionary file that will be used for gameplay.
 * Initialises arguments struct then passes to  process_args() to fill out
 * struct. Performs some basic logic checks to determine whether any values need
 * to be filled with defaults, then loaded dictionary, displays welcome message
 * and launches game_loop().
 *
 * int argc: Count of given program arguments including the program itself.
 * char** argv: String array of given arguments.
 *
 * Returns: Integer 0. Although program should never reach end of main function,
 *  as exit() is used elsewhere.
 */
int main(int argc, char** argv)
{
    // Initialise and set default values where applicable
    Arguments givenArgs;
    givenArgs.givenChars = malloc(sizeof(char));
    givenArgs.givenDict = malloc(sizeof(char) * (strlen(defaultDict) + 1));
    givenArgs.usageError = false;
    char** loadedDict;
    strcpy(givenArgs.givenDict, defaultDict);
    int dictLength = 0;
    int playerScore = 0;
    int exitCode = 0;
    bool loadError;
    // Initialise and set default min and max length
    givenArgs.minMax = malloc(sizeof(Lengths));
    givenArgs.minMax->givenMinLength = defaultMinLen;
    givenArgs.minMax->givenMaxLength = maxGivenChars;

    givenArgs = process_args(givenArgs, argc, argv);
    if (givenArgs.usageError == true) {
        exitCode = USAGE_ERROR;
    }

    if (givenArgs.charsProvided && exitCode == 0) {
        exitCode = check_given_chars(
                givenArgs.givenChars, givenArgs.minMax->givenMinLength);
    }

    if (!givenArgs.charsProvided) {
        givenArgs.givenChars = (char*)realloc(
                givenArgs.givenChars, sizeof(char) * (defaultNumLet + 1));
        strcpy(givenArgs.givenChars, get_random_letters(defaultNumLet));
    }

    // Compute actual max length
    givenArgs.minMax->givenMaxLength = (int)strlen(givenArgs.givenChars);

    // Check then load dict file.
    DictParams check = {givenArgs.givenDict, NULL, &dictLength,
            givenArgs.givenChars, *givenArgs.minMax, &loadError};
    loadedDict = check_given_dict(check);
    if (loadError == true) {
        exitCode = DICT_ERROR;
    }
    
    if (givenArgs.minMax->givenMinLength != defaultMinLen
            && givenArgs.lenProvided == true && exitCode == 0) {
        exitCode = check_min_length(givenArgs.minMax->givenMinLength);
    }

    if (exitCode == 0) {
        welcome_message(givenArgs.givenChars, *givenArgs.minMax);
        playerScore = game_loop(givenArgs.givenChars, loadedDict, &dictLength,
                *givenArgs.minMax);
        exitCode = end_game_message(playerScore);
    }

    clean_exit(givenArgs, loadedDict, dictLength);
    return exitCode;
}

/* process_args(int playerScore)
 * −−−−−−−−−−−−−−−
 * Displays one of two possible messsages depending of if the player has scored
 * yet this game.
 *
 * int playerScore: The number that will be displayed as the players score.
 */
int end_game_message(int playerScore)
{
    if (playerScore != 0) {
        printf("Final score is %d\n", playerScore);
        return FINISHED_GAME;
    }
    printf("No valid words guessed!\n");
    return UNPLAYED_GAME;
}

/* process_args(Arguments givenArgs, int argc, char** argv
 * −−−−−−−−−−−−−−−
 * Function responsible for handling program arguments correctly.
 * Will iterate through args and store values in the givenArgs structure if they
 * have been correctly provided.
 *
 * Arguments givenArgs: An initialised struct that will be used to store
 * all program arguments. int argc: Count of given program arguments including
 * the program itself. char** argv: String array of given arguments.
 *
 * Returns: The same givenArgs structure but populated with values from the argv
 * array. Errors: Will print the standard usage error if any given arguments are
 * not as expected.
 */
Arguments process_args(Arguments givenArgs, int argc, char** argv)
{
    // Check number of program args is even and leq 6
    if ((argc - 1) % 2 != 0 || argc > maxNumProgArgs) {
        fprintf(stderr, "%s\n", usageError);
        givenArgs.usageError = true;
        return givenArgs;
    }
    givenArgs.charsProvided = false;
    givenArgs.dictProvided = false;
    givenArgs.lenProvided = false;

    for (int i = 1; i < argc; i++) { // Check for and store program arguemnts
        if (i % 2 != 0 && (i + 1) <= argc) { // Check if givenArgs are formatted properly
                                             // and the pair exists before accessing.
            if (strcmp(argv[i], "--chars") == 0
                    && givenArgs.charsProvided == false 
                    && strchr("-", argv[i + 1][0]) == NULL) {
                givenArgs.givenChars = (char*)realloc(givenArgs.givenChars,
                        sizeof(char) * (strlen(argv[(i + 1)]) + 1));
                strcpy(givenArgs.givenChars, argv[(i + 1)]);
                givenArgs.charsProvided = true;

            } else if (strcmp(argv[i], "--dict") == 0
                    && givenArgs.dictProvided == false
                    && strchr("-", argv[i + 1][0]) == NULL) {
                givenArgs.givenDict = (char*)realloc(givenArgs.givenDict,
                        sizeof(char) * (strlen(argv[(i + 1)]) + 1));
                strcpy(givenArgs.givenDict, argv[(i + 1)]);
                givenArgs.dictProvided = true;

            } else if (strcmp(argv[i], "--min-length") == 0
                    && givenArgs.lenProvided == false
                    && is_input_int(argv[i + 1]) == true) {
                givenArgs.minMax->givenMinLength = atoi(argv[(i + 1)]);
                givenArgs.lenProvided = true;

            } else if ((strcmp(argv[i], "--min-length") == 0
                    && givenArgs.lenProvided == false
                    && is_input_int(argv[i + 1]) != true)) {
                fprintf(stderr, "%s\n", usageError);
                givenArgs.usageError = true;  
                    
            } else { // If arguments are not as expected, print usage error.
                fprintf(stderr, "%s\n", usageError);
                givenArgs.usageError = true;
            }
        }
    }
    return givenArgs;
}

/* welcome_message(char* givenChars)
 * −−−−−−−−−−−−−−−
 * Simple function to printf the program welcome message, uses the givenChars
 * to display playable characters and the minimum length of words that can be
 * made. Min length is defined by the strlen() of givenChars.
 *
 * char* givenChars: The characters that are used to play the game,
 * needed to display to the user which chars and the minimum to use.
 *
 * Returns: Void. End of function should be reached after printing.
 */
void welcome_message(char* givenChars, Lengths minMax)
{
    printf("Welcome to UQunscramble!\n");
    printf("Enter words of length %d to %d made from the letters \"%s\"\n",
            minMax.givenMinLength, minMax.givenMaxLength, givenChars);
}

/* game_loop(char* givenChars, char** dict)
 * −−−−−−−−−−−−−−−
 * Main game loop, the last function to be called by main().
 * Initialises the player's score to 0 and creates a dict and
 * index to track words that have been guessed already.
 * Then uses read_line function to take player input and passes
 * to word_check to check if input is valid.
 * If input == "q", prints out a sorted list of all possible valid words and the
 * maximum possible score. Always fprints final score or a "no words guessed"
 * message before exiting.
 *
 * char* givenChars: A pointer to the string of playable characters
 *  that must be used for the player to make words.
 * char** dict: A pointer to the array of string pointers that are valid words
 * to be played.
 *
 * Returns: Void. exit() is used so end of function should never be reached.
 */
int game_loop(const char* givenChars, char** dict, const int* dictLength,
        Lengths minMax)
{
    int playerScore = 0;
    char** guessedWords = malloc(*dictLength * sizeof(char*));
    int guessedWordsCount = 0; // index for guessedWords list
    bool endOfFileReached = false;
    char* guess;
    bool disableOutput = false;

    while (!endOfFileReached) {
        guess = read_line(stdin, &endOfFileReached);
        if (endOfFileReached) {
            break;
        }
        if (strcmp(guess, "q") == 0) {
            disableOutput = true;
            int maxPossibleScore = 0;
            qsort(dict, *dictLength, sizeof(char*), word_compare);
            for (int i = 0; i < *dictLength; i++) {
                printf("%s\n", dict[i]);
                Parameters maxPossibleCheck = {dict[i], givenChars, minMax,
                        NULL, (int)0, dict, dictLength, disableOutput};
                if (word_check(&maxPossibleCheck)) {
                    maxPossibleScore = scorer(
                            dict[i], maxPossibleScore, minMax.givenMaxLength);
                }
            }
            printf("Maximum possible score was %d\n", maxPossibleScore);
            break;
        }
        Parameters playerWordCheck = {guess, givenChars, minMax, guessedWords,
                &guessedWordsCount, dict, dictLength, disableOutput};
        if (word_check(&playerWordCheck) && strcmp(guess, "q") != 0) {
            playerScore = scorer(guess, playerScore, minMax.givenMaxLength);
            printf("OK! Your score so far is %d\n", playerScore);
        }
        free(guess);
        guess = NULL;
    }
    free_guessed_words(guessedWords, guess, guessedWordsCount);
    return playerScore;
}

/* free_guessed_words(char** guessedWords, char* guess, int count)
 * −−−−−−−−−−−−−−−
 * Checks whether the last guessed word (guess) has been freed and nullified.
 * If not frees it then iterates over guessedWord array, frees each word, then
 * the array itself.
 *
 * char** guessedWords: An array of string pointers to be freed.
 * char* guess: The last word that was guessed, which may not be freed.
 * int count: An index for the guessedWords array so it can be iterated over.
 */
void free_guessed_words(char** guessedWords, char* guess, int count)
{
    if (guess != NULL) {
        free(guess);
    }
    for (int i = 0; i < count; i++) {
        free(guessedWords[i]);
    }
    free(guessedWords);
}

/* word_compare(const void* p1, const void* p2)
 * −−−−−−−−−−−−−−−
 * qsort function for sorting by length of words firstly, then for words of
 * equal length sorts alpabetically using the strcmp() function.
 *
 * const void* p1: Pointer to the first word.
 * const void* p2: Pointer to the second word.
 *
 * Returns: -1 if the word at p1 is shorter than word at p2.
 *           1 if the word at p1 is longer than word at p2.
 *           Otherwise returns the result of strcmp(word1, word2).
 *
 * REF: This function is taken with modification from the qsort(3) man page
 * REF: it has been adjusted to fit the program spec (include alpha sorting).
 */
int word_compare(const void* p1, const void* p2)
{
    // Cast pointers into usable char*'s that can be compared.
    const char* word1 = *(char* const*)p1;
    const char* word2 = *(char* const*)p2;

    if (strlen(word1) < strlen(word2)) {
        return -1;
    }
    if (strlen(word1) > strlen(word2)) {
        return 1;
    }

    return strcmp(word1, word2);
}

/* scorer(char* word, int currentScore)
 * −−−−−−−−−−−−−−−
 * A basic function to update the given score variable.
 * Adds points equal to the length of the scored word,
 * plus an additional 10 if scored word is the maximum possible length.
 *
 * char* word: A string pointer to the word being scored, used to calculate
 * points based on length. int currentScore: The score that will be added to
 * then returned.
 *
 * Returns: The updated player score as an integer.
 */
int scorer(char* word, int currentScore, int givenMaxLength)
{
    int newScore = currentScore;
    int wordLength = (int)strlen(word);
    newScore += wordLength;

    if (wordLength == givenMaxLength) {
        newScore += maxWordLenBonus;
    }

    return newScore;
}

/* word_check(Parameters wordCheckParams)
 * −−−−−−−−−−−−−−−
 * Performs multiple checks on the given word. Checks if the word is empty or
 * "q". Checks all chars are in the alphabet, then capitalises for easier
 * comparison later. Checks word is between the min and max word length. Passes
 * word to the word_in_chars() function to ensure it can actually be made from
 * the givenChars. Finally if the word is valid, checks that it is not in the
 * guessedWords array and adds it before returning true. If any conditions fail,
 * the function returns false immediately.
 *
 * Parameters wordCheckParams: A structure made up of six total
 * parameters: char* word - A string pointer to the word that is being checked.
 *  char* givenChars - A string pointer to the playable characters in the game,
 * used to check the word against. char** guessedWords - A pointer to an array
 * of string pointers that store valid words already guessed by the player. int*
 * guessedWordsCount - An index for the guessedWords array. char** dict - A
 * pointer to an array of string pointers that stores all possible valid words
 * that could be guessed. bool toggleOutput - A boolean value used to determine
 * whether this function printfs any messages, required so this function can be
 * used to calculate maximum possible score without printing.
 *
 * Returns: A boolean value stating whether the word has passed all checks.
 */
bool word_check(Parameters* wordCheckParams)
{
    int wordLength = (int)strlen(wordCheckParams->word);

    for (int i = 0; i < wordLength; i++) {
        if (!isalpha(wordCheckParams->word[i])) {
            if (!wordCheckParams->toggleOutput) {
                printf("Word must contain only letters\n");
            }
            return false;
        }
        wordCheckParams->word[i] = toupper(wordCheckParams->word[i]);
    }

    if (wordLength < wordCheckParams->minMax.givenMinLength) {
        if (!wordCheckParams->toggleOutput) {
            printf("Word must have at least %d characters\n",
                    wordCheckParams->minMax.givenMinLength);
        }
        return false;
    }
    if (wordLength > wordCheckParams->minMax.givenMaxLength) {
        if (!wordCheckParams->toggleOutput) {
            printf("Word must have a length of no more than %d characters\n",
                    wordCheckParams->minMax.givenMaxLength);
        }
        return false;
    }
    if (!word_in_chars(wordCheckParams->word, wordCheckParams->givenChars)) {
        if (!wordCheckParams->toggleOutput) {
            printf("Word cannot be formed from available letters\n");
        }
        return false;
    }
    if (!wordCheckParams->toggleOutput) {
        if (!guessed_words(wordCheckParams)) {
            return false;
        }

        if (!word_in_dict(wordCheckParams->word, wordCheckParams->dict,
                    *(wordCheckParams->dictLength))) {
            printf("Word not found in dictionary\n");
            return false;
        }
    }

    return true;
}

/* guessed_words(Parameters wordCheckParams)
 * −−−−−−−−−−−−−−−
 * An extension of the word_check function solely for keeping track of words
 * that have already been guessed. If guessedWordsCount is not 0, i.e. a valid
 * word has been guessed already, then the guessedWords array is searched for
 * that same word.
 *
 * Parameters wordCheckParams: Reusing the Parameters struct from word_check
 *  to avoid having to create a new struct and keep things simple.
 *
 * Returns: True if the word has not been guessed already, false otherwise.
 */
bool guessed_words(Parameters* wordCheckParams)
{
    int index = *(wordCheckParams->guessedWordsCount);
    if (index != 0) {
        if (word_in_dict(wordCheckParams->word, wordCheckParams->guessedWords,
                    index)) {
            printf("Word has been guessed earlier\n");
            return false;
        }
    }

    // Allocate memory for the new word to avoid pointer issues.
    wordCheckParams->guessedWords[index]
            = malloc(sizeof(char) * strlen(wordCheckParams->word) + 1);
    strcpy(wordCheckParams->guessedWords[index], wordCheckParams->word);

    (*(wordCheckParams->guessedWordsCount))++;
    return true;
}

/* word_in_dict(char* word, char** dict, const int* dictLength)
 * −−−−−−−−−−−−−−−
 * A simple function which searches through the given dictionary for the given
 * word. If found the function returns true immediately.
 *
 * char* word: A string pointer to the word that will be searched for.
 * char** dict: A pointer to the array of string pointers that stores the valid
 * words.
 *
 * Returns: True if the word exists in dict, false otherwise.
 */
bool word_in_dict(char* word, char** dict, int dictLength)
{
    for (int i = 0; i < dictLength; i++) {
        if (strcmp(word, dict[i]) == 0) {
            return true;
        }
    }
    return false;
}

/* check_min_length(int givenMinLength)
 * −−−−−−−−−−−−−−−
 * Checks that the given minimum length for each word matches the required
 * program spec (between 3 and 6 inclusive). If it doesn't the program will
 * print the appropriate error to stderr and exit with code 11.
 *
 * int givenMinLength: The integer representing the minimum length that will be
 * checked against.
 *
 * Returns: Void. Function will exit and print message if length is too short,
 * otherwise reaches end of function. Errors: If givenMinLength is not between 3
 * and 6 inclusive an error message will be printed to stderr and exit will be
 * called with status 11.
 */
int check_min_length(int givenMinLength)
{
    if ((givenMinLength < minimumMinLen) || (givenMinLength > maximumMinLen)) {
        fprintf(stderr,
                "uqunscramble: min length value must be between 3 and 6\n");
        return MIN_LEN_ERROR;
    }
    return 0;
}

/* check_given_chars(char* givenChars, int givenMinLength)
 * −−−−−−−−−−−−−−−
 * Checks three things for the given characters array.
 * That every character is a valid alphabet character.
 * That there are no more than 13 characters provided.
 * And that there are more characters than the given minimum length.
 *
 * char* givenChars: A string pointer to the givenChars that will be checked.
 * int givenMinLength: An integer representing the required minimum length of
 * the givenChars.
 *
 * Returns: Void. Function will exit if a condition fails, otherwise reaches end
 * of function. Errors: An error will be printed to stderr if any of the
 * conditions fail, program will then exit with the appropriate exit status.
 */
int check_given_chars(char* givenChars, int givenMinLength)
{
    for (int i = 0; i < (int)strlen(givenChars); i++) {
        if (!isalpha(givenChars[i])) {
            fprintf(stderr, "uqunscramble: set of letters is invalid\n");
            return INVALID_LET_ERROR;
        }
    }

    if ((int)strlen(givenChars) > maxGivenChars) {
        fprintf(stderr,
                "uqunscramble: number of letters must be no more than 13\n");
        return MAX_LET_ERROR;
    }
    if ((int)strlen(givenChars) < givenMinLength) {
        fprintf(stderr, "%s%d%s\n",
                "uqunscramble: insufficient letters for the given minimum "
                "length (",
                givenMinLength, ")");
        return TOO_FEW_LET_ERROR;
    }
    return 0;
}

/* check_given_dict(char* givenDictt, int* dictLength, char* givenChars)
 * −−−−−−−−−−−−−−−
 * Takes in a path to a dictionary file and attempted to open the file.
 * If successfull the file will be loaded using the load_given_dict() function,
 * then returned. Otherwise program prints an error to stderr and exits with
 * status 5.
 *
 * char* givenDict: A string pointer to path of the dictionary to be loaded.
 * char* givenChars: A char array pointer to the given characters,
 * required to use the load_given_dict() function.
 *
 * Returns: A pointer to an array of string pointers representing the dictionary
 * of valid words in the game. Errors: If the dictionary file can't be loaded,
 * an error is printed to stderr containg the given file path.
 */
char** check_given_dict(DictParams check)
{
    // Attempt to open dict file in read only mode
    check.dict = fopen(check.givenDict, "r");

    if (check.dict == NULL) {
        fprintf(stderr, "%s%s%s\n", "uqunscramble: dictionary with name \"",
                check.givenDict, "\" cannot be opened");
        exit(DICT_ERROR);
    } else {
        char** loadedDict = load_given_dict(check);
        fclose(check.dict);
        return loadedDict;
    }
}

/* load_given_dict(FILE* dict, int* dictLength, char* givenChars)
 * −−−−−−−−−−−−−−−
 * Takes a file pointer to the game dictionary and uses the read_line
 * function to dynamically load in each word line by line. Adding it to the
 * loadedDict array if it meets requirements. Then returns a pointer to that
 * array.
 *
 * FILE* dict: A pointer to the file that will be read.
 * char* givenChars: A pointer to the char array of valid characters,
 * needed to prevent adding illegal words.
 *
 * Returns: A pointer to the array of string pointers containing every valid
 * game word.
 */
char** load_given_dict(DictParams load)
{
    bool endOfFileReached = false;
    int dictLineIndex = 0;

    char** loadedDict = malloc(sizeof(char**) + 2);

    while (!endOfFileReached) {
        char* word = read_line(load.dict, &endOfFileReached);
        bool skipWord = false;
        int wordLength = (int)strlen(word);

        if (wordLength > load.minMax.givenMaxLength
                || wordLength < load.minMax.givenMinLength) {
            skipWord = true;
            continue;
        }

        for (int i = 0; i < wordLength; i++) {
            if (!isalpha(word[i])) { // Skip word if it contains no alpha char
                skipWord = true;
                break;
            }
            word[i] = toupper(word[i]); // Convert toUppper for later on
        }

        if (skipWord) {
            free(word);
            continue;
        }
        if (word_in_chars(word, load.givenChars)) {
            loadedDict
                    = realloc(loadedDict, sizeof(char*) * (dictLineIndex + 1));
            loadedDict[dictLineIndex] = word;

            dictLineIndex++;
        }
    }
    *load.dictLength
            = (int)dictLineIndex; // Store dict length minus the extra index
    return loadedDict;
}

/* word_in_chars(char* word, char* givenChars)
 * −−−−−−−−−−−−−−−
 * A function that takes a word and compares it to the given characters, using
 * a struct it compares the count of each letter in both word and givenChars.
 * Will return true if the letter counts in word are less
 * than or equal to that of givenChars.
 *
 * char* word: A pointer to an array of chars (the word) to check.
 * char* givenChars: A pointer to an array of chars that will be used to check
 * against.
 *
 * Returns: True if the word can be made of the given characters, false
 * otherwise.
 */
bool word_in_chars(char* word, const char* givenChars)
{
    const char alphabet[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const int numLettersInAlphabet = 26;

    typedef struct AlphaCount {
        char character;
        int counter;
    } AlphaCount;

    AlphaCount countOfWord[numLettersInAlphabet];
    AlphaCount countOfChars[numLettersInAlphabet];

    // Init two alphabet counters
    for (int i = 0; i < numLettersInAlphabet; i++) {
        countOfWord[i].character = alphabet[i];
        countOfWord[i].counter = 0;
        countOfChars[i].character = alphabet[i];
        countOfChars[i].counter = 0;
    }

    for (int i = 0; i < (int)strlen(word); i++) {
        for (int j = 0; j < numLettersInAlphabet; j++) {
            if (word[i] == alphabet[j]) {
                countOfWord[j].counter += 1;
                break;
            }
        }
    }

    for (int i = 0; i < (int)strlen(givenChars); i++) {
        for (int j = 0; j < numLettersInAlphabet; j++) {
            if (toupper(givenChars[i]) == alphabet[j]) {
                countOfChars[j].counter += 1;
                break;
            }
        }
    }

    for (int i = 0; i < numLettersInAlphabet; i++) {
        if (countOfWord[i].counter <= countOfChars[i].counter) {
            continue;
        }
        return false;
    }

    return true;
}

/* read_line(FILE* file, bool* endOfFileReached)
 * −−−−−−−−−−−−−−−
 * Returns characters from the FILE* stream concatonated into a word
 * up to a newline character or the EOF. Adds a null terminator
 * to make each line a string.
 *
 * FILE* file: The pointer to the file stream that each line will be read from.
 * bool* endOfFileReached: A pointer to the a boolean value that
 *  is set to true when EOF is reached. Required so that this function can
 *  be called in a while loop that ends when EOF is reached.
 *
 * Returns: A string pointer to the word found on each line.
 * REF: Copied entirely from the solution on
 * Ed Lesson 3.2 - file handling - basic file handling.
 */
char* read_line(FILE* stream, bool* endOfFileReached)
{
    // Initialise memory for a new char* array
    char* line = malloc(sizeof(char*));
    int arrIndex = 0;
    while (1) {
        // Continue looping while not end of file
        // or at the end of a line in file
        if (feof(stream)) {
            break;
        }
        // Get next character in file (as int) using fgetc
        int nextChar = fgetc(stream);

        if (nextChar == EOF) {
            *endOfFileReached = true;
            break;
        }
        if (nextChar == '\n') {
            break;
        }
        // Add char to array (remember to terminate array
        // with null char when ready to return it)
        line = (char*)realloc(line, sizeof(char) * (arrIndex + 2));
        line[arrIndex] = (char)nextChar;
        arrIndex++;
    }
    line[arrIndex] = '\0';
    return line;
}

/* clean_exit(Arguments givenArgs, char** loadedDict, int dictLength)
 * −−−−−−−−−−−−−−−
 * Iterates through the loaded dictionary array and frees each stored word
 * before then freeing the array itself. Then free()'s givenChars, minMax
 * and givenDict from the givenArgs struct.
 *
 * Arguments givenArgs: Used to access pointers that need to be freed.
 * char** loadedDict: The array of string pointers that will be freed.
 * int dictLength: An index for loadedDict, so it can be iterated through.
 */
void clean_exit(Arguments givenArgs, char** loadedDict, int dictLength)
{
    for (int i = 0; i < dictLength; i++) {
        free(loadedDict[i]);
    }
    free(loadedDict);

    free(givenArgs.givenChars);
    free(givenArgs.minMax);
    free(givenArgs.givenDict);
}

/* read_line(FILE* file, bool* endOfFileReached)
 * −−−−−−−−−−−−−−−
 * A simple function that is made to check if an arg in argv is an integer.
 *
 * char* num: The element in argv that will be checked. 
 *
 * Returns: True if num only contains integers, otherwise false.
 */
bool is_input_int(char* num)
{
    if ((int)strlen(num) > 2) {
        return false;
        }
    for (int i = 0; i < (int)strlen(num); i++) {
        if (isdigit(num[i]) == 0) {
            return false;
        }
    }
    return true;
}