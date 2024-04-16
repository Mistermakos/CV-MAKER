import path from "path"
import {promises as fs} from "fs"
const dirname = path.resolve();

export const Main_Page_Get = async  (req,res) => 
{
    try{
        const file =  path.join(dirname, '/Frontend/index.html') // path to file
        fs.access(file, fs.constants.F_OK)
        .then(() => res.sendFile(file))
        .catch((error) => {throw error});
    } catch (error)
    {
        console.log(error); // for developer to know what is a problem
        res.send("Problem occured") // user Only gets the info that something went wrong
    }
}

