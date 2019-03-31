const http = require('https');
const axios = require('axios');
const { get } = require('request');
const url = 'https://api.paystack.co/bank';

const externalRequest = {
    usesRequest: (req, res) => {
        get(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        }, (error, response) => {
            if (error) {
                res.status(400);
                res.json({
                    message: error.message
                });
                return;
            }
    
            const body = JSON.parse(response.body);
            const banks = body.data.map(bank => ({
                bank_name: bank.name,
                bank_code: bank.code
            }));
    
            res.json({
                count: banks.length,
                banks
            });
        });
    },

    usesAxios: (req, res) => {
        axios.get(url, )
            .then(response => {
                const body = response.data;
                const banks = body.data.map(bank => ({
                    bank_name: bank.name,
                    bank_code: bank.code
                }));
        
                res.json({
                    count: banks.length,
                    banks
                });
            }, error => {
                res.status(400);
                res.json({
                    message: error.message
                });
            });
    }
};

module.exports = externalRequest;