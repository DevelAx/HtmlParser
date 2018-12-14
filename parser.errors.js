

module.exports = {
    charExpected(ch, line, pos){
        return `'${ch}' expected at line ${line} pos ${pos}.`;
    },

    missingMatchingStartTag(tag, line, pos) {
        return `'${tag}' tag at line ${line} pos ${pos} is missing matching start tag.`;
    },

    missingMatchingEndTag(tag, line, pos) {
        return `'${tag}' tag at line ${line} pos ${pos} is missing matching end tag.`;
    },

    strayDoctype(tag, line, pos) {
        return `Stray doctype at line ${line} pos ${pos}. '${tag}' tag must be placed in the beginning before any tags.`;
    }
}