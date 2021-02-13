import * as Database from "./Database";
import * as querystring from 'querystring';
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
var http = require('http');

console.log("Server starting");

let port: number = parseInt(process.env.PORT);
if (port == undefined || !(port > 0 && port <= 65536))
    port = 8100;

let server = http.createServer();
server.addListener("listening", handleListen);
server.addListener("request", handleRequest);
server.listen(port);

function handleListen(): void {
    console.log("Listening on port: " + port);
}

interface ParameterPair {
    name: string;
    value: string;
}

class Parameters {
    parameterPairs: ParameterPair[] = [];

    push(_pair: ParameterPair) {
        this.parameterPairs.push(_pair);
    }

    getValue(name: string): string {
        var sub: ParameterPair[] = this.parameterPairs.filter((_v: ParameterPair) => _v.name == name);
        if (sub?.length >= 1) {
            return sub[0]?.value;
        }
        return null;
    }
}

function handleRequest(_request: IncomingMessage, _response: ServerResponse): void {
    console.log("Request received");

    var query: querystring.ParsedUrlQuery = querystring.parse(_request.url);
    var command: string = <string>query["command"];

    var parts: string[] = _request.url.split('?');
    if (parts?.length < 2) {
        respond(_response, "Invalid query");
        return;
    }

    var parameters: Parameters = new Parameters();
    var dataPart = parts[1];
    var pairs = dataPart.split('&');
    pairs.forEach((_pair: string) => {
        var temp: string[] = _pair.split('=');
        var pair: ParameterPair = {
            name: temp[0],
            value: decodeURIComponent(temp[1])
        };
        parameters.push(pair);
    });

    var command: string = parameters.getValue("command");

    switch (command) {
        case "insert":
            let fireworkDefinition: FireworkDefinition = {
                name: parameters.getValue("name"),
                headColor: parameters.getValue("headColor"),
                tailColor: parameters.getValue("tailColor"),
                innerExplosionColor: parameters.getValue("innerExplosionColor"),
                innerExplosionRadius: parseInt(parameters.getValue("innerExplosionRadius")),
                outerExplosionColor: parameters.getValue("outerExplosionColor"),
                outerExplosionRadius: parseInt(parameters.getValue("outerExplosionRadius")),
                duration: parseInt(parameters.getValue("duration"))
            };
            Database.insert(fireworkDefinition);
            respond(_response, "storing data");
            break;
        case "refresh":
            Database.findAll(findCallback);
            break;
        default:
            respond(_response, "unknown command: " + command);
            break;
    }

    // findCallback is an inner function so that _response is in scope
    function findCallback(json: string): void {
        respond(_response, json);
    }
}

function respond(_response: ServerResponse, _text: string): void {
    //console.log("Preparing response: " + _text);
    _response.setHeader("Access-Control-Allow-Origin", "*");
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.write(_text);
    _response.end();
}