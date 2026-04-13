# Personal Best Stopwatch (with CATS)

## Try it out here: https://litlwanderer.github.io/personalbest-stopwatch/

### What is this?

It's a stopwatch where a cat gets progressively sleepier the longer you work!


### Features

* Start, stop, and save your best times
* Dark/light modes
* Customisable title
* Choose your best time by "longest", and the cat gradually grows sleepier; choose your best time by "fastest", the cat sprints across the screen periodically
* There are 5 cats in total, picked randomly on page load!



### Cats

There are 5 cats each with 4 frames for each of 2 modes, meaning that I drew 40 frames in total.

I drew them by hand, on an A4 paper grid. Black acrylic marker for the outlines and water-based marker for the colouring, then I scanned the drawings, removed the background using a free website somewhere, re-added the shadows on Gimp, and sliced them using Gimp's Web>Slice filter, which automatically provided a convenient naming convention for the sliced files!

There was a lot of trial and error with all parts of the process.



I used Flipnote on DS to work out how to animate a running cat, but I wasn't able to preview the animations for the actual running cats until I actually loaded the images into the project... which meant that some of the animations turned out a little choppy (probably to be expected with only 4 frames per cycle anyway). Perhaps I'll add inbetweening another day.



Drawing, processing, and writing the code to handle cat animations took up a lot of my time on this project; I was fairly familiar with manual frame cycling animation through PICO-8 but using JavaScript's setInterval() for frame cycling and CSS to smoothly animate an element were new to me.



Pretty happy with how they turned out!

My favourite cats are the fat grey one and the tiny one who rolls.

(^・ω・^)



### How to use

* Start the timer
* Once done, stop to pause
* You can resume the timer if stopped, but if you've saved the time already, you can't resume it anymore
* Saved times can be deleted.



### What I learned

This is my first-ever HTML/CSS/JS project! I mainly built it because I wanted to try out GitHub Pages.

I expected to enjoy the fun, fluffy parts of development like the CSS... but it immediately became clear that the design choices which look good in my head are actually terrible IRL, and I think I ended up leaning on AI on that part of the project more than anywhere else >\_<
On the plus side, I learnt enough CSS to fix a couple of things myself, experiment with the overall colour scheme, and learn how mobile-responsive pages can be made using @media queries.

Overall I learnt a lot about front-end basics, especially JavaScript; I think JavaScript is my new favourite ~~language~~ script! setInterval()/clearInterval() are my new favourite functions.
The only thing is that the loosely-typed-ness of JS can lead to strange, difficult to trace bugs. TypeScript may be something for me to explore in the future.

LocalStorage was something new as well; turns out that browsers have many different ways to store data client-side.
I used DevTools a lot for testing and debugging (breakpoints, testing different layouts, etc) and also got to practice using Git, which is always a plus.

Handling the changes between running cat mode <-> sleeping cat mode was probably the most challenging thing in the whole project. I spent a lot of effort testing this feature, but there may be some persistent bugs that slipped through leading to strange behaviour for the running cat. Please let me know if you find any new ones! I *will* try to fix them (... although success not guaranteed haha)



New things I might explore next:

* This was a fun foray into front-end development, but my next steps are probably to experiment with the back-end stuff like hosting non-static webpages (somewhere other than GitHub Pages)
* TypeScript
* Actually find out what flexboxes are
* Read up on DOMs
* Accessibility: other than me trying to make sure everything has sufficient contrast, this project is probably not accessible at all. I hope to make a future project that follows at least basic accessiblity conventions which could be used by more people!



### Credits

* Credit to Capwan (https://github.com/capwan/Stopwatch\_timer), I based the core of my stopwatch logic on his Stopwatch\_timer - further note in license
* Google Fonts
* Claude for teaching me JS, HTML... and just plain generating most of the CSS... ⚆\_⚆



### Future Ideas and Known Bugs

* There is an occasional bug where runcat() is called and immediately ends, meaning that the cat-running-across-the-screen animation doesn't happen at all. I checked this out in DevTools and a theory is that the transitionend listener (which should fire when the cat is done running across the screen) fires in response to something else. Since the cat is supposed to appear randomly anyway and this bug doesn't do anything critical, I left that in for now; the problem would be great to pinpoint one day though
* If the cat pictures don't load in time (due to network latency) the cat will just slide across the screen instead of cycling frames to run properly
* Cat-running frame cycling sometimes seems to go too fast - haven't really looked at this one closely - could be latency, could be an un-cleared leftover frame cycling interval overlapping on the current one
* Find out whether it's possible to use service workers to make the application work offline
* Improve on the CSS for a nicer, less vibe-coded feel
* Add a pomodoro mode
* Saving a session should save what was being timed as well, and add a feature to sort the saved session list based on that
