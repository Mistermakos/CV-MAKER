import express from 'express';
import multer from "multer"
import path from "path"
const dirname = path.resolve();
import puppeteer from "puppeteer";
const app = express();
import { promises as fs } from "fs"

//Middleware
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use("/", express.static("./Frontend"))
const file = path.join(dirname, '/Frontend/cv.html') // path to file
let fileText = "";

const Creator = async (fileText) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(fileText);
    const pdf = await page.pdf({
        format: 'a4',
        printBackground: true,
    });
    await browser.close();
    return pdf;
}

const CV_Create = async (req, res) => {
    try {
        const photo = req.file.buffer.toString("base64");
        const data = req.body;

        fileText = await fs.readFile(file, 'utf8', (data) => { return data });

        fileText = fileText.replace("[% BUFFER %]", (photo !== "") ? photo : "")
        fileText = fileText.replace("[% NAME %]", (data.FirstName !== "" && data.LastName !== "") ? `<h1>${data.FirstName + " " + data.LastName}</h1>` : "")
        fileText = fileText.replace("[% ADRESS %]", (data.Adress !== "") ? `<p>Location: ${data.Adress}</p>` : "")
        fileText = fileText.replace("[% EMAIL %]", (data.Mail !== "") ? `<p>Email: ${data.Mail}</p>` : "")
        fileText = fileText.replace("[% PHONE %]", (data.Phone !== "") ? `<p>Phone: +48 ${data.Phone}</p>` : "")
        fileText = fileText.replace("[% ABOUTME %]", (data.aboutMe !== "") ? `<p>${data.aboutMe}</p>` : "")
        fileText = fileText.replace("[% LINKS %]", (data['youtube-link'] !== "") ? `<div id="youtube"> <a target="_blank" href="${data['youtube-link']}">My youtube!</a> </div> <br> [% LINKS %]` : "[% LINKS %]")
        fileText = fileText.replace("[% LINKS %]", (data['linkedin-link'] !== "") ? `<div id="linkedin"> <a target="_blank" href="${data['linkedin-link']}">My linkedin!</a> </div>  <br> [% LINKS %]` : "[% LINKS %]")
        fileText = fileText.replace("[% LINKS %]", (data['instagram-link'] !== "") ? `<div id="instagram"> <a target="_blank" href="${data['instagram-link']}">My instagram!</a> </div> <br> [% LINKS %]` : "[% LINKS %]")
        fileText = fileText.replace("[% LINKS %]", (data['facebook-link'] !== "") ? `<div id="facebook"> <a target="_blank" href="${data['facebook-link']}">My facebook!</a> </div> <br> [% LINKS %]` : "[% LINKS %]")
        fileText = fileText.replace("[% LINKS %]", (data['github-link'] !== "") ? `<div id="github"> <a target="_blank" href="${data['github-link']}">My github!</a> </div> <br> [% LINKS %]` : "[% LINKS %]")
        fileText = fileText.replace("[% LINKS %]", "")

        if (data.CompanyName !== "" && data.JobTitle !== "" && data.StartingDate != ['', ''] && data.EndingDate != ['', ''] && data.Responsibilities !== "") {
            fileText = fileText.replace("[% EMPLOYMENT %]", `
                <div class="com">
                    <h3>${data.CompanyName}</h3>
                    <h4>${data.JobTitle}</h4>
                    From: ${data.StartingDate[0]}, To: ${data.EndingDate[0]}
                    <br>
                    <p>${data.Responsibilities}</p>
                </div>
                [% EMPLOYMENT %]
            `)
        }
        else { fileText = fileText.replace("[% EMPLOYMENT %]", "") }

        let it = 1;
        while (eval("data.CompanyName" + it)) {
            fileText = fileText.replace("[% EMPLOYMENT %]", `
                <div class="com">
                    <h3>${eval("data.CompanyName" + it)}</h3>
                    <h4>${eval("data.JobTitle" + 1)}</h4>
                    From: ${eval("data.StartingDate" + it + "[0]")}, To: ${eval("data.EndingDate" + it + "[0]")}
                    <br>
                    <p>${eval("data.Responsibilities" + it)}</p>
                </div>
                [% EMPLOYMENT %]
            `)
            it++;
        }
        fileText = fileText.replace("[% EMPLOYMENT %]", "")

        if (data.ICName !== "" && data.Specialization !== "" && data.qualifications !== "") {
            fileText = fileText.replace("[% EDUCATION %]", `
                <div class="edu">
                    <h3>${data.ICName}</h3>
                    <h4>${data.Specialization}</h4>
                    ${data.qualifications}
                    <p>From: ${data.StartingDate[1]}, To: ${data.EndingDate[1]}</p>
                </div>    
                [% EDUCATION %]
                `)
        }
        else { fileText = fileText.replace("[% EDUCATION %]", "") }

        let i = 1;
        while (eval("data.ICName" + i)) {
            fileText = fileText.replace("[% EDUCATION %]", `
                <div class="edu">
                    <h3>${eval("data.ICName" + i)}</h3>
                    <h4>${eval("data.Specialization" + i)}</h4>
                    ${eval("data.qualifications" + i)}

                    <p>From: ${data.StartingDate[1]}, To: ${data.EndingDate[1]}</p>
                </div>
                [% EDUCATION %]
            `)
            i++;
        }
        fileText = fileText.replace("[% EDUCATION %]", "")

        const pdf = await Creator(fileText);
        res.header('Content-type', 'application/pdf')
        res.send(pdf); // res.send(pdf)
    }
    catch (err) {
        console.log(err);
        res.send("Error occured")
    }
}

const Main_Page_Get = async (req, res) => {
    try {
        const file = path.join(dirname, '/Frontend/index.html') // path to file
        fs.access(file, fs.constants.F_OK)
            .then(() => res.sendFile(file))
            .catch((error) => { throw error });
    } catch (error) {
        console.log(error); // for developer to know what is a problem
        res.send("Problem occured") // user Only gets the info that something went wrong
    }
}

const Redirect_Main = async (req, res) => { res.redirect('/'); }

const router = express.Router();
router.route("/").get(await Main_Page_Get)
router.post('/CV', upload.single('Photo'), await CV_Create)
router.get("*", await Redirect_Main)
app.use("/", router);

app.listen(3000, () =>
    console.log(`Example app listening on port http://localhost:3000/`),
);

//https://marketplace.canva.com/EAFzfwx_Qik/3/0/1131w/canva-blue-simple-professional-cv-resume-HZVmncd0LSs.jpg