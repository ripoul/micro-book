const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const baseUriLivre = '/api/v1/micro-book/livre';
const baseUriEmprunt = '/api/v1/micro-book/emprunt';
const APILivre = 'http://localhost:3001/api/v1/livre';
const APIEmprunt = 'http://localhost:3000/api/v1/emprunt';

const fetch = require('node-fetch');
global.Headers = fetch.Headers;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
});*/

//get livre
app.get(baseUriLivre, (req, response) => {
    return request(APILivre, { json: true }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        return response.json(body);
    });
});

//add livre
app.post(baseUriLivre, (req, response) => {
    const data = { titre: req.body.titre, auteur: req.body.auteur, resume: req.body.resume, quantite: req.body.quantite };
    if (!data.auteur || data.quantite == undefined || !data.resume || !data.titre) {
        return response.status(500).json({ success: false, data: 'il manque un paramètre' });
    }
    if (data.quantite<0) {
        return response.status(500).json({ success: false, data: 'il ne peut pas y avoir un nombre négatif de livre' });
    }
    return request({ url: APILivre, method: 'POST', json: data }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        return response.json(body);
    });
});

//edit livre
app.put(baseUriLivre, (req, response) => {
    const data = { id: req.body.id, titre: req.body.titre, auteur: req.body.auteur, resume: req.body.resume, quantite: req.body.quantite };
    if (data.id == undefined || !data.auteur || data.quantite == undefined || !data.resume || !data.titre) {
        return response.status(500).json({ success: false, data: 'il manque un paramètre' });
    }
    if (data.quantite<0) {
        return response.status(500).json({ success: false, data: 'il ne peut pas y avoir un nombre négatif de livre' });
    }
    return request({ url: APILivre, method: 'PUT', json: data }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        return response.json(body);
    });
});

//delete livre
app.delete(baseUriLivre, (req, response) => {
    const data = { id: req.body.id };
    if (!data.id) {
        return response.status(500).json({ success: false, data: 'il manque un paramètre' });
    }
    return request({ url: APIEmprunt, method: 'GET', json: {} }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        error = false;
        body.data.forEach(function (emprunt) {
            if (emprunt.livre_id == data.id) {
                error = true;
            }
        });
        if (error) {
            return response.status(500).json({ success: false, data: "on ne peut pas suprimer un livre possédant encore des emprunts" });
        }
        return request({ url: APILivre, method: 'DELETE', json: data }, (err, res, body) => {
            if (err) {
                return response.status(500).json({ success: false, data: err });
            }
            if (!body.success) {
                return response.status(500).json({ success: false, data: body.data });
            }
            return response.json(body);
        });
    });
});

/*##########################################################################################*/

function getLivre(livres, id) {
    ret = null;
    livres.forEach(function (element) {
        if (element.id == id) {
            ret = element;
        }
    });
    return ret;
}

function getEmprunt(emprunts, id) {
    ret = null;
    emprunts.forEach(function (element) {
        if (element.id == id) {
            ret = element;
        }
    });
    return ret;
}

//get emprunt
app.get(baseUriEmprunt, (req, response) => {
    return request(APIEmprunt, { json: true }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        return response.json(body);
    });
});

//get emprunt by livre
app.get(baseUriEmprunt + "/byLivre", (req, response) => {
    var livre_id = req.query.livre_id;
    if (livre_id == undefined) {
        return response.status(500).json({ success: false, data: "il manque un paramètre" });
    }
    return request({ url: APIEmprunt + "/byLivre?livre_id=" + livre_id, method: 'GET' }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        body=JSON.parse(body)
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        return response.json(body);
    });
});

//add emprunt
app.post(baseUriEmprunt, (req, response) => {
    const data = { nom: req.body.nom, prenom: req.body.prenom, livre: req.body.livre };
    if (!data.nom || !data.prenom || data.livre == undefined) {
        return response.status(500).json({ success: false, data: 'il manque un paramètre' });
    }
    return request({ url: APILivre, method: 'GET', json: {} }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        var livre = getLivre(body.data, data.livre);
        if (!livre) {
            return response.status(500).json({ success: false, data: 'ce livre n\'existe pas' });
        }
        if (livre.quantite <= 0) {
            return response.status(500).json({ success: false, data: 'ce livre n\'est plus en stock' });
        }
        return request({ url: APIEmprunt, method: 'POST', json: data }, (err, res, body) => {
            if (err) {
                return response.status(500).json({ success: false, data: err });
            }
            if (!body.success) {
                return response.status(500).json({ success: false, data: body.data });
            }
            livre.quantite = livre.quantite - 1
            return request({ url: APILivre, method: 'PUT', json: livre }, (err, res, body) => {
                if (err) {
                    return response.status(500).json({ success: false, data: err });
                }
                if (!body.success) {
                    return response.status(500).json({ success: false, data: body.data });
                }
                return response.json(body);
            });
        });
    });
});

//delete emprunt
app.delete(baseUriEmprunt, (req, response) => {
    const data = { id: req.body.id };
    if (data.id == undefined) {
        return response.status(500).json({ success: false, data: 'il manque un paramètre' });
    }

    return request({ url: APIEmprunt, method: 'GET', json: {} }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        var emprunt = getEmprunt(body.data, data.id);
        if (!emprunt) {
            return response.status(500).json({ success: false, data: 'cet emprunt n\'existe pas' });
        }
        return request({ url: APILivre, method: 'GET', json: data }, (err, res, body) => {
            if (err) {
                return response.status(500).json({ success: false, data: err });
            }
            if (!body.success) {
                return response.status(500).json({ success: false, data: body.data });
            }
            var livre = getLivre(body.data, emprunt.livre_id);
            livre.quantite = livre.quantite + 1;
            return request({ url: APILivre, method: 'PUT', json: livre }, (err, res, body) => {
                if (err) {
                    return response.status(500).json({ success: false, data: err });
                }
                if (!body.success) {
                    return response.status(500).json({ success: false, data: body.data });
                }
                return request({ url: APIEmprunt, method: 'DELETE', json: { "id": emprunt.id } }, (err, res, body) => {
                    if (err) {
                        return response.status(500).json({ success: false, data: err });
                    }
                    if (!body.success) {
                        return response.status(500).json({ success: false, data: body.data });
                    }
                    return response.json(body);
                });
            });
        });
    });
});


app.listen(3002, function () {
    console.log('Example app listening on port 3002!')
})

module.exports = app;
