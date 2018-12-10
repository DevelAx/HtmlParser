
const path = require('path');
//global.__appRoot = path.resolve(__dirname);
require("./helpers/pathHelper.js")(__dirname);
const ParserError = require("./ParserError");
const er = require("./parser.errors");

const nodeType = { text: 0, tag: 1 }

module.exports = {
    parse,
    nodeType
}

function parse(html) {
    init(html);
    parseHtml();
    return _nodes;
}

//-------------CRADLE----------------
var _text, _ch, _pos, _line;
var _nodes;

function init(text) {
    _nodes = [];
    _text = text;
    _line = _pos = 0;
    readChar();
}

// <html> = [<node>]*
function parseHtml() {
    while (_ch) {
        parseNode();
    }
}

// <node> = <tag>|<text>
function parseNode() {
    if (_ch === '<')
        return parseTag();

    parseText();
}

// <tag> = '<' + <tagName>[space]*[/]*'>' //<openTag>[<html>]*<closeTag>|<self-close-tag>
function parseTag() {
    match('<');
    var node = new HtmlNode(nodeType.tag, _ch);
    readChar();
    parseTagName(node);
    parseSpace(node);

    if (_ch === '/'){
        node.content += _ch;
        readChar();
        node.isVoid = true; // https://www.w3.org/TR/html5/syntax.html#void-elements
    }

    match('>');
    node.content += _ch;
    readChar();

    if (node.content)
        _nodes.push(node);
}

// <tagName> = <char>[<char>]*
function parseTagName(node) {
    matchAlpha('tag name');
    let tagName = '';

    while (!end() && isNameChar(_ch)) {
        node.content += _ch;
        tagName += _ch;
        readChar();
    }

    node.tagName = tagName;
}

// <text> = [<char>]*;
function parseText() {
    var node = new HtmlNode(nodeType.text, '');

    while (!end() && _ch != '<') {
        node.content += _ch;
        readChar();
    }

    if (node.content)
        _nodes.push(node);
}

function parseSpace(node) {
    while (!end() && isLineSpace(_ch)) {
        node.content += _ch;
        readChar();
    }
}


// function newNode(ch) {
//     var node = new HtmlNode(nodeType.text, _ch);
//     _nodes.push(node);
//     return node;
// }

function end() {
    return (typeof _ch === 'undefined');
}

function readChar() {
    if (!_text)
        return;

    _ch = _text[_pos++];
}

function match(ch) {
    if (_ch !== ch)
        return onError(er.charExpected(ch, _line + 1, _pos));
}

function matchAlpha(name = "Alphabet letter") {
    if (!isAlpha(_ch))
        return onError(er.charExpected(name, _line + 1, _pos));
}

function onError(message, capture) {
    printError(message);
    capture = capture || onError;
    throw new ParserError({message, capture});
}

function printError(err) {
    console.error(err);
}

class HtmlNode {
    constructor(type, content) {
        this.type = type;
        this.content = content;
    }
}

function isAlpha(c) {
    if (!c)
        return false;

    c = c.toUpperCase();
    return (c >= 'A' && c <= 'Z');
}

function isNameChar(c) {
    if (c === '_')
        return true;

    return isAlpha(c);
}

function isSpace(c) {
    return isLineSpace(c) || c === '\r' || c === '\n';
}

function isLineSpace(c) {
    return c === ' ' || c === '\t';
}

