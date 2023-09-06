module.exports = {
    // connection: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    // connection: `mongodb://127.0.0.1/${process.env.DB_NAME}`,
   //connection: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`,
    connection: `mongodb://atlas-sql-64b437e5157acd795ae0b02f-al1rm.a.query.mongodb.net/company_db?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`,
};
