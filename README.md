# Web Presentation DSL

## File Structure

All of the necessary code to run the DSL is in the `program` folder.
When using the DSL in a folder `myFolder`, you can compile it using `python path/to/downloaded/program/run.py myFolder outputFolder`.
To run, `myFolder` must contain a `.yaml` file containing element definitions,
a `.frame` file containing keyframe transitions,
and optionally a `.css` file containing styles that the user can reference throughout.
The `outputFolder` will contain the presentation `HTML` along with its supporting files.
This `HTML` can be opened in most modern browsers.

In `work files`, there are example presentations that contain some example input and output.
[`basicPres0`](<https://hmc-cs111-spring2023.github.io/project-code-occamkg/work%20files/basicPres0/example%20output/>) contains example input and output files conceptualized before making the DSL.
[`testPres0`](<https://hmc-cs111-spring2023.github.io/project-code-occamkg/work%20files/testPres0/output/>) has the same presentation, but it can be compiled from the `input` folder and generates the `output` folder.
[`testPres1`](<https://hmc-cs111-spring2023.github.io/project-code-occamkg/work%20files/testPres1/>) has a completely different presentation testing some added features.