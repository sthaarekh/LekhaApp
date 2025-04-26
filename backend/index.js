import SQLite from 'react-native-sqlite-storage'
import { Alert } from 'react-native';

const db = SQLite.openDatabase({
    name: 'LekhaDB',
    location: 'default'
},
()=>{},
error =>{console.log(error)}
);

export const createTable=()=>{
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

export const insertData=(category, description, amount, mode, callback)=>{
    db.transaction((tx)=>{
        tx.executeSql(
            'INSERT INTO userrec (category, description, amount, payment_mode) VALUES (?, ?, ?, ?)',
            [category, description, parseFloat(amount), mode],
            (tx, results) => {
                if (results.rowsAffected > 0) {
                    callback(true);
                } else {
                    Alert.alert('Error', 'Failed to add item');
                    callback(false);
                }
                },
            error => {
                console.error('Error adding item:', error);
                Alert.alert('Error', 'An error occurred while adding the item');
                callback(false);
            }
        )
    })
}