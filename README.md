# lights-out
The classic electronic hand-held game by Tiger Electronics. 

# Instructions
Toggle the lights on and off by clicking a square. The clicked square and all adjacent, non-diagonal squares, will toggle.

Turn out all of the lights in order to clear the stage and move on to the next.

Players are allowed 2 hints per level if needed, however, using hints will decreased your overall score for that level!

# UI
1: Min & Max Clicks to Solve - The minimum # of clicks that the level can be solved in. If the max # of clicks is reached, the level will restart.

2: Attempts - Number of attempts on the current level.

3: Click Count - Current number of clicks on the current level.

4: Level - Total levels.

5: Score - Score is updated at the completion of each level.

6: Hints Used - Hints remaining for the given level.

# Scoring
You can earn a maximum of 100 points per level. Points are lost for the following scenarios:
1: - 20 points per hint used

2: - 5 points each time a level is failed

3: - 1 point for each click beyond the minimum possible clicks to solve the level

Have fun!

Hosted at https://davidandreww.github.io/lights-out/

# The Code

1: app.js - Stores all of the game logic, click events, and game flow

2: gameLevels.js - Stores all starting coordinates & metadata for each level, including min & max clicks, and hint squares

3: lightClass.js - The light class object. Stores the state of each square

4: utils.js - Logic to toggle squares and alert messages which make use of currying....neat!