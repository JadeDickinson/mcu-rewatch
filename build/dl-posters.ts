import * as fs from "fs";
import * as path from "path";
import * as request from "request";

import { NUMBER_OF_MCU_MOVIES } from "../site/lib/constants";

const ROOT_PATH: string = path.resolve(__dirname, "..");

const BASE_DOWNLOAD_PATH: string = path.resolve(ROOT_PATH, "site", "assets", "img");
const BASE_BUILD_PATH: string = path.resolve(ROOT_PATH, "build");
const BASE_TEST_IMG_PATH: string = path.resolve(ROOT_PATH, "test", "assets", "img");

let files: string[] = fs.readdirSync(BASE_DOWNLOAD_PATH);

let fileMap: {[key: string]: boolean} = {};

files.forEach((file) => {
    fileMap[file] = true;
});

for (let i = 1; i <= NUMBER_OF_MCU_MOVIES; i++) {
    // does the file exist in the images folder?
    let filename: string = i.toString() + ".jpg";
    if (fileMap[filename]) {
        console.log(i + " exists, skipping...");
    } else {
        // if not then if building for prod dl from imdb and put into images folder
        // if on test then copy test image into images folder instead
        let destinationPath: string = path.resolve(BASE_DOWNLOAD_PATH, filename);
        if (process.env.NODE_ENV === "test") {
            console.log("Copying test poster to " + destinationPath);
            fs.promises.copyFile(path.resolve(BASE_TEST_IMG_PATH, "test.jpg"), destinationPath)
                .then(() => console.log("Test poster copied to " + destinationPath))
                .catch(() => console.error("Error copying poster to " + destinationPath));
        } else {
            let downloadMapStr: Buffer = fs.readFileSync(path.resolve(BASE_BUILD_PATH, "movie_posters.json"));
            let downloadMap: string = JSON.parse(downloadMapStr.toString());
            let dlFilename: string = downloadMap[i];
            console.log("Downloading poster " + dlFilename + " from IMDB to " + destinationPath + "...");
            request(dlFilename).pipe(fs.createWriteStream(destinationPath)).on("close", () => {
                console.log("Downloaded poster to " + destinationPath);
            });
        }
    }
}