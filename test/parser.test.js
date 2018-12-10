
const parser = require('../parser');
const assert = require('assert');
const expect = require('chai').expect;

describe("Single HTML nodes.", () => {
    var input = '';
    it('[#0]: empty string', () => {
        let result = parser.parse('');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 0 nodes").to.have.lengthOf(0);
    });

    it("[#1]: 'a'", () => {
        let result = parser.parse('a');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 1 node").to.have.lengthOf(1);
        expect(result[0].type, "node type").to.equal(parser.nodeType.text);
        expect(result[0].content, "node content").to.equal('a');
    });

    it("[#1.1]: 'ab'", () => {
        let result = parser.parse('ab');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 1 node").to.have.lengthOf(1);
        expect(result[0].type, "node type").to.equal(parser.nodeType.text);
        expect(result[0].content, "node content").to.equal('ab');
    });

    it("[#1.2]: 'ab '", () => {
        let result = parser.parse('ab ');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 1 node").to.have.lengthOf(1);
        expect(result[0].type, "node type").to.equal(parser.nodeType.text);
        expect(result[0].content, "node content").to.equal('ab ');
    });

    it("[#1.3]: ' ab'", () => {
        let result = parser.parse(' ab');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 1 node").to.have.lengthOf(1);
        expect(result[0].type, "node type").to.equal(parser.nodeType.text);
        expect(result[0].content, "node content").to.equal(' ab');
    });

    it("[#1.4]: ' ab '", () => {
        let result = parser.parse(' ab ');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 1 node").to.have.lengthOf(1);
        expect(result[0].type, "node type").to.equal(parser.nodeType.text);
        expect(result[0].content, "node content").to.equal(' ab ');
    });

    it("[#1.5]: ' '", () => {
        let result = parser.parse(' ');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 1 node").to.have.lengthOf(1);
        expect(result[0].type, "node type").to.equal(parser.nodeType.text);
        expect(result[0].content, "node content").to.equal(' ');
    });

    it("[#2]: '<a>'", () => {
        let result = parser.parse('<a>');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 1 node").to.have.lengthOf(1);
        expect(result[0].type, "node type").to.equal(parser.nodeType.tag);
        expect(result[0].content, "node content").to.equal('<a>');
    });

    it("[#2.1]: '<ab>'", () => {
        let result = parser.parse('<ab>');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 1 node").to.have.lengthOf(1);
        expect(result[0].type, "node type").to.equal(parser.nodeType.tag);
        expect(result[0].content, "node content").to.equal('<ab>');
    });

    it("[#3]: '<'", () => {
        let result = () => parser.parse('<');
        expect(result, "throws error").to.throw("'tag name' expected at line 1 pos 2.");
    });

    it("[#3.1]: '< '", () => {
        let result = () => parser.parse('< ');
        expect(result, "throws error").to.throw("'tag name' expected at line 1 pos 2.");
    });

    it("[#3.3]: '<a'", () => {
        let result = () => parser.parse('<a');
        expect(result, "throws error").to.throw("'>' expected at line 1 pos 3.");
    });

    it("[#4]: '<a/>'", () => {
        let result = parser.parse('<a/>');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 1 node").to.have.lengthOf(1);
        expect(result[0].type, "node type").to.equal(parser.nodeType.tag);
        expect(result[0].content, "node content").to.equal('<a/>');
        expect(result[0].isVoid, "self closing tag").to.equal(true);
    });

    it("[#4.1]: '<a />'", () => {
        let result = parser.parse('<a />');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 1 node").to.have.lengthOf(1);
        expect(result[0].type, "node type").to.equal(parser.nodeType.tag);
        expect(result[0].content, "node content").to.equal('<a />');
        expect(result[0].isVoid, "self closing tag").to.equal(true);
    });

    it("[#5]: '<a/ >'", () => {
        let result = () => parser.parse('<a/ >');
        expect(result, "throws error").to.throw("'>' expected at line 1 pos 4.");
    });

    it("[#5.1]: '<a /'", () => {
        let result = () => parser.parse('<a /');
        expect(result, "throws error").to.throw("'>' expected at line 1 pos 5.");
    });

    it("[#5.2]: '<a / >'", () => {
        let result = () => parser.parse('<a / >');
        expect(result, "throws error").to.throw("'>' expected at line 1 pos 5.");
    });

    it("[#6]: '<a/>b'", () => {
        let result = parser.parse('<a/>b');
        expect(result, "result exists").to.exist;
        expect(result, "result contains 2 node").to.have.lengthOf(2);
        expectNode(result[0], {
            type: parser.nodeType.tag,
            tagName: 'a',
            content: '<a/>',
            isVoid: true
        });
        expectNode(result[1], {
            type: parser.nodeType.text,
            content: 'b'
        });
    });

    {
        let test6_1 = 'b<a/>';
        it("[#6.1]: " + test6_1, () => {
            let result = parser.parse(test6_1);
            expect(result, "result exists").to.exist;
            expect(result, "result contains 2 node").to.have.lengthOf(2);
            expectNode(result[0], {
                type: parser.nodeType.text,
                content: 'b'
            });
            expectNode(result[1], {
                type: parser.nodeType.tag,
                tagName: 'a',
                content: '<a/>',
                isVoid: true
            });
        });
    }

    {
        let test6_2 = 'b<a/>c';
        it("[#6.1]: " + test6_2, () => {
            let result = parser.parse(test6_2);
            expect(result, "result exists").to.exist;
            expect(result, "result contains 3 node").to.have.lengthOf(3);
            expectNode(result[0], {
                type: parser.nodeType.text,
                content: 'b'
            });
            expectNode(result[1], {
                type: parser.nodeType.tag,
                tagName: 'a',
                content: '<a/>',
                isVoid: true
            });
            expectNode(result[2], {
                type: parser.nodeType.text,
                content: 'c'
            });
        });
    }

});

function expectNode(node, check) {
    for (var key in check) {
        let prop = check[key];
        expect(node[key], "node " + key).to.equal(prop);
    }

    // expect(node.type, "node type").to.equal(args.type);
    // expect(node.tagName, "tag name").to.equal(args.tagName);
    // expect(node.content, "node content").to.equal(args.content);
    // expect(node.isVoid, "self closing tag").to.equal(args.isVoid);
}