# top_battleship
Background: This project was a simple battleship web application, done as a project for The Odin Project as the final project in the javascript module
URL to Play Battleship:
URL To TOP's project:

Concepts I Learned:
The main purpose behind this project was to learn about TDD (Test Driven Development) by using the popular 3P package JEST for Javscript. Throughout the process of learning JEST, I made some notable syntax errors:
1. when throwing an error, it has to be a callback function vs a regular function
2. the hierarchy for JEST is describe > test > expect --> if there's test clauses with the same purpose (e.g. to tes tthe same function for correct values), then I should organize it with describe first
3. overall, because of this project, I was able to review a lot of the concepts that I didn't remember because I took a break from learning web development, so it definitely took a lot longer than I thought, but it was a great refresher.

Issues I Faced / What To Do Better Next Time:
Some of the errors that I made that I should learn from for my future projects are the following:
1. TDD - I have develop more incrementally. When using JEST in the beginning, I didn't know how to read the error messages because they weren't throwing any expected values. If I developed more incrementally from the start, I would've slowly got expected values and used those expected values to debug my code.
2. Separation of code - one important concept I learned during this project was event emitters. When developing this project, I created only one UI module and stored all three DOM pages (start screen, place ships screen, and the battle screen) in that module.
    Because of this, writing code got really confusing because I constantly looking back and forth on code that wasn't relevant to the page I was on. I solved this issue by downloading and using the pubsub, but my code organization should be laid out before I even begin writing code.
3. Classes - Because I originally started my coding journey by learning C++, I'm more familiar with classes, but one bug that I spent a while on, was that I was supposed to create 10 ship classes because classes are stored in memory.
     For both players, I only created one instance of each ship; as a result, when one player had their ship hit, the other player would have its ship hit.
4. Standard Procedure for creating projects - in all my projects, I will be using some of the same 3P packages and applications (font awesome, webpack, ESLint, etc.). I should create a google doc or something with all the instructions and explanation in case I forget to save on time. 
5. Code organization - the game js file should a game loop. I shouldn't have stored the ships in a datamanger.js file, and should've just stored everything related to the game inside the game.js file.  

Some concepts I have to read more on:
1. Mocking - because I didn't make any API calls / asynch calls / promises in this project, I didn't have a chance to create test cases for mocking. In the future, I definitely need to read up on / practice this concept in more detail

Features To Add:
If I have more time in the future, some of the features I would add, would be:
1. Status bar with animations - the present status bar only gives the status of the game when the player clicks on the enemy grid.
   How I would solve it: Write the status string, and loop through each character, and slowly display the status string on the status bar. Make that loop into a promise and set a timeout each time it loops, so the user would be able to see
   the status message moving.
2. Smarter AI - Right now, the AI hits a random coordinate; the AI should hit coordinates around vertically or horizontally where there was a hit.
  How I would solve: I create a stack and push the most recent coordinate that the AI hit. Check the coordinate to see if the ship is sunk, if the ship is sunk, then pop it off the stack. Otherwise, make the AI hit vertically or horizontally, and mark the direction in the stack so the AI can hit the other positions.
3. Second human player with alternating boards
4. Music - pretty self-explanatory, but music definitely brings a game to life
