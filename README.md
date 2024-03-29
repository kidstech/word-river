![Word River](/logo-top.png)
# Word River <!-- omit in toc -->

[![Server Build Status](../../actions/workflows/server.yml/badge.svg)](../../actions/workflows/server.yml)
[![Client Build Status](../../actions/workflows/client.yaml/badge.svg)](../../actions/workflows/client.yaml)
[![End to End Build Status](../../actions/workflows/e2e.yaml/badge.svg)](../../actions/workflows/e2e.yaml)

- [Project Features:](#project-features)
- [Project Description:](#project-description)
- [Technical Document](#technical-document)
  - [Notes](#notes)
- [To-Do List](#to-do-list)
- [Customer Pamphlet](#customer-pamphlet)
- [Contributors](#contributors)

Word River is a website for creating word lists and context packs (collections of word lists of a particular context) and translating them into JSON format to be used by other applications.
## Project Features
* Users can sign up and log in to have content personalized to the user
  * The user can only see the context packs and learners that they have created
* Add new context packs: context packs are a collection of word lists about a specific topic.
* Add new word lists to context packs.
* Export context packs as JSON.
* Delete context packs.
* Create word lists and add them into context packs.
* **Import a word list:** you can import a word list into a context pack from other sources as long as they are in JSON format.
* **Export a word list:** you can also export word lists as JSON to be used elsewhere or to move a word list from one context pack to another.
* Edit word lists
  * Change name of word list, delete words, add new words, or delete the word list
* Auto suggest word type
  * When you type in a word to add to a word list, Word River will automatically suggest whether it is a noun, verb, adjective, or miscellaneous.
* Auto suggest word forms
  * When you type in a word to add to a word list, Word River will use the Merriam Webster dictionary API to generate suggestions for different forms of a word
* **Creating Learner Profiles**: Word River allows you to create Learner profiles which you can then assign context packs to in order to keep track of which context packs each learner is using. This means that each learner will have their own set of context packs that you can assign and unassign to and from.
* **Edit learner profiles**: Learner names and icons are not permanent; Word River will allow you to edit them from the view of a learner profile, or you can delete the learner.

## Project Description
* **Languages used:** Typescript, Java, HTML and SCSS
* **Services used:** Firebase, Merriam Webster Dictionary API, MongoDB, Digital Ocean, Docker
* **Frameworks:** Angular 11 and Javalin
* **Testing software:** Karma, Cypress, and GitHub Actions
* Uses Firebase authentication and image storage 


## [Technical Document](DEPLOYMENT.md)

A document that describes the technical details of the project.
### Notes
* The Merriam-Webster API will only allow 1000 queries per day.
* Icons uploaded through WordRiver to Firebase can be a maximum size of 5mb.
* If you would like to facilitate agile development for planning your project, we would recommend [Pointing Poker](https://www.pointingpoker.com) for estimating the values for your epics.

## [To-Do List](TO-DO-LIST.md)

List of known issues and areas for improvements.

## [Customer Pamphlet](brochure.pdf)

A non-technical document for inexperienced users.

## Contributors

This contributors to this project can be seen [here](../../graphs/contributors).
