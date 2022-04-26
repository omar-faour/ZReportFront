const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'db.nkultscygvlhemvntund.supabase.co',
  database: 'postgres',
  password: 'ilovem@th.11',
  port: 6543,
});
module.exports={pool};