
const path = require('path');
//global.__appRoot = path.resolve(__dirname);
require("./helpers/pathHelper.js")(__dirname);
const ParserError = require("./ParserError");
const er = require("./parser.errors");

const nodeTypes = { text: 0, tag: 1 }
const tagTypes = { opening: 0, closing: 1, void: 2, paired: 3 }
const voidTagNames = "area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr".toLowerCase().split("|").map(s => s.trim());

module.exports = {
    parse,
    nodeTypes,
    tagTypes
}

function parse(html) {
    init(html);
    parseDocument();
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
function parseDocument(parent) {
    while (_ch) {
        parseNode(parent);
    }
}

// <node> = <tag>|<text>
function parseNode(parent) {
    if (_ch === '<')
        return parseHtmlBlock(parent);

    parseText(parent);
}

// <tag> = '<' + tagName[space]*[/]*'>[<html>]*[</tag>]*' //<openTag>[<html>]*<closeTag>|<self-close-tag>
function parseHtmlBlock(parent) {
    let tag = parseTag();

    if (tag.tagType === tagTypes.closing) {
        if (parent && parent.tagName === tag.tagName) {
            // [^0] this is the closing tag of the upper level block (mustn't be put into the list)
            parent.endHtml = tag.tagName;
            parent.tagType = tagTypes.paired;
            return;
        }
        missingMatchingStartTag(tag);
    }

    // this is the current level (void or opening) tag
    tag.parent = parent;
    _nodes.push(tag); // put into this level

    if (tag.tagType === tagTypes.void) // just one tag on this level
        return;

    // it is `tag.opening`, prepare going down to the next level, create child-nodes
    let nodes = _nodes;
    _nodes = [];
    parseDocument(tag); // possibly returns from [^0] to this level
    tag.children = _nodes; // save the deeper level nodes as children of the current open tag and restore the node list
    _nodes = nodes;

    if (tag.tagType !== tagTypes.paired)
        missingMatchingEndTag(tag);
}

// tag := < + [/]* + name + spaces + [/]* + >
function parseTag() {
    match('<');
    var node = new HtmlNode(nodeTypes.tag, _ch);
    readChar();

    if (_ch === '/') {
        node.tagType = tagTypes.closing
        node.startHtml += _ch;
        readChar();
    }

    parseTagName(node);
    parseSpace(node);

    if (node.tagType !== tagTypes.closing) {
        if (_ch === '/') {
            node.tagType = tagTypes.void; // https://www.w3.org/TR/html5/syntax.html#void-elements
            node.startHtml += _ch;
            readChar();
        } 
        else if (voidTagNames.includes(node.tagName.toLowerCase())){
            node.tagType = tagTypes.void;
        }
        else {
            node.tagType = tagTypes.opening;
        }
    }

    match('>');
    node.startHtml += _ch;
    readChar();

    // if (node.startHtml)
    //     _nodes.push(node);
    return node;
}



// <tagName> = <char>[<char>]*
function parseTagName(node) {
    matchAlpha('tag name');
    let tagName = '';

    while (!end() && isNameChar(_ch)) {
        node.startHtml += _ch;
        tagName += _ch;
        readChar();
    }

    node.tagName = tagName.toLowerCase();
}

// <text> = [<char>]*;
function parseText(parent) {
    var node = new HtmlNode(nodeTypes.text, '');
    node.parent = parent;

    while (!end() && _ch != '<') {
        node.startHtml += _ch;
        readChar();
    }

    if (node.startHtml)
        _nodes.push(node);
}

function parseSpace(node) {
    while (!end() && isLineSpace(_ch)) {
        node.startHtml += _ch;
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

function missingMatchingStartTag(tag) {
    return onError(er.missingMatchingStartTag(tag.startHtml, _line + 1, _pos - tag.startHtml.length));
}

function missingMatchingEndTag(tag){
    return onError(er.missingMatchingEndTag(tag.startHtml, _line + 1, _pos - tag.startHtml.length));
}

function onError(message, capture) {
    printError(message);
    capture = capture || onError;
    throw new ParserError({ message, capture });
}

function printError(err) {
    console.error(err);
}

class HtmlNode {
    constructor(type, html) {
        this.type = type;
        this.startHtml = html;
    }
}

function isAlpha(c) {
    if (!c)
        return false;

    c = c.toUpperCase();
    return (c >= 'A' && c <= 'Z');
}

function lastNode() {
    if (!_nodes.length)
        return;

    return _nodes[_nodes.length - 1];
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
