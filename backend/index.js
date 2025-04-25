import SQLite from 'react-native-sqlite-storage'

const db = SQLite.openDatabase({
    name: 'LekhaDB',
    location: 'default'
},
()=>{},
error =>{console.log(error)}
);

const createTable=()=>{
    db.transaction((tx)=>{
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS expenseRec (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, description TEXT, amount REAL, payment_mode TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)',
            [],
            ()=>{
                console.log("Table created sucessfully")
            },
            error=>{
                console.error("Error creating table")
            }
        )
    })
}