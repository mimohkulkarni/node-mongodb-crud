import { connectToDB, emptyDB } from "../../database";

export async function startDBServer() {
  try {
    process.env.SQL_DB_NAME = `memory-${new Date().getTime()}`;
    await connectToDB();
  } catch (err) {
    console.error(err);
  }
}

export async function stopDBServer() {
  try {
    await emptyDB();
    await new Promise((resove) => setTimeout(resove, 1000));
  } catch (err) {
    console.error(err);
  }
}
