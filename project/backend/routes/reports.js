const express = require('express');
const reports = express.Router();
const validation = require('../middlewares/validation');
const fs = require('fs');
const path = require('path');

reports.get('/sponsors/sales', async (req, res) => {
    try {
        if (!req.query.StartDate || !req.query.EndDate) {
            res.status(400).send();
            return;
        }
        const sponsors = await req.app.locals.db.getSponsorSales(req.query.StartDate, req.query.EndDate);
        if (!sponsors) {
            res.status(404).send();
            return;
        }
        res.status(200).send({ sponsors });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

reports.get('/sponsors/:SponsorName/sales', async (req, res) => {
    try {
        if (!req.query.StartDate || !req.query.EndDate) {
            res.status(400).send();
            return;
        }
        const sales = await req.app.locals.db.getSponsorSalesByName(req.params.SponsorName, req.query.StartDate, req.query.EndDate);
        if (sales.length === 0) {
            res.status(404).send();
            return;
        }
        res.status(200).send({ sales });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

reports.get('/sponsors/sales/download', async (req, res) => {
    try {
        if (!req.query.StartDate || !req.query.EndDate) {
            res.status(400).send();
            return;
        }
        const sponsors = await req.app.locals.db.getSponsorSales(req.query.StartDate, req.query.EndDate);
        if (!sponsors) {
            res.status(404).send();
            return;
        }

        let data = 'Username,Points,Item Count,Order Date,Sponsor Name\n';
        const options = {
            root: path.join("../backend")
        };

        for (let sponsor of sponsors) {
            for(let i = 0; i < sponsor.sales?.length; i++) {
                data += `${sponsor.sales[i].Username},${sponsor.sales[i].total},${sponsor.sales[i].items.length},${sponsor.sales[i].OrderDate},${sponsor.sales[i].SponsorName}`;
                if (i < sponsor.sales.length-1) data += '\n';
            }
        }

        fs.writeFile('./report.csv', data, err => {
            if (err) {
                console.log(err);
            }
            res.sendFile('report.csv', options, err => {
                if(err) console.log(err)
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

reports.get('/sponsors/:SponsorName/sales/download', async (req, res) => {
    try {
        if (!req.query.StartDate || !req.query.EndDate) {
            res.status(400).send();
            return;
        }
        const sales = await req.app.locals.db.getSponsorSalesByName(req.params.SponsorName, req.query.StartDate, req.query.EndDate);
        if (!sales) {
            res.status(404).send();
            return;
        }
        let data = 'Username,Points,Item Count,Order Date,Sponsor Name\n';
        const options = {
            root: path.join("../backend")
        };
        for(let i = 0; i < sales.length; i++) {
            data += `${sales[i].Username},${sales[i].total},${sales[i].items.length},${sales[i].OrderDate},${sales[i].SponsorName}`;
            if (i < sales.length-1) data += '\n';
        }
        fs.writeFile('./report.csv', data, err => {
            if (err) {
                console.log(err);
            }
            res.sendFile('report.csv', options, err => {
                if(err) console.log(err)
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

reports.get('/drivers/:Username/sales', async (req, res) => {
    try {
        if (!req.query.StartDate || !req.query.EndDate) {
            res.status(400).send();
            return;
        }

        const allSales = await req.app.locals.db.getSponsorSales(req.query.StartDate, req.query.EndDate);
        
        // Filter by given username
        let sales = [];
        for (let sponsor of allSales) {
            for (let sale of sponsor?.sales) {
                if (sale?.Username === req.params.Username) sales.push(sale);
            }
        }
        if (sales.length === 0) {
            res.status(404).send();
            return;
        }

        res.status(200).send({ sales });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

reports.get('/drivers/:Username/sales/download', async (req, res) => {
    try {
        if (!req.query.StartDate || !req.query.EndDate) {
            res.status(400).send();
            return;
        }

        const allSales = await req.app.locals.db.getSponsorSales(req.query.StartDate, req.query.EndDate);

        // Filter by given username
        let sales = [];
        for (let sponsor of allSales) {
            for (let sale of sponsor?.sales) {
                if (sale?.Username === req.params.Username) sales.push(sale);
            }
        }
        if (sales.length === 0) {
            res.status(404).send();
            return;
        }

        // Write file contents
        let data = 'Username,Points,Item Count,Order Date,Sponsor Name\n';
        const options = {
            root: path.join("../backend")
        };
        for(let i = 0; i < sales.length; i++) {
            data += `${sales[i].Username},${sales[i].total},${sales[i].items.length},${sales[i].OrderDate},${sales[i].SponsorName}`;
            if (i < sales.length-1) data += '\n';
        }
        fs.writeFile('./report.csv', data, err => {
            if (err) {
                console.log(err);
            }
            res.sendFile('report.csv', options, err => {
                if(err) console.log(err)
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

reports.get('/sales', async (req, res) => {
    try {
        const Username = req.query?.Username;
        const SponsorName = req.query?.SponsorName;
        const StartDate = req.query?.StartDate;
        const EndDate = req.query?.EndDate;

        let allSales = [];
        if (StartDate && EndDate) allSales = await req.app.locals.db.getSponsorSales(StartDate, EndDate);
        else allSales = await req.app.locals.db.getAllSales();

        // Flatten into single sales array
        let sales = [];
        for (let sponsor of allSales) {
            for (let sale of sponsor?.sales) {
                sales.push(sale);
            }
        }

        // Filter by Username and or SponsorName
        if (Username) sales = sales.filter(sale => sale.Username === Username);
        if (SponsorName) sales = sales.filter(sale => sale.SponsorName === SponsorName);

        // Not found
        if (sales.length === 0) {
            res.status(404).send();
            return;
        }

        // Success
        res.status(200).send({ sales });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

reports.get('/sales/download', async (req, res) => {
    try {
        const Username = req.query?.Username;
        const SponsorName = req.query?.SponsorName;
        const StartDate = req.query?.StartDate;
        const EndDate = req.query?.EndDate;

        let allSales = [];
        if (StartDate && EndDate) allSales = await req.app.locals.db.getSponsorSales(StartDate, EndDate);
        else allSales = await req.app.locals.db.getAllSales();

        let sales = [];
        for (let sponsor of allSales) {
            for (let sale of sponsor?.sales) {
                sales.push(sale);
            }
        }

        if (Username) sales = sales.filter(sale => sale.Username === Username);
        if (SponsorName) sales = sales.filter(sale => sale.SponsorName === SponsorName);

        // Write file contents
        let data = 'Username,Points,Item Count,Order Date,Sponsor Name\n';
        const options = {
            root: path.join("../backend")
        };
        for (let i = 0; i < sales.length; i++) {
            data += `${sales[i].Username},${sales[i].total},${sales[i].items.length},${sales[i].OrderDate},${sales[i].SponsorName}`;
            if (i < sales.length - 1) data += '\n';
        }
        fs.writeFile('./report.csv', data, err => {
            if (err) {
                console.log(err);
            }
            res.sendFile('report.csv', options, err => {
                if (err) console.log(err)
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

reports.get('/invoices/download', async (req, res) => {
    try {
        const Username = req.query?.Username;
        const SponsorName = req.query?.SponsorName;
        const StartDate = req.query?.StartDate;
        const EndDate = req.query?.EndDate;

        let allSales = [];
        if (StartDate && EndDate) allSales = await req.app.locals.db.getSponsorSales(StartDate, EndDate);
        else allSales = await req.app.locals.db.getAllSales();

        let sales = [];
        for (let sponsor of allSales) {
            for (let sale of sponsor?.sales) {
                sales.push(sale);
            }
        }

        if (Username) sales = sales.filter(sale => sale.Username === Username);
        if (SponsorName) sales = sales.filter(sale => sale.SponsorName === SponsorName);

        // Write file contents
        let data = 'Username,Sponsor Name,Item Name,Points,Total\n';
        sales.forEach((sale, i) => {
            let Username = sale.Username;
            let SponsorName = sale.SponsorName;
            let ConversionRate = sale.ConversionRate;
            sale.items.forEach((item, j) => {
                let row = `${Username},${SponsorName},${item.ItemName},${item.ItemCost},${parseFloat(item.ItemCost * ConversionRate).toFixed(2)}`;
                if (i < sales.length - 1 || j < sale.items.length - 1) row += '\n';
                data += row;
            });
        });

        // Send file
        const options = {
            root: path.join("../backend")
        };
        fs.writeFile('./report.csv', data, err => {
            if (err) {
                console.log(err);
            }
            res.sendFile('report.csv', options, err => {
                if (err) console.log(err)
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * Returns a list of applications from the audit log.
 */
reports.get('/audit/applications', async (req, res) => {
    try {
        const SponsorName = req.query.SponsorName;
        
        let results = await req.app.locals.db.getAllApplications(req.query.StartDate, req.query.EndDate);

        if (SponsorName) results = results.filter(result => result.SponsorName === SponsorName);

        res.status(200).send({ results });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * Returns applications audit log list as a CSV file.
 */
reports.get('/audit/applications/download', async (req, res) => {
    try {
        const SponsorName = req.query.SponsorName;

        let results = await req.app.locals.db.getAllApplications(req.query.StartDate, req.query.EndDate);
        if (SponsorName) results = results.filter(result => result.SponsorName === SponsorName);

        if (results.length === 0) {
            res.status(404).send();
            return;
        }

        // Write file contents
        let data = 'Username,Sponsor Name,Application Date,Application Status,Reason\n';
        results.forEach((result, i) => {
            data += `${result.Username},${result.SponsorName},${result.ApplicationDate},${result.ApplicationStatus},${result.Reason}`;
            if (i < results.length - 1) data += '\n';
        });

        // Send file
        const options = {
            root: path.join("../backend")
        };
        fs.writeFile('./report.csv', data, err => {
            if (err) {
                console.log(err);
            }
            res.sendFile('report.csv', options, err => {
                if (err) console.log(err);
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * Returns a list of point changes from the audit log.
 */
reports.get('/audit/pointChanges', async (req, res) => {
    try {
        const SponsorName = req.query.SponsorName;
        
        let results = await req.app.locals.db.getAllTransactions(req.query.StartDate, req.query.EndDate);

        if (SponsorName) results = results.filter(result => result.SponsorName === SponsorName);

        res.status(200).send({ results });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * Returns point changes audit log as a CSV file.
 */
reports.get('/audit/pointChanges/download', async (req, res) => {
    try {
        const SponsorName = req.query.SponsorName;

        let results = await req.app.locals.db.getAllTransactions(req.query.StartDate, req.query.EndDate);
        if (SponsorName) results = results.filter(result => result.SponsorName === SponsorName);

        if (results.length === 0) {
            res.status(404).send();
            return;
        }

        // Write file contents
        let data = 'Username,Sponsor Name,Transaction Date,Transaction Amount,Reason\n';
        results.forEach((result, i) => {
            data += `${result.Username},${result.SponsorName},${result.TransactionDate},${result.TransactionAmount},${result.Reason}`;
            if (i < results.length - 1) data += '\n';
        });

        // Send file
        const options = {
            root: path.join("../backend")
        };
        fs.writeFile('./report.csv', data, err => {
            if (err) {
                console.log(err);
            }
            res.sendFile('report.csv', options, err => {
                if (err) console.log(err);
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * Returns a list of password changes from the audit log.
 */
reports.get('/audit/passwordChanges', async (req, res) => {
    try {
        const SponsorName = req.query.SponsorName;

        // If sponsor name is given, only return password changes for users of that sponsor organization.
        let results;
        if (SponsorName) results = await req.app.locals.db.getAllPWChangesBySponsor(req.query.StartDate, req.query.EndDate, SponsorName);
        else results = await req.app.locals.db.getAllPWChanges(req.query.StartDate, req.query.EndDate);

        res.status(200).send({ results });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * Returns password changes audit log as a CSV file.
 */
reports.get('/audit/passwordChanges/download', async (req, res) => {
    try {
        const SponsorName = req.query.SponsorName;

        // If sponsor name is given, only return password changes for users of that sponsor organization.
        let results;
        if (SponsorName) results = await req.app.locals.db.getAllPWChangesBySponsor(req.query.StartDate, req.query.EndDate, SponsorName);
        else results = await req.app.locals.db.getAllPWChanges(req.query.StartDate, req.query.EndDate);

        if (results.length === 0) {
            res.status(404).send();
            return;
        }

        // Write file contents
        let data = 'Username,Date,ChangeType\n';
        results.forEach((result, i) => {
            data += `${result.Username},${result.Date},${result.ChangeType}`;
            if (i < results.length - 1) data += '\n';
        });

        // Send file
        const options = {
            root: path.join("../backend")
        };
        fs.writeFile('./report.csv', data, err => {
            if (err) {
                console.log(err);
            }
            res.sendFile('report.csv', options, err => {
                if (err) console.log(err);
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * Returns a list of login attempts from the audit log.
 */
reports.get('/audit/loginAttempts', async (req, res) => {
    try {
        const SponsorName = req.query.SponsorName;

        // If sponsor name is given, only return login attempts for users of that sponsor organization.
        let results;
        if (SponsorName) results = await req.app.locals.db.getAllLoginAttemptsBySponsor(req.query.StartDate, req.query.EndDate, SponsorName);
        else results = await req.app.locals.db.getAllLoginAttempts(req.query.StartDate, req.query.EndDate);

        res.status(200).send({ results });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * Returns login attempts audit log as a CSV file.
 */
reports.get('/audit/loginAttempts/download', async (req, res) => {
    try {
        const SponsorName = req.query.SponsorName;

        // If sponsor name is given, only return login attempts for users of that sponsor organization.
        let results;
        if (SponsorName) results = await req.app.locals.db.getAllLoginAttemptsBySponsor(req.query.StartDate, req.query.EndDate, SponsorName);
        else results = await req.app.locals.db.getAllLoginAttempts(req.query.StartDate, req.query.EndDate);

        if (results.length === 0) {
            res.status(404).send();
            return;
        }

        // Write file contents
        let data = 'Username,Date,Success\n';
        results.forEach((result, i) => {
            data += `${result.Username},${result.Date},${result.Success}`;
            if (i < results.length - 1) data += '\n';
        });

        // Send file
        const options = {
            root: path.join("../backend")
        };
        fs.writeFile('./report.csv', data, err => {
            if (err) {
                console.log(err);
            }
            res.sendFile('report.csv', options, err => {
                if (err) console.log(err);
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

reports.get('/:SponsorName/driverPoints', async (req, res) => {
    try {
        const DriverName = req.query.DriverName;

        let transactions = await req.app.locals.db.getAllTransactions(req.query.StartDate, req.query.EndDate);
        transactions = transactions.filter(transaction => transaction.SponsorName === req.params.SponsorName);
        if (DriverName) transactions = transactions.filter(transaction => transaction.Username === DriverName);
        
        // Put transactions into a hash map with username as key and list of transactions as values
        let results = new Map();
        for (let transaction of transactions) {
            if (results.has(transaction.Username)) results.set(transaction.Username, [...results.get(transaction.Username), transaction]);
            else results.set(transaction.Username, [transaction]);
        }
        // Convert map to an array of objects
        results = Array.from(results, ([Username, pointChanges]) => ({Username, pointChanges}));

        // Re-map point change objects so they don't all include username and sponsor name.
        for (let result of results) {
            if (result.pointChanges?.length > 0) {
                result.pointChanges = result.pointChanges.map(change => {
                    return {
                        Date: change.TransactionDate,
                        TransactionAmount: change.TransactionAmount,
                        Reason: change.Reason,
                        SponsorName: change.SponsorName
                    }
                })
            }
        }

        res.status(200).send({ results });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

reports.get('/:SponsorName/driverPoints/download', async (req, res) => {
    try {
        const DriverName = req.query.DriverName;

        let transactions = await req.app.locals.db.getAllTransactions(req.query.StartDate, req.query.EndDate);
        transactions = transactions.filter(transaction => transaction.SponsorName === req.params.SponsorName);
        if (DriverName) transactions = transactions.filter(transaction => transaction.Username === DriverName);
        
        // Put transactions into a hash map with username as key and list of transactions as values
        let results = new Map();
        for (let transaction of transactions) {
            if (results.has(transaction.Username)) results.set(transaction.Username, [...results.get(transaction.Username), transaction]);
            else results.set(transaction.Username, [transaction]);
        }
        // Convert map to an array of objects
        results = Array.from(results, ([Username, pointChanges]) => ({Username, pointChanges}));

        // Re-map point change objects so they don't all include username and sponsor name.
        for (let result of results) {
            if (result.pointChanges?.length > 0) {
                result.pointChanges = result.pointChanges.map(change => {
                    return {
                        Date: change.TransactionDate,
                        TransactionAmount: change.TransactionAmount,
                        Reason: change.Reason,
                        SponsorName: change.SponsorName
                    }
                })
            }
        }

        if (results.length === 0) {
            res.status(404).send();
            return;
        }

        // Write file contents
        let data = 'Username,Date,TransactionAmount,Reason,SponsorName\n';
        results.forEach((driver, i) => {
            let pointChanges = driver.pointChanges;
            for (let j = 0; j < pointChanges.length; j++) {
                data += `${driver.Username},${pointChanges[j].Date},${pointChanges[j].TransactionAmount},${pointChanges[j].Reason},${pointChanges[j].SponsorName}`;
                if (j < pointChanges.length - 1) data += '\n';
            }  
            if (i < results.length - 1) data += '\n';
        })

        // Send file
        const options = {
            root: path.join("../backend")
        };
        fs.writeFile('./report.csv', data, err => {
            if (err) {
                console.log(err);
            }
            res.sendFile('report.csv', options, err => {
                if (err) console.log(err);
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

module.exports = reports;