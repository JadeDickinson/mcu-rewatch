import * as fs from "fs";
import * as path from "path";
import * as request from "request";

import { NUMBER_OF_MCU_MOVIES } from "../site/lib/constants";

const ROOT_PATH: string = path.resolve(__dirname, "..");

const BASE_DOWNLOAD_PATH: string = path.resolve(ROOT_PATH, "site", "assets", "img");
const BASE_BUILD_PATH: string = path.resolve(ROOT_PATH, "build");
const BASE_TEST_IMG_PATH: string = path.resolve(ROOT_PATH, "test", "assets", "img");

if (!fs.existsSync(BASE_DOWNLOAD_PATH)) {
    console.log("img directory doesn't exist, creating it...");
    fs.mkdirSync(BASE_DOWNLOAD_PATH);
    console.log("img directory '" + BASE_DOWNLOAD_PATH + "' created.");
}

let files: string[] = fs.readdirSync(BASE_DOWNLOAD_PATH);

let fileMap: {[key: string]: boolean} = {};

files.forEach((file) => {
    fileMap[file] = true;
});

let downloadMapStr: Buffer = fs.readFileSync(path.resolve(BASE_BUILD_PATH, "movie_posters.json"));
let downloadMap: string = JSON.parse(downloadMapStr.toString());

for (let i = 1; i <= NUMBER_OF_MCU_MOVIES; i++) {
    let filename: string = i.toString() + ".jpg";
    let retry: boolean = fs.existsSync(getRetryPath(path.resolve(BASE_DOWNLOAD_PATH, filename)));

    // does the file exist in the images folder? and is there no retry file present?
    if (fileMap[filename] && !retry) {
        console.log(i + " exists, skipping...");
    } else {
        // if not then if building for prod dl from imdb and put into images folder
        // if on test then copy test image into images folder instead
        let destinationPath: string = path.resolve(BASE_DOWNLOAD_PATH, filename);

        if (process.env.NODE_ENV === "test") {
            console.log("Copying test poster to " + destinationPath);
            copyPlaceholderPoster(path.resolve(BASE_TEST_IMG_PATH, "test.jpg"), destinationPath);
            writeRetryFile(filename, getRetryPath(destinationPath));
        } else {
            let dlFilename: string = downloadMap[i];

            console.log("Downloading poster " + dlFilename + " from IMDB to " + destinationPath + "...");
            request(dlFilename).on("error", (err) => {
                console.error("Error downloading poster. '" + err + "' - Using fallback image.");
                copyPlaceholderPoster(path.resolve(BASE_BUILD_PATH, "placeholder.jpg"), destinationPath);
                writeRetryFile(filename, getRetryPath(destinationPath));
            }).pipe(fs.createWriteStream(destinationPath)).on("close", () => {
                console.log("Downloaded poster to " + destinationPath);
                if (retry) {
                    console.log("Deleting retry file");
                    fs.unlinkSync(getRetryPath(destinationPath));
                }
            });
        }
    }
}

function getRetryPath(path: string) {
    return path + ".retry";
}

function copyPlaceholderPoster(sourcePath: string, destPath: string) {
    fs.promises.copyFile(sourcePath, destPath)
        .then(() => console.log("Placeholder poster copied to " + destPath))
        .catch(() => console.error("Error copying placeholder poster to " + destPath));
}

function writeRetryFile(filename: string, destinationPath: string) {
    console.log("Adding retry file for poster " + filename);
    fs.writeFileSync(destinationPath, "");
    console.log("Retry file added for " + filename);
}
