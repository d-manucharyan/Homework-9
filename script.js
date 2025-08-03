const http = require('http')
const path = require('path')
const { readFile } = require('./functions/readFile.js')
const { writeFile } = require('./functions/writeFile.js')

http.createServer(async (req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        const homePage = await readFile('pages', 'index.html')
        writeFile(200, 'text/html', homePage, res)
    } else if (req.url === '/api/users' && req.method === 'GET') {
        const users = await readFile('db', 'users.json')
        writeFile(200, 'application/json', users, res)
    } else if (req.url.match(/\/api\/users\/(\d+)/) && req.method === "GET") {
        const users = JSON.parse(await readFile('db', 'users.json'))
        const id = path.basename(req.url)
        const person = users.find(elm => elm.id == id)
        if (!person) {
            const errPage = await readFile('pages', 'error.html')
            writeFile(404, 'text/html', errPage, res)
        } else {
            writeFile(200, 'application/json', JSON.stringify(person), res)
        }

    } else if (req.url.match(/^\/api\/users\/\?_limit=(\d+)/) && req.method === "GET") {
        const users = JSON.parse(await readFile('db', 'users.json'))
        const arrQuery = path.basename(req.url).split('=')
        const id = +arrQuery[1]
        const limitedUsers = users.slice(0, id)
        writeFile(200, 'application/json', JSON.stringify(limitedUsers), res)
    } else {
        const errPage = await readFile('pages', 'error.html')
        writeFile(404, 'text/html', errPage, res)
    }
}).listen(3000, () => console.log('Server is running'))


