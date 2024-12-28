const fs = require('fs').promises;
const { Writable } = require('stream');
const XRechnungGenerator = require('../src/xrechnung-generator');
const validateInvoice = require('../src/validation');
const { generateUBLInvoiceXML } = require('../src/ubl');

jest.mock('../src/validation');
jest.mock('../src/ubl');
jest.mock('fs', () => ({
    promises: {
        writeFile: jest.fn(),
    },
}));

describe('XRechnungGenerator', () => {
    const mockInvoice = {
        id: 'INV-001',
        issueDate: '2024-01-01',
        currency: 'EUR',
        supplier: { name: 'Supplier Ltd.', country: 'DE' },
        customer: { name: 'Customer Ltd.', country: 'DE' },
        taxTotal: { taxAmount: 19, taxPercentage: 19 },
        lineItems: [
            {
                id: 'ITEM-001',
                description: 'Product A',
                quantity: 1,
                unitPrice: 100,
                lineTotal: 100,
            },
        ],
    };

    const mockXML = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"></Invoice>`;

    beforeEach(() => {
        validateInvoice.mockClear();
        generateUBLInvoiceXML.mockClear();
        validateInvoice.mockImplementation(() => true);
        generateUBLInvoiceXML.mockImplementation(() => mockXML);
    });

    describe('constructor', () => {
        it('should validate the invoice upon creation', () => {
            new XRechnungGenerator(mockInvoice);

            expect(validateInvoice).toHaveBeenCalledWith(mockInvoice);
        });

        it('should generate XML from the invoice', () => {
            new XRechnungGenerator(mockInvoice);

            expect(generateUBLInvoiceXML).toHaveBeenCalledWith(mockInvoice);
        });
    });

    describe('toXMLString', () => {
        it('should return the generated XML string', () => {
            const generator = new XRechnungGenerator(mockInvoice);

            expect(generator.toXMLString()).toBe(mockXML);
        });
    });

    describe('toBuffer', () => {
        it('should return the XML string as a buffer', () => {
            const generator = new XRechnungGenerator(mockInvoice);

            const buffer = generator.toBuffer();

            expect(buffer).toBeInstanceOf(Buffer);
            expect(buffer.toString('utf8')).toBe(mockXML);
        });
    });

    describe('toBlob', () => {
        it('should return the XML string as a Blob', () => {
            global.Blob = jest.fn().mockImplementation((content, options) => ({
                content,
                options,
            }));

            const generator = new XRechnungGenerator(mockInvoice);
            const blob = generator.toBlob();

            expect(global.Blob).toHaveBeenCalledWith([mockXML], { type: 'application/xml;charset=utf-8;' });
            expect(blob.content[0]).toBe(mockXML);
        });
    });

    describe('writeFile', () => {
        it('should write the XML string to the specified file path using fs.writeFile', async () => {
            const generator = new XRechnungGenerator(mockInvoice);

            await generator.writeFile('/path/to/output.xml');

            expect(fs.writeFile).toHaveBeenCalledWith('/path/to/output.xml', mockXML, 'utf8');
        });

        it('should propagate errors from fs.writeFile', async () => {
            fs.writeFile.mockRejectedValueOnce(new Error('File system error'));

            const generator = new XRechnungGenerator(mockInvoice);

            await expect(generator.writeFile('/path/to/output.xml')).rejects.toThrow('File system error');
        });
    });
});
