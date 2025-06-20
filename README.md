# Personal Portfolio Website
This repository contains the source code for my personal website. The website itself covers an intro to my projects and a little about who I am.

## Features
 - Written in Typescript with NextJS/React.
 - Fully dynamic will scale (well) to most devices.
 - Website is entirely statically generated.
 - Articles (projects) are written in MDX format and get compiled automatically as a Github workflow.

## How the Markdown stuff works
Painfully! It was a lot of banging my head against the wall using various guides and resources to reach my goal of *easier* article creation / updating. What ended up being the most helpful article was [this one by Colby Fayock](https://spacejelly.dev/posts/how-to-source-mdx-content-in-next-js-to-dynamically-create-pages-for-a-blog).

The end result is a relatively easy way to maintain and add articles/project write-ups. The process is as simple as:

1. Write the article in Markdown(X) and copy it to the src/projects directory.
2. Add two fields to the top of the page, to extract a title and allow for categorising. For example:

```
  ---
  title: "RightClickVirusTotal"
  type: "personal"
  ---
```

3. `git add . && git commit` And ta-dah, the Github workflow handles the compiling and then it goes live at [smp46.me/projects](https://smp46.me/projects).

### Testing/Building
Requirements: `npm 10.9.2` - ymmv with other versions

For developing `npm run dev`, this even works for adding MDX files. Navigating away then back to /projects, will refresh and get new files.

For building/generating a static site `npm run build`, find the website files in /out.
