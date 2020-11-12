var cm = require('./common_fn')

exports.DBM_tableExistCheck = (con, dbName, table) => {
    let exist = false;
    con.query("SHOW TABLES LIKE " + cm.strWrapper(table.name), function (err, result) {
        if (err) throw err;
        if (result == "") {
            console.log("Table " + table.name + " Does Not Exist");
            DBM_createTable (con, dbName, table.name, table.schema);

        } else {
            console.log("Table : " + JSON.stringify(result))
            exist = true;
        }
        return exist;
    });
}

exports.DBM_selectDatabase = (con, dbName) => {
    con.query("USE " + dbName, function (err, result) {
        if (err) throw err;
        console.log("Database " + dbName + " Used");
        return true;
      });

}

var appendIdxColumn = (sql, index) => {
    var firstCol = true;
    index.columns.forEach(column => {
        if (firstCol) {
            firstCol = false;
        } else {
            sql += ', ';
        }
        sql += column;
    });
    return sql;
}

var appendStrList = (sql, arr) => {
    var ft = true;
    arr.forEach(enumVal => {
        if (ft) {
            ft = false;
        } else {
            sql += ",";
        }
        sql += "'" + enumVal + "'";
    });
    return sql;
}


var appendIndexes = (sql, indexes) => {
    let first = true;
    indexes.forEach(index => {
        if (first) {
            first = false;
        } else {
            sql += "), "
        }
        sql += "INDEX "+ index.name + " (";
        let firstCol = true;
        sql = appendIdxColumn (sql, index);
    });
    sql += ")";
    return sql;
}

var DBM_createTable = (con, db, tableName, tableProperties) => {
    var sql = "CREATE TABLE `"+db+"`.`"+tableName+"` (";
    var first = true;

    for (const field in tableProperties) {
        if (field != 'indexes') {
            if (first) {
                first = false;
            } else {
                sql += ", ";
            }
            sql += field + " ";
            for (const prop in tableProperties[field]) {
                switch (prop) {
                    case 'sqlType':
                        sql += tableProperties[field][prop]
                        break;
                    case 'allowNull':
                        sql += " ";
                        if (tableProperties[field][prop] == true) {
                            sql += 'NULL'
                        } else {
                            sql += 'NOT NULL'
                        }
                        break;
                    case 'default':
                        sql += " ";
                        sql += "DEFAULT "+ tableProperties[field][prop];
                        break;
                    case 'enum':
                        sql += "("
                        sql = appendStrList (sql, tableProperties[field][prop]);
                        sql += ")";
                        break;
                }
            }
        }
    }


    if (tableProperties.hasOwnProperty('indexes')) {
        sql += ", ";
        if (tableProperties.indexes.length > 0) {
            sql = appendIndexes (sql, tableProperties.indexes);
        }
    }
    sql += ")";

    console.log("Create Table : " + sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created : " + JSON.stringify(result));
      });

}

exports.DBM_createDb = (con, dbName) => {
    
    con.query("CREATE DATABASE " + cm.strWrapper(dbName), function (err, result) {
        if (err) throw err;
        console.log("Database created");
      });
}