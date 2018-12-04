let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./index');
let should = chai.should();

//script a executer sur nouvelle table
chai.use(chaiHttp);
/*
  * Test the /GET route
  */
describe('/GET emprunt', () => {
    it('devrait retourner tous les emprunts', (done) => {
        chai.request(server)
            .get('/api/v1/emprunt')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.length.should.be.eql(0);
                done();
            });
    });
});

describe('/POST emprunt', () => {
    it('devrait add un emprunt et tous les retourner', (done) => {
        let emprunt = { nom: "LE BRIS", prenom: "Jules", livre: 1 };
        chai.request(server)
            .post('/api/v1/emprunt')
            .send(JSON.stringify(emprunt))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(true);
                res.body.data.should.be.a("array");
                res.body.data.length.should.be.eql(1);
                done();
            });
    });
    it('missing parameter on POST', (done) => {
        let emprunt = { nom: "LE BRIS", prenom: "Jules" };
        chai.request(server)
            .post('/api/v1/emprunt')
            .send(JSON.stringify(emprunt))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(false);
                done();
            });
    });
});

describe('/PUT emprunt', () => {
    it('devrait modifier un emprunt et tous les retourner', (done) => {
        let emprunt = { id: 1, nom: "LE BRIS", prenom: "THOMAS", livre: 1 };
        chai.request(server)
            .put('/api/v1/emprunt')
            .send(JSON.stringify(emprunt))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(true);
                res.body.data.should.be.a("array");
                res.body.data.length.should.be.eql(1);
                res.body.data[0].prenom.should.be.eql("THOMAS");
                done();
            });
    });
    it('missing parameter on PUT', (done) => {
        let emprunt = { nom: "LE BRIS", prenom: "Jules" };
        chai.request(server)
            .put('/api/v1/emprunt')
            .send(JSON.stringify(emprunt))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(false);
                done();
            });
    });
});

describe('/DELETE emprunt', () => {
    it('devrait supprimer un emprunt et tous les retourner', (done) => {
        let emprunt = { id: 1 };
        chai.request(server)
            .delete('/api/v1/emprunt')
            .send(JSON.stringify(emprunt))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(true);
                res.body.data.should.be.a("array");
                res.body.data.length.should.be.eql(0);
                done();
            });
    });
    it('missing parameter on delete', (done) => {
        let emprunt = {};
        chai.request(server)
            .delete('/api/v1/emprunt')
            .send(JSON.stringify(emprunt))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(false);
                done();
            });
    });
});