const employees = [
    {
        first_name: "Patrick",
        last_name: "Foh"
    },
    {
        first_name: "Temitayo",
        last_name: "Kara"
    }
]
const requestHandler = (request, response) => {
    // This is where the magic happens
    const { method, url, headers, httpVersion, body } = request;
    console.log(`HTTP Method is: ${method}`);
    console.log(`Path is: ${url}`)
    console.log(headers);
    console.log(`HTTP Request Version is: ${httpVersion}`);

    if (
        request.method === 'POST' && 
        request.headers['content-type'] === 'application/json' && 
        request.url === '/employees'
    ) {
        let body = '';
        request
            .on('data', chunk => {
                body += chunk.toString();
            })
            .on('end', () => {
                body = JSON.parse(body);
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');

                const responseBody = { headers, method, url, body };

                response.write(JSON.stringify(responseBody));
                response.end();
            });
    }
    else if (
        request.method === 'GET' &&
        request.url === '/employees'
        ) {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');

            response.write(JSON.stringify(employees));
            response.end();
    } else {
        response.end();
    }
}

module.exports = requestHandler;
