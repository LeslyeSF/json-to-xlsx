import pg from "pg";
import dotenv from "dotenv";
import * as fs from 'fs';
import converter from 'json-2-csv';
dotenv.config();

const { Pool } = pg;

const connection = new Pool({
  user: 'postgres',
  password: process.env.PASSWORD,
  host: 'localhost',
  port: 5432,
  database: 'repositorie'
});

async function getData(){
  const data = await connection.query(
    `SELECT name, owner, description, topic, language, stars 
    FROM repositories 
    WHERE "hasSponsorship"=true;
    ORDER BY stars DESC`);
  return data.rows;
}

const data = await getData();
const dataJson = JSON.stringify(data);

converter.json2csv(dataJson, (err, csv) => {
  if (err) {
      console.log(err);
  }
  // print CSV string
  console.log(csv);
  fs.writeFile("most-famous-sponsored-repos.csv", dataJson, (err)=>{
    (err) ? console.log("deu errado") : console.log("arquivo pronto");
  });
});

fs.writeFile("sponsored-repos.json", dataJson, (err)=>{
  (err) ? console.log("deu errado") : console.log("arquivo pronto");
});


