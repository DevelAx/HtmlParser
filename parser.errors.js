

module.exports = {
    charExpected(ch, line, pos){
        return `'${ch}' expected at line ${line} pos ${pos}.`;
    },

    missingMatchingStartTag(tag, line, pos) {
        return `'${tag}' tag at line ${line} pos ${pos} is missing matching start tag.`;
    },

    missingMatchingEndTag(tag, line, pos) {
        return `'${tag}' tag at line ${line} pos ${pos} is missing matching end tag.`;
    }
}