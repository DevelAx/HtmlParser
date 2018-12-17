
const parser = require('../parser');
const assert = require('assert');
const expect = require('chai').expect;

describe("Single HTML nodes.", () => {

    function singleTextNode(testNum, text) {
        let len = text ? 1 : 0;
        it(`[#${testNum}]: ${text}`, () => {
            let root = parser.parse(text);
            expect(root, "root").to.exist;
            expect(root.children, "children").to.exist;
            expect(root.children.length, "children.length").to.equal(len);
            expect(root.innerHTML(), "document.innerHTML").to.equal(text);

            if (root.children.length) {
                let child = root.children[0];
                expect(child.type, "node type").to.equal(parser.nodeTypes.text);
                expect(child.startHtml, "startHtml").to.equal(text);
                expect(child.outerHTML(), "node.outerHTML").to.equal(text);
                expect(child.innerHTML(), "node.innerHTML").to.equal('');
            }
        });
    }

    singleTextNode('0', '');
    singleTextNode('1', 'a');
    singleTextNode('1.1', 'ab');
    singleTextNode('1.2', 'ab ');
    singleTextNode('1.3', ' ab');
    singleTextNode('1.4', ' ab ');
    singleTextNode('1.5', ' ');

    function tagError(num, tag, error) {
        it(`[#${num}]: ${tag}`, () => {
            let result = () => parser.parse(tag);
            expect(result, "error").to.throw(error);
        });
    }

    tagError("2", '<a>', `'<a>' tag at line 1 pos 1 is missing matching end tag.`);
    tagError("2.1", '<ab>', `'<ab>' tag at line 1 pos 1 is missing matching end tag.`);

    function voidTag(n, tag) {
        it(`[#${n}]: ${tag}`, () => {
            let root = parser.parse(tag);
            expect(root, "result exists").to.exist;
            expect(root.children, "children").to.exist;
            expect(root.children.length, "children.length").to.equal(1);
            expect(root.innerHTML(), "document.innerHTML").to.equal(tag);
            let child = root.children[0];
            expect(child.type, "node type").to.equal(parser.nodeTypes.tag);
            expect(child.tagType, "tag type").to.equal(parser.tagTypes.void);
            expect(child.startHtml, "startHtml").to.equal(tag);
            expect(child.outerHTML(), "node.outerHTML").to.equal(tag);
            expect(child.innerHTML(), "node.innerHTML").to.equal('');
        });
    }

    voidTag("2.2", '<br>');
    voidTag("2.3", '<a/>');
    voidTag("2.4", '<a />');

    tagError("3", '<', "'tag name' expected at line 1 pos 2.");
    tagError("3.1", '< ', "'tag name' expected at line 1 pos 2.");
    tagError("3.2", '<a', "'>' expected at line 1 pos 3.");
    tagError("3.3", '<a/ >', "'>' expected at line 1 pos 4.");
    tagError("3.4", '<a /', "'>' expected at line 1 pos 5.");
    tagError("3.5", '<a / >', "'>' expected at line 1 pos 5.");

    {
        let html = '<a/>b';
        it(`[#6]: ${html}`, () => {
            let root = parser.parse(html);
            expect(root, "result exists").to.exist;
            expect(root.children, "children").to.exist;
            expect(root.children.length, "children.length").to.equal(2);
            expect(root.innerHTML(), "document.innerHTML").to.equal(html);
            let tag = root.children[0];
            expect(tag.type, "node type").to.equal(parser.nodeTypes.tag);
            expect(tag.tagType, "tag type").to.equal(parser.tagTypes.void);
            expect(tag.startHtml, "startHtml").to.equal('<a/>');
            expect(tag.outerHTML(), "node.outerHTML").to.equal('<a/>');
            expect(tag.innerHTML(), "node.innerHTML").to.equal('');
            let text = root.children[1];
            expect(text.type, "node type").to.equal(parser.nodeTypes.text);
            expect(text.tagType, "tag type").not.to.exist;
            expect(text.startHtml, "startHtml").to.equal('b');
            expect(text.outerHTML(), "node.outerHTML").to.equal('b');
            expect(text.innerHTML(), "node.innerHTML").to.equal('');
        });
    }

    {
        let html = 'b<a/>';
        it(`[#6.1]: ${html}`, () => {
            let root = parser.parse(html);
            expect(root, "result exists").to.exist;
            expect(root.children, "children").to.exist;
            expect(root.children.length, "children.length").to.equal(2);
            expect(root.innerHTML(), "document.innerHTML").to.equal(html);
            let tag = root.children[1];
            expect(tag.type, "node type").to.equal(parser.nodeTypes.tag);
            expect(tag.tagType, "tag type").to.equal(parser.tagTypes.void);
            expect(tag.startHtml, "startHtml").to.equal('<a/>');
            expect(tag.outerHTML(), "node.outerHTML").to.equal('<a/>');
            expect(tag.innerHTML(), "node.innerHTML").to.equal('');
            let text = root.children[0];
            expect(text.type, "node type").to.equal(parser.nodeTypes.text);
            expect(text.tagType, "tag type").not.to.exist;
            expect(text.startHtml, "startHtml").to.equal('b');
            expect(text.outerHTML(), "node.outerHTML").to.equal('b');
            expect(text.innerHTML(), "node.innerHTML").to.equal('');
        });
    }

    {
        let html = 'b<a/>c';
        it(`[#6.2]: ${html}`, () => {
            let root = parser.parse(html);
            expect(root, "result exists").to.exist;
            expect(root.children, "children").to.exist;
            expect(root.children.length, "children.length").to.equal(3);
            expect(root.innerHTML(), "document.innerHTML").to.equal(html);
            let tag = root.children[1];
            expect(tag.type, "node type").to.equal(parser.nodeTypes.tag);
            expect(tag.tagType, "tag type").to.equal(parser.tagTypes.void);
            expect(tag.startHtml, "startHtml").to.equal('<a/>');
            expect(tag.outerHTML(), "node.outerHTML").to.equal('<a/>');
            expect(tag.innerHTML(), "node.innerHTML").to.equal('');
            let text = root.children[0];
            expect(text.type, "node type").to.equal(parser.nodeTypes.text);
            expect(text.tagType, "tag type").not.to.exist;
            expect(text.startHtml, "startHtml").to.equal('b');
            expect(text.outerHTML(), "node.outerHTML").to.equal('b');
            expect(text.innerHTML(), "node.innerHTML").to.equal('');
            text = root.children[2];
            expect(text.type, "node type").to.equal(parser.nodeTypes.text);
            expect(text.tagType, "tag type").not.to.exist;
            expect(text.startHtml, "startHtml").to.equal('c');
            expect(text.outerHTML(), "node.outerHTML").to.equal('c');
            expect(text.innerHTML(), "node.innerHTML").to.equal('');
        });
    }

    {
        let html = '<a>c</a>';
        it(`[#7]: ${html}`, () => {
            let root = parser.parse(html);
            expect(root, "result exists").to.exist;
            expect(root.children, "children").to.exist;
            expect(root.children.length, "children.length").to.equal(1);
            expect(root.innerHTML(), "document.innerHTML").to.equal(html);
            let tag = root.children[0];
            expect(tag.parent, "parent").not.to.exist;
            expect(tag.type, "node type").to.equal(parser.nodeTypes.tag);
            expect(tag.tagType, "tag type").to.equal(parser.tagTypes.paired);
            expect(tag.startHtml, "startHtml").to.equal('<a>');
            expect(tag.endHtml, "endHtml").to.equal('</a>');
            expect(tag.outerHTML(), "node.outerHTML").to.equal(html);
            expect(tag.innerHTML(), "node.innerHTML").to.equal('c');
            expect(tag.children, "children").to.exist;
            expect(tag.children.length, "children.length").to.equal(1);
            let node = tag.children[0];
            expect(node.parent, "parent").to.exist;
            expect(node.parent.startHtml, "startHtml").to.equal('<a>');
            expect(node.parent.endHtml, "endHtml").to.equal('</a>');
            expect(node.type, "node type").to.equal(parser.nodeTypes.text);
            expect(node.tagType, "tag type").not.to.exist;
            expect(node.startHtml, "startHtml").to.equal('c');
            expect(node.outerHTML(), "node.outerHTML").to.equal('c');
            expect(node.innerHTML(), "node.innerHTML").to.equal('');
        });
    }

    {
        let html = '<a><c/></a>';
        it(`[#7.1]: ${html}`, () => {
            let root = parser.parse(html);
            expect(root, "result exists").to.exist;
            expect(root.children, "children").to.exist;
            expect(root.children.length, "children.length").to.equal(1);
            expect(root.innerHTML(), "document.innerHTML").to.equal(html);
            let tag = root.children[0];
            expect(tag.parent, "parent").not.to.exist;
            expect(tag.type, "node type").to.equal(parser.nodeTypes.tag);
            expect(tag.tagType, "tag type").to.equal(parser.tagTypes.paired);
            expect(tag.startHtml, "startHtml").to.equal('<a>');
            expect(tag.endHtml, "endHtml").to.equal('</a>');
            expect(tag.outerHTML(), "tag.outerHTML").to.equal(html);
            expect(tag.innerHTML(), "tag.innerHTML").to.equal('<c/>');
            expect(tag.children, "children").to.exist;
            expect(tag.children.length, "children.length").to.equal(1);
            let tag2 = tag.children[0];
            expect(tag2.parent, "parent").to.exist;
            expect(tag2.parent.startHtml, "startHtml").to.equal('<a>');
            expect(tag2.parent.endHtml, "endHtml").to.equal('</a>');
            expect(tag2.type, "tag2 type").to.equal(parser.nodeTypes.tag);
            expect(tag2.tagType, "tag type").to.equal(parser.tagTypes.void);
            expect(tag2.startHtml, "startHtml").to.equal('<c/>');
            expect(tag2.outerHTML(), "tag2.outerHTML").to.equal('<c/>');
            expect(tag2.innerHTML(), "tag2.innerHTML").to.equal('');
        });

    }

    tagError("7.2", '</a>', `'</a>' tag at line 1 pos 1 is missing matching start tag.`);
    tagError("7.3", '<a></c></a>', `'</c>' tag at line 1 pos 4 is missing matching start tag.`);

    {
        let test = `
<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
</head>
<body>

<h1>This is a Heading</h1>
<p>This is a paragraph.</p>

</body>
</html>`;
        it("[#10]: " + test, () => {
            let root = parser.parse(test);
            expect(root, "result exists").to.exist;
            expect(root.outerHTML(), "reverse HTML").to.equal(test);
        });
    }

    {
        let html = `
<html>
<!DOCTYPE html>
<head>
<title>Page Title</title>
</head>
<body>

<h1>This is a Heading</h1>
<p>This is a paragraph.</p>

</body>
</html>`;
        tagError("10.1", html, `Stray doctype at line 3 pos 1. '<!DOCTYPE html>' tag must be placed in the beginning before any tags.`);
    }
});

function expectNode(node, check) {
    for (var key in check) {
        let prop = check[key];
        expect(node[key], "node " + key).to.equal(prop);
    }
}