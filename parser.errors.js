

module.exports = {
    charExpected(ch, line, pos){
        return `'${ch}' expected at line ${line} pos ${pos}.`;
    }
}