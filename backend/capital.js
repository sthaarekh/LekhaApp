import SQLite from 'react-native-sqlite-storage'
import { Alert } from 'react-native';

const db = SQLite.openDatabase({
    name: 'LekhaDB',
    location: 'default'
},
()=>{},
error =>{console.log(error)}
);

export const getExpensePercent = async (category) => {
    const [year, month] = [new Date().getFullYear(), new Date().getMonth() + 1];
    const yearStr = String(year);
    const monthStr = month.toString().padStart(2, '0');
    
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT amount FROM expenseRec
           WHERE category = ?
           AND strftime('%Y', timestamp) = ?
           AND strftime('%m', timestamp) = ?`,
          [category, yearStr, monthStr],
          (_, results) => {
            let categoryAmount = 0;
            for (let i = 0; i < results.rows.length; i++) {
              const item = results.rows.item(i);
              categoryAmount += parseFloat(item.amount || 0);
            }
            
            tx.executeSql(
              `SELECT SUM(amount) as total FROM expenseRec
               WHERE strftime('%Y', timestamp) = ?
               AND strftime('%m', timestamp) = ?`,
              [yearStr, monthStr],
              (_, totalResults) => {
                const totalExpense = parseFloat(totalResults.rows.item(0).total || 0);
                let percentage = 0;
                if (totalExpense > 0) {
                  percentage = (categoryAmount / totalExpense) * 100;
                }
                resolve(percentage);
              },
              (_, error) => {
                console.error('Error fetching total expenses:', error);
                resolve(0);
              }
            );
          },
          (_, error) => {
            console.error('Error fetching category expenses:', error);
            resolve(0);
          }
        );
      }, error => {
        console.error('Transaction error:', error);
        resolve(0);
      });
    });
  };
  