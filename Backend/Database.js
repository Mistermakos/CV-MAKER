import mysql from 'mysql2/promise';
import 'dotenv/config'

const connect = async () => 
{
    try{
        const con = await mysql.createConnection({
            host:  process.env.DBHOST,
            user: process.env.LOGINUSER,
            password: process.env.LOGINUSERPASS,
            database: process.env.DBNAME
        });
        return con;
    }
    catch(err)
    {
        console.log(err);
        return "couldn't start the connection"
    }
}

const close = async (con) => 
{
    try
    {
        con.quit();
        return "connection closed successfully"
    }
    catch (err)
    {
        console.log(err);
        return "couldn't close the connection";
    }
}

const query_al = async (table) =>
{
    try {
        const [results] = await connection.query(
          `SELECT * FROM  ${table}`,
        );
      
        console.log(results);
        return [results];
    }
    catch (err) {
        console.log(err);
        return "There were a problem."
    }
}