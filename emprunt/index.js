const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const bodyParser = require('body-parser')
const app = express()
//const connectionString = 'postgresql://ripoul:Motherlode0@localhost:5432/service';
const connectionString = 'postgresql://emprunt:emprunt@10.5.0.3:5432/emprunt';
const baseUri = '/api/v1/emprunt'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

/* insert */
app.post(baseUri, (req, res) => {
    const results = [];
    // Grab data from http request
    const data = { nom: req.body.nom, prenom: req.body.prenom, livre: req.body.livre };
    if (!data.nom || !data.prenom || data.livre == undefined) {
        return res.status(500).json({ success: false, data: 'il manque un paramètre' });
    }
    // Get a Postgres client from the connection pool
    return pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: err });
        }
        // SQL Query > Insert Data
        return client.query('INSERT INTO public."Emprunt"(nom, prenom, livre_id) VALUES ($1, $2, $3);',
            [data.nom, data.prenom, data.livre], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, data: err });
                }
                // SQL Query > Select Data
                const query = client.query('SELECT * FROM public."Emprunt"');
                // Stream results back one row at a time
                query.on('row', (row) => {
                    results.push(row);
                });
                // After all data is returned, close connection and return results
                return query.on('end', () => {
                    done();
                    return res.json({ success: true, data: results });
                });
            });
    });
});

/* read */
app.get(baseUri, (req, res) => {
    const results = [];
    // Get a Postgres client from the connection pool
    return pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: err });
        }
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM public."Emprunt";');
        // Stream results back one row at a time
        query.on('row', (row) => {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        return query.on('end', () => {
            done();
            return res.json({ success: true, data: results });
        });
    });
});

/* UPDATE */
app.put(baseUri, (req, res) => {
    const results = [];
    // Grab data from http request
    const data = { id: req.body.id, nom: req.body.nom, prenom: req.body.prenom, livre: req.body.livre };
    if (data.id == undefined || !data.nom || !data.prenom || data.livre == undefined) {
        return res.status(500).json({ success: false, data: 'il manque un paramètre' });
    }
    // Get a Postgres client from the connection pool
    return pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: err });
        }
        // SQL Query > Update Data
        return client.query('UPDATE public."Emprunt" SET nom=($1), prenom=($2), livre_id=($3) WHERE id=($4)',
            [data.nom, data.prenom, data.livre, data.id], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, data: err });
                }
                // SQL Query > Select Data
                const query = client.query("SELECT * FROM public.\"Emprunt\"");
                // Stream results back one row at a time
                query.on('row', (row) => {
                    results.push(row);
                });
                // After all data is returned, close connection and return results
                query.on('end', function () {
                    done();
                    return res.json({ success: true, data: results });
                });
            });
    });
});

/* DELETE */
app.delete(baseUri, (req, res) => {
    const results = [];
    // Grab data from the URL parameters
    const id = req.body.id;
    if (id == undefined) {
        return res.status(500).json({ success: false, data: 'il manque un paramètre' });
    }
    // Get a Postgres client from the connection pool
    return pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: err });
        }
        // SQL Query > Delete Data
        return client.query('DELETE FROM public."Emprunt" WHERE id=($1)', [id], (err) => {
            if (err) {
                return res.status(500).json({ success: false, data: err });
            }
            // SQL Query > Select Data
            var query = client.query('SELECT * FROM public."Emprunt"');
            // Stream results back one row at a time
            query.on('row', (row) => {
                results.push(row);
            });
            // After all data is returned, close connection and return results
            return query.on('end', () => {
                done();
                return res.json({ success: true, data: results });
            });
        });
    });
});

/* get emprunt by livre */
app.get(baseUri + '/byLivre', (req, res) => {
    const results = [];
    // Grab data from the URL parameters
    const livre_id = req.query.livre_id;
    if (livre_id == undefined) {
        return res.status(500).json({ success: false, data: 'il manque un paramètre' });
    }
    // Get a Postgres client from the connection pool
    return pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: err });
        }
        // SQL Query > Delete Data
        var query = client.query('SELECT * FROM public."Emprunt" WHERE livre_id=($1)', [livre_id]);

        query.on('row', (row) => {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        return query.on('end', () => {
            done();
            return res.json({ success: true, data: results });
        });
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

module.exports = app;