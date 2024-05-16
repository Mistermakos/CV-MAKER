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

        fileText =  await fs.readFile(file, 'utf8', (data) => {return data});

        if(photo !== ""){fileText = fileText.replace("[% BUFFER %]", photo)}
        else{fileText = fileText.replace("[% BUFFER %]", "")}

        if(data.FirstName !== "" && data.LastName !== ""){fileText = fileText.replace("[% NAME %]", `<h1>${data.FirstName + " " + data.LastName}</h1>`)}
        else{fileText = fileText.replace("[% NAME %]", "")}

        if(data.Adress !== ""){fileText = fileText.replace("[% ADRESS %]", `<li>Location: ${data.Adress}</li>`)}
        else{fileText = fileText.replace("[% ADRESS %]", "")}    

        if(data.Mail !== ""){fileText = fileText.replace("[% EMAIL %]", `<li>Email: ${data.Mail}</li>`)}
        else{fileText = fileText.replace("[% EMAIL %]", "")} 

        if(data.Phone !== ""){fileText = fileText.replace("[% PHONE %]", `<li>Phone: ${data.Mail}</li>`)}
        else{fileText = fileText.replace("[% PHONE %]", "")} 

        if(data.CompanyName !== "" && data.JobTitle !== "" && data.StartingDate != ['', ''] && data.EndingDate != ['', ''] && data.Responsibilities !== "")
        {
            fileText = fileText.replace("[% EMPLOYMENT %]", `
                <h3>${data.CompanyName}</h3>
                <p>${data.StartingDate[0]}:${data.EndingDate[0]}</p>
                <p>${data.Responsibilities}</p>
                <p></p>
                [% EMPLOYMENT %]
            `)
        }
        else{fileText = fileText.replace("[% EMPLOYMENT %]", "")} 

        let it = 1;
        while(eval("data.CompanyName"+it))
        {
            fileText = fileText.replace("[% EMPLOYMENT %]", `
                <h3>${eval("data.CompanyName"+it)}</h3>
                <p>${eval("data.StartingDate"+it+"[0]")}:${eval("data.EndingDate"+it+"[0]")}</p>
                <p>${eval("data.Responsibilities"+it)}</p>
                [% EMPLOYMENT %]
            `)
            it++;
        }
        fileText = fileText.replace("[% EMPLOYMENT %]", "")
        if(data.ICName !== "" && data.Specialization !== "" && data.qualifications !== "")
            {
                fileText = fileText.replace("[% EDUCATION %]", `
                    <h3>${data.ICName}</h3>
                    <p>${data.Specialization}</p>
                    <p>${data.qualifications}</p>
                    [% EDUCATION %]
                `)
            }
        else{fileText = fileText.replace("[% EDUCATION %]", "")} 

        let i = 1;
        while(eval("data.ICName"+i))
        {
            fileText = fileText.replace("[% EDUCATION %]", `
                <h3>${eval("data."+i)}</h3>
                <p>${eval("data.Specialization"+i)}</p>
                <p>${eval("data.qualifications"+i)}</p>
                [% EDUCATION %]
            `)
            i++;
        }
        fileText = fileText.replace("[% EDUCATION %]", "")

        if(data.aboutMe !== ""){fileText = fileText.replace("[% ABOUTME %]",`<h2>About Me</h2><p>${data.aboutMe}</p>`)}
        else{fileText = fileText.replace("[% ABOUTME %]", "")}   

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