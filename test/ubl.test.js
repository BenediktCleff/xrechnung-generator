const {escapeXML, generateUBLInvoiceXML} = require('../src/ubl')

describe('escapeXML', () => {
    it('should return an empty string when input is null or undefined', () => {
        expect(escapeXML(null)).toBe('');
        expect(escapeXML(undefined)).toBe('');
    });

    it('should escape ampersands (&) to &amp;', () => {
        expect(escapeXML('&')).toBe('&amp;');
        expect(escapeXML('Hello & Goodbye')).toBe('Hello &amp; Goodbye');
    });

    it('should escape less-than signs (<) to &lt;', () => {
        expect(escapeXML('<')).toBe('&lt;');
        expect(escapeXML('<tag>')).toBe('&lt;tag&gt;');
    });

    it('should escape greater-than signs (>) to &gt;', () => {
        expect(escapeXML('>')).toBe('&gt;');
        expect(escapeXML('value > 10')).toBe('value &gt; 10');
    });

    it('should escape double quotes (\") to &quot;', () => {
        expect(escapeXML('"')).toBe('&quot;');
        expect(escapeXML('He said "Hello"')).toBe('He said &quot;Hello&quot;');
    });

    it('should escape single quotes (\') to &apos;', () => {
        expect(escapeXML("'")).toBe('&apos;');
        expect(escapeXML("It's a test")).toBe('It&apos;s a test');
    });

    it('should escape multiple special characters in the correct order', () => {
        const input = `& < > " '`;
        const expectedOutput = `&amp; &lt; &gt; &quot; &apos;`;
        expect(escapeXML(input)).toBe(expectedOutput);
    });

    it('should handle strings without special characters unchanged', () => {
        expect(escapeXML('simple string')).toBe('simple string');
        expect(escapeXML('1234567980')).toBe('1234567980');
        expect(escapeXML('')).toBe('');
    });
});

describe('generateUBLInvoiceXML', () => {
    it('should generate a valid XML string for a complete invoice', () => {
        const invoice = {
            id: 'INV-001',
            issueDate: '2024-01-01',
            dueDate: '2024-01-15',
            currency: 'EUR',
            supplier: {
                name: 'Supplier Inc.',
                street: 'Main Street 1',
                city: 'Berlin',
                postalCode: '10115',
                country: 'DE',
            },
            customer: {
                name: 'Customer Ltd.',
                street: 'Customer Road 5',
                city: 'Hamburg',
                postalCode: '20095',
                country: 'DE',
            },
            taxTotal: {
                taxAmount: 19,
                taxPercentage: 19,
            },
            lineItems: [
                {
                    id: 'ITEM-001',
                    description: 'Product A',
                    quantity: 2,
                    unitPrice: 50,
                    lineTotal: 100,
                },
            ],
        };

        const xmlResult = generateUBLInvoiceXML(invoice);

        expect(xmlResult).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(xmlResult).toContain('<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"');
        expect(xmlResult).toContain('<cbc:ID>INV-001</cbc:ID>');
        expect(xmlResult).toContain('<cbc:IssueDate>2024-01-01</cbc:IssueDate>');
        expect(xmlResult).toContain('<cbc:DueDate>2024-01-15</cbc:DueDate>');
        expect(xmlResult).toContain('<cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>');
        expect(xmlResult).toContain('<cbc:Name>Supplier Inc.</cbc:Name>');
        expect(xmlResult).toContain('<cbc:StreetName>Main Street 1</cbc:StreetName>');
        expect(xmlResult).toContain('<cbc:CityName>Berlin</cbc:CityName>');
        expect(xmlResult).toContain('<cbc:PostalZone>10115</cbc:PostalZone>');
        expect(xmlResult).toContain('<cbc:IdentificationCode>DE</cbc:IdentificationCode>');
        expect(xmlResult).toContain('<cbc:Name>Customer Ltd.</cbc:Name>');
        expect(xmlResult).toContain('<cbc:StreetName>Customer Road 5</cbc:StreetName>');
        expect(xmlResult).toContain('<cbc:CityName>Hamburg</cbc:CityName>');
        expect(xmlResult).toContain('<cbc:PostalZone>20095</cbc:PostalZone>');
        expect(xmlResult).toContain('<cbc:IdentificationCode>DE</cbc:IdentificationCode>');
        expect(xmlResult).toContain('<cbc:TaxAmount>19.00</cbc:TaxAmount>');
        expect(xmlResult).toContain('<cbc:Percent>19.00</cbc:Percent>');
        expect(xmlResult).toContain('<cbc:ID>ITEM-001</cbc:ID>');
        expect(xmlResult).toContain('<cbc:Description>Product A</cbc:Description>');
        expect(xmlResult).toContain('<cbc:InvoicedQuantity>2.00</cbc:InvoicedQuantity>');
        expect(xmlResult).toContain('<cbc:LineExtensionAmount>100.00</cbc:LineExtensionAmount>');
    });

    it('should handle optional fields correctly', () => {
        const invoice = {
            id: 'INV-002',
            issueDate: '2024-02-01',
            currency: 'USD',
            supplier: {
                name: 'Supplier Ltd.',
                country: 'US',
            },
            customer: {
                name: 'Customer Corp.',
                country: 'US',
            },
            taxTotal: {
                taxAmount: 0,
                taxPercentage: 0,
            },
            lineItems: [
                {
                    id: 'ITEM-002',
                    description: 'Service B',
                    quantity: 1,
                    unitPrice: 100,
                    lineTotal: 100,
                },
            ],
        };

        const xmlResult = generateUBLInvoiceXML(invoice);

        expect(xmlResult).toContain('<cbc:ID>INV-002</cbc:ID>');
        expect(xmlResult).toContain('<cbc:IssueDate>2024-02-01</cbc:IssueDate>');
        expect(xmlResult).not.toContain('<cbc:DueDate>'); // DueDate is optional
        expect(xmlResult).toContain('<cbc:DocumentCurrencyCode>USD</cbc:DocumentCurrencyCode>');
        expect(xmlResult).toContain('<cbc:Name>Supplier Ltd.</cbc:Name>');
        expect(xmlResult).toContain('<cbc:IdentificationCode>US</cbc:IdentificationCode>');
        expect(xmlResult).toContain('<cbc:Name>Customer Corp.</cbc:Name>');
        expect(xmlResult).toContain('<cbc:TaxAmount>0.00</cbc:TaxAmount>');
        expect(xmlResult).toContain('<cbc:Percent>0.00</cbc:Percent>');
        expect(xmlResult).toContain('<cbc:ID>ITEM-002</cbc:ID>');
        expect(xmlResult).toContain('<cbc:Description>Service B</cbc:Description>');
        expect(xmlResult).toContain('<cbc:InvoicedQuantity>1.00</cbc:InvoicedQuantity>');
        expect(xmlResult).toContain('<cbc:LineExtensionAmount>100.00</cbc:LineExtensionAmount>');
    });

    it('should handle missing supplier or customer fields gracefully', () => {
        const invoice = {
            id: 'INV-003',
            issueDate: '2024-03-01',
            currency: 'EUR',
            supplier: { name: 'Incomplete Supplier' },
            customer: { name: 'Incomplete Customer' },
            taxTotal: {
                taxAmount: 50,
                taxPercentage: 20,
            },
            lineItems: [
                {
                    id: 'ITEM-003',
                    description: 'Consulting Service',
                    quantity: 2,
                    unitPrice: 100,
                    lineTotal: 200,
                },
            ],
        };

        const xmlResult = generateUBLInvoiceXML(invoice);

        expect(xmlResult).toContain('<cbc:Name>Incomplete Supplier</cbc:Name>');
        expect(xmlResult).not.toContain('<cbc:StreetName>'); // street is missing
        expect(xmlResult).not.toContain('<cbc:CityName>'); // city is missing
        expect(xmlResult).not.toContain('<cbc:PostalZone>'); // postalCode is missing
        expect(xmlResult).toContain('<cbc:Name>Incomplete Customer</cbc:Name>');
        expect(xmlResult).not.toContain('<cbc:StreetName>'); // street is missing
        expect(xmlResult).not.toContain('<cbc:CityName>'); // city is missing
        expect(xmlResult).not.toContain('<cbc:PostalZone>'); // postalCode is missing
    });

    it('should generate XML with multiple line items', () => {
        const invoice = {
            id: 'INV-004',
            issueDate: '2024-03-20',
            currency: 'GBP',
            supplier: {
                name: 'Supplier A',
                country: 'GB',
            },
            customer: {
                name: 'Customer A',
                country: 'GB',
            },
            taxTotal: {
                taxAmount: 10,
                taxPercentage: 10,
            },
            lineItems: [
                {
                    id: 'ITEM-001',
                    description: 'Item 1',
                    quantity: 1,
                    unitPrice: 10,
                    lineTotal: 10,
                },
                {
                    id: 'ITEM-002',
                    description: 'Item 2',
                    quantity: 2,
                    unitPrice: 20,
                    lineTotal: 40,
                },
            ],
        };

        const xmlResult = generateUBLInvoiceXML(invoice);

        expect(xmlResult).toContain('<cbc:ID>ITEM-001</cbc:ID>');
        expect(xmlResult).toContain('<cbc:Description>Item 1</cbc:Description>');
        expect(xmlResult).toContain('<cbc:InvoicedQuantity>1.00</cbc:InvoicedQuantity>');
        expect(xmlResult).toContain('<cbc:LineExtensionAmount>10.00</cbc:LineExtensionAmount>');

        expect(xmlResult).toContain('<cbc:ID>ITEM-002</cbc:ID>');
        expect(xmlResult).toContain('<cbc:Description>Item 2</cbc:Description>');
        expect(xmlResult).toContain('<cbc:InvoicedQuantity>2.00</cbc:InvoicedQuantity>');
        expect(xmlResult).toContain('<cbc:LineExtensionAmount>40.00</cbc:LineExtensionAmount>');
    });
});
