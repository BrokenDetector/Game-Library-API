#! /usr/bin/env node

console.log(
    'This script populates some test games, developers, genres to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Developer = require("./models/developer");
const Genre = require("./models/genre");

const genres = [];
const developers = [];
const games = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createGenres();
    await createDevelopers();
    await createGames();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function genreCreate(index, name) {
    const genre = new Genre({ name: name });
    await genre.save();
    genres[index] = genre;
    console.log(`Added genre: ${name}`);
}

async function developerCreate(index, name) {
    const developerDetail = { name: name };

    const developer = new Developer(developerDetail);

    await developer.save();
    developers[index] = developer;
    console.log(`Added developer: ${name}`);
}

async function gameCreate(index, title, description, developer, genre, price) {
    const gameDetail = {
        title: title,
        description: description,
        developer: developer,
        imageUrl: "blank_image.png",
    };
    if (genre != false) gameDetail.genre = genre;

    const game = new Game(gameDetail);
    await game.save();
    games[index] = game;
    console.log(`Added game: ${title}`);
}

async function createGenres() {
    console.log("Adding genres");
    await Promise.all([
        genreCreate(0, "No Genre"),
        genreCreate(1, "First-Person-Shooter"),
        genreCreate(2, "Sports"),
        genreCreate(3, "Action RPG"),
        genreCreate(4, "Battle Royale"),
        genreCreate(5, "Sandbox"),
        genreCreate(6, "Action-Adventure"),
        genreCreate(7, "Party"),
    ]);
}

async function createDevelopers() {
    console.log("Adding developers");
    await Promise.all([
        developerCreate(0, "CD Projekt"),
        developerCreate(1, "Epic Games"),
        developerCreate(2, "Mojang"),
        developerCreate(3, "Blizard Entertainment"),
        developerCreate(4, "EA Vancouver"),
        developerCreate(5, "Rockstar North"),
        developerCreate(6, "Ubisoft Montreal"),
        developerCreate(7, "Innersloth"),
    ]);
}

async function createGames() {
    console.log("Adding games");
    await Promise.all([
        gameCreate(
            0,
            "The Witcher 3: Wild Hunt",
            "Embark on a journey as Geralt of Rivia in this open-world action RPG filled with monsters, quests, and political intrigue.",
            developers[0],
            genres[3]
        ),
        gameCreate(
            1,
            "Fortnite",
            "Join the battle to be the last one standing in this fast-paced, action-packed battle royale game.",
            developers[1],
            genres[4]
        ),
        gameCreate(
            2,
            "Minecraft",
            "Create, explore, and survive in a blocky world. Build amazing structures and unleash your creativity.",
            developers[3],
            genres[5]
        ),
        gameCreate(
            3,
            "Overwatch",
            "Team up and engage in fast-paced multiplayer battles with unique heroes and abilities.",
            developers[3],
            genres[2]
        ),
        gameCreate(
            4,
            "Grand Theft Auto V",
            "Experience the sprawling open-world of Los Santos and Blaine County in this epic crime thriller.",
            developers[5],
            genres[6]
        ),
        gameCreate(
            5,
            "FIFA 22",
            "Immerse yourself in the world of football with realistic gameplay, stunning graphics, and various game modes.",
            developers[4],
            genres[2]
        ),
        gameCreate(
            6,
            "Assasin`s Creed Valhalla",
            "Explore the Viking Age as Eivor, a legendary Norse warrior, in this epic action RPG adventure.",
            developers[6],
            genres[3]
        ),
        gameCreate(
            4,
            "Cyberpunk 2077",
            "Enter the futuristic open-world of Night City and become a cyber-enhanced mercenary in this highly anticipated RPG.",
            developers[0],
            genres[3]
        ),
        gameCreate(
            4,
            "Among Us",
            "Work together on a space-themed setting to complete tasks, but beware of the impostors among your crew.",
            developers[7],
            genres[7]
        ),
    ]);
}
