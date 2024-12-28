/*!
 * xrechnung-generator
 * Copyright(c) 2024 Benedikt Cleff (info@pixelpal.io)
 * MIT Licensed
 */

const validateInvoice = require('./validation');
const { generateUBLInvoiceXML } = require('./ubl');

class XRechnungGenerator {
    _xmlString = '';

    constructor(invoice) {
        validateInvoice(invoice);
        this._xmlString = generateUBLInvoiceXML(invoice);
    }

    /**
     * Writes the XRechnung to a specified file.
     *
     * @param {string} path - The file path where the file should be written.
     * @return {Promise<void>}
     */
    writeFile(path) {
        const fs = require('fs').promises;
        return fs.writeFile(path, this._xmlString, 'utf8');
    }

    /**
     * Converts the XRechnung into a Blob object with the appropriate MIME type.
     * @return {Blob}
     */
    toBlob() {
        return new Blob([this._xmlString], { type: 'application/xml;charset=utf-8;' });
    }

    /**
     * Convert the XRechnung into a Buffer object using UTF-8 encoding.
     * @return {Buffer}
     */
    toBuffer() {
        return Buffer.from(this._xmlString, 'utf8');
    }

    /**
     * Convert the XRechnung into a XML string
     * @return {string}
     */
    toXMLString() {
        return this._xmlString;
    }
}

module.exports = XRechnungGenerator;
