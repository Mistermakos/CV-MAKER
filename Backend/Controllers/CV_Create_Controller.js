export const CV_Create = async (req,res) =>
{
    try
    {
        console.log(req.body)
    }
    catch(err)
    {
        console.log(err);
        res.send("Error occured")
    }
}