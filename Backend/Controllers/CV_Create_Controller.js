import path from "path"
import {promises as fs} from "fs"
const dirname = path.resolve();
import puppeteer from "puppeteer";

const file =  path.join(dirname, '/Frontend/cv.html') // path to file
let fileText = "";


const Creator = async (fileText) => 
{
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setContent(fileText);
    const pdf = await page.pdf({
        format: 'a4',
        printBackground: true,
    });
    await browser.close();
    return pdf;
}

export const CV_Create = async (req,res) =>
{
    try
    {  
        fileText =  await fs.readFile(file, 'utf8', (data) => {
            return data;
        });
        fileText = fileText.replace("EX1", "Hello world!");
        //const pdf = await Creator(fileText);
        //res.header('Content-type', 'application/pdf')
        res.send(fileText);
    }
    catch(err)
    {
        console.log(err);
        res.send("Error occured")
    }
}