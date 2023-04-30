# <img src="./work%20files/resources/logo.svg" width="50" title="Logo" alt="reFrame logo"> reFrame
#### A fluid keyframe-based presentation DSL

This DSL aims to increase the flexibility and fluidity of presentations by allowing users to control individual element parameters beyond "show" and "hide" with each advance control.

## Downloading and Setup
The source code is contained in the `reframe` folder.
Once downloaded, the DSL can be run from the `reframe.py` script.

To create a project, in the command line, first navigate to folder you want to create the project in and execute the `reframe.py` script with the `setup` argument. e.g.

```
cd my/project/directory
python path/to/reframe/reframe.py setup
```

It will then ask you for a name for the project and the folder you want output to be written to.
The folder can be an absolute or relative path and will be created if it doesn't already exist.
Either way, the folder will be rewritten every time the project is compiled, so don't use a folder with contents inside!
These settings can be changed in the `.config` file afterward if desired.

After entering responses, it should generate all the necessary files into your folder (an `elements.yaml` file, a `frames.frame` file, a `style.css` file, a `style.css` file, and an `assets` folder along with the `.config` file for execution.)

## Rendering a Project
Once you've setup a folder with the appropriate files, the presentation can be rendered into an HTML file using the same `reframe.py` script with the project directory as the argument:

`python path/to/reframe/reframe.py my/project/directory`

This should then create the HTML file along with supporting files in your designated output folder.
The presentation can then be shown by simply opening the `index.html` file with any modern browser (or even uploading the folder to a server if you want).
The browser should be updated to the most recent version (at least after late 2022/early 2023) to ensure it has implemented CSS `container` queries which are essential for making sure elements are positioned correctly.

To open with automatic refresh when files are changed, in VS Code, you can right click on the `index.html` file and choose `Open with Live Server`.

#### Rendering on Save
If you're working in VS Code, you can use the [Run on Save](<https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave>) extension to make the code render each time you save a relevant file!
After installing the extension, add the following code to your VS Code `settings.json` file replacing `<path_to_download>` with the path to where you downloaded reFrame:

```
"emeraldwalk.runonsave": {
    "commands": [
        {
            "match": "\\.yaml$|\\.frame$|\\.css",
            "cmd": "python <path_to_download>/reframe.py \"${fileDirname}\""
        }
    ]
}
```
To see output from the compilers for debugging, you can go to the `OUTPUT` tab of the VS Code terminal and select `Run On Save` from the dropdown on the right.

## Syntax
### `elements.yaml`
The `elements.yaml` file contains element definitions.
Each element starts with an identifier followed by a colon (`:`) that is used as the element's `id` in the HTML, so it must follow HTML `id` syntax restrictions. Alternatively, `_` can be used if the element doesn't need to be referenced by `id` anywhere.
No two elements can have the same `id` in this file.

Next, each element must contain some indicator of the content.
There are multiple options:
- `text` is used for creating `<p>` elements.
**Syntax:** `text: "This is the text I want to include"`
- `item` is used inside `ul` and `ol` for creating `<li>` elements.
**Syntax:** `item: "This is the list item text I want to include"`
- `ul/ol` are used for creating list `<ul>` and `<ol>` elements.
**Syntax:** either a reference syntax: `ul: [item1, item2, item3]` or a nested syntax:
```
ul:
    - item1:
        item: "..."
    - item2:
        item: "..."
    - item3:
        item: "..."
```
- `content` is used for creating `<div>` elements that can contain other elements.
**Syntax:** either a reference syntax or a nested syntax as shown above.
- `img` is used for creating `<img>` elements that display pictures of various possible types.
**Syntax:** `img: path/to/image` where `path/to/image` is either a local path or a web url.
- `svg` is used for inserting `<svg>` elements that contain scalable graphic rules.
**Syntax:** `svg: svg_name.svg` where `svg_name.svg` is located inside the `assets` folder (I might change this).
- `html` is used for inserting `<html>` elements that define existing web format content.
**Syntax:** `html: html_name.html` where `html_name.html` is located inside the `assets` folder (I might change this).
_Warning!_ This feature has not yet been tested and could very well not work.

In addition to defining the content of the object, several additional parameters can be defined for any element:
- `style`: is used to define a specific style applied to an element.
**Syntax:** `style: "color: #c8f; font-size: 2cqh; ..."` following CSS rules.
- `class`: is used to define which class(es) an element should belong to.
**Syntax:** `class: class-1 class-2 ...`.
- `align`: is used to position an element.
**Syntax:** `align: center-x | center-y | center-xy`. (I will hopefully define more alignments in the future).

Example element:
```
my-elem:
    align: center-x
    content:
        - my-image:
            img: "assets/example_image.png"
            style: "width: 50%"
        - my-caption:
            text: "This is an example image."
            class: caption-text
```

Referenced elements must be defined at the top level, i.e. they should not be indented or defined inside a nested structure such as a `content` element.
However, it does not matter if they are defined before or after they are used (but not recursively).

All syntax must be valid YAML. YAML comments use `#`.

### `frames.frame`
The `frames.frame` file contains presentation transition rules.

The `-->` operator separates the transitions; the transitions following an arrow only start after the user inputs an advance command (spacebar or > arrow) and it only executes up to the next `-->`.

Each transition can contain multiple animations separated by `and` or `then`.
`and` indicates that the preceding and following animations happen consecutively whereas `then` indicates that the following animation should only happen once the preceding animation has completed.

Each animation contains three parts separated by spaces: a selector, an animation type, and optional arguments.
The selector must follow [CSS selector rules](https://www.w3schools.com/cssref/css_selectors.php) (it is parsed by JavaScript's [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) method). Multiple selectors can be used with spaces as long as they have a comma before each space.

The arguments depend on the animation type and are enclosed in `{braces}`.
The possible animation types are:
- **Basic**
    - `addClass/removeClass`: adds or removes a class defined in the CSS.
    **Argument:** class name.
    - `transform`: applies a transformation to the element based off of its current state.
    **Argument:** a valid [CSS transformation](https://developer.mozilla.org/en-US/docs/Web/CSS/transform).
    - `style`: adds a style directly to the element.
    **Argument:** a valid [CSS style declaration](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#css_declarations).
- **Shorthand**
    - `show/hide`: show or hide an element. Shorthand for `addClass/removeClass {show}`.
    - `flyOutTop/flyOutRight/flyOutBottom/flyOutLeft`: move an element off the screen in one of the cardinal directions.
    Shorthand for `transform {translateY(-100cqh)}`, `transform {translateX(100cqw)}`, `transform {translateY(100cqh)}`, and `transform {translateX(-100cqw)}` respectively.

Example animation:
`.my-class transform {translateX(5cqw) rotate(50deg)}` translates all elements with class `my-class` by `5cqw` in the X direction and rotates them `50deg`.

Example transition:
```
--> #my-div>p style {opacity: 0.5}                  // style all of my-div's p children with half opacity
    and .image-group show                           // and at the same time, show all elements in the image-group class
    then #item-1, #item-2 transform {scale(1.2)}    // and once that's done, grow item-1 and item-2 by 20%
```

_Note_: no arguments need surrounding quotes. They are already parsed as strings.

Inline comments use `//example comment` and multiline comments use `/* example comment */`.
Apart from inline comments, all of the code is whitespace insensitive.

### `style.css`
The syntax is the same as regular CSS, but there are a few things to keep in mind:
- The canvas can be accessed by the `#canvas` ID selector.
Importantly, you can change the canvas background here (`#canvas { background: #c8f; }`) as well as the aspect ratio (`#canvas { aspect-ratio: 4 / 3; }`)
- The overall background can be accessed by the `#bg` ID selector: `#bg { background: #222; }`.
This background is what is shown at the edges if the viewport doesn't match the presentation aspect ratio.
- When sizing or moving **anything**, you should use the [container query units](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries#container_query_length_units) (`cqh`, `cqw`, etc.) to ensure that everything stays where you want it.

****

## Examples
In `work files`, there are example presentations that contain some example input and output.
[`basicPres0`](<https://hmc-cs111-spring2023.github.io/project-code-occamkg/work%20files/basicPres0/example%20output/>) contains example input and output files conceptualized before making the DSL.
[`testPres0`](<https://hmc-cs111-spring2023.github.io/project-code-occamkg/work%20files/testPres0/output/>) has the same presentation, but it can be compiled from the `input` folder and generates the `output` folder.
[`testPres1`](<https://hmc-cs111-spring2023.github.io/project-code-occamkg/work%20files/testPres1/presentation>) has a completely different presentation testing some added features.
[`finalPres`](<https://hmc-cs111-spring2023.github.io/project-code-occamkg/work%20files/finalPres/presentation>) has the presentation used for creating the final video for the DSL class.