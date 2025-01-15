/*!
 * xrechnung-generator
 * Copyright(c) 2024 Benedikt Cleff (info@pixelpal.io)
 * MIT Licensed
 */

function escapeXML(value) {
    if (!value) return '';
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function generateUBLInvoiceXML(invoice) {
    let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlString += `<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"\n`;
    xmlString += `         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"\n`;
    xmlString += `         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">\n`;

    // Root UBL Invoice element
    xmlString += `  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>\n`;
    xmlString += `  <cbc:CustomizationID>urn:cen.eu:en16931:2017</cbc:CustomizationID>\n`;
    xmlString += `  <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>\n`;
    xmlString += `  <cbc:ID>${escapeXML(invoice.id)}</cbc:ID>\n`;
    xmlString += `  <cbc:IssueDate>${escapeXML(invoice.issueDate)}</cbc:IssueDate>\n`;

    if (invoice.dueDate) {
        xmlString += `  <cbc:DueDate>${escapeXML(invoice.dueDate)}</cbc:DueDate>\n`;
    }

    xmlString += `  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>\n`;
    xmlString += `  <cbc:DocumentCurrencyCode>${escapeXML(invoice.currency)}</cbc:DocumentCurrencyCode>\n`;

    // Notes
    if (invoice.notes && invoice.notes.length > 0) {
        invoice.notes.forEach((note) => {
            xmlString += `  <cbc:Note>${escapeXML(note)}</cbc:Note>\n`;
        });
    }

    // Payment details
    if (invoice.paymentDetails) {
        xmlString += `  <cac:PaymentMeans>\n`;
        if (invoice.paymentDetails.paymentMeansCode) {
            xmlString += `    <cbc:PaymentMeansCode>${escapeXML(invoice.paymentDetails.paymentMeansCode)}</cbc:PaymentMeansCode>\n`;
        }
        if (invoice.paymentDetails.paymentID) {
            xmlString += `    <cbc:PaymentID>${escapeXML(invoice.paymentDetails.paymentID)}</cbc:PaymentID>\n`;
        }
        if (invoice.paymentDetails.bankDetails) {
            xmlString += `    <cac:PayeeFinancialAccount>\n`;
            if (invoice.paymentDetails.bankDetails.accountName) {
                xmlString += `      <cbc:Name>${escapeXML(invoice.paymentDetails.bankDetails.accountName)}</cbc:Name>\n`;
            }
            if (invoice.paymentDetails.bankDetails.iban) {
                xmlString += `      <cbc:ID>${escapeXML(invoice.paymentDetails.bankDetails.iban)}</cbc:ID>\n`;
            }
            if (invoice.paymentDetails.bankDetails.bic) {
                xmlString += `      <cbc:SchemeID>${escapeXML(invoice.paymentDetails.bankDetails.bic)}</cbc:SchemeID>\n`;
            }
            if (invoice.paymentDetails.bankDetails.bankName) {
                xmlString += `      <cbc:BankName>${escapeXML(invoice.paymentDetails.bankDetails.bankName)}</cbc:BankName>\n`;
            }
            xmlString += `    </cac:PayeeFinancialAccount>\n`;
        }
        xmlString += `  </cac:PaymentMeans>\n`;
    }

    // Supplier
    xmlString += `  <cac:AccountingSupplierParty>\n`;
    xmlString += `    <cac:Party>\n`;
    xmlString += `      <cac:PartyName>\n`;
    xmlString += `        <cbc:Name>${escapeXML(invoice.supplier.name)}</cbc:Name>\n`;
    xmlString += `      </cac:PartyName>\n`;
    xmlString += `      <cac:PostalAddress>\n`;
    if (invoice.supplier.street) {
        xmlString += `        <cbc:StreetName>${escapeXML(invoice.supplier.street)}</cbc:StreetName>\n`;
    }
    if (invoice.supplier.city) {
        xmlString += `        <cbc:CityName>${escapeXML(invoice.supplier.city)}</cbc:CityName>\n`;
    }
    if (invoice.supplier.postalCode) {
        xmlString += `        <cbc:PostalZone>${escapeXML(invoice.supplier.postalCode)}</cbc:PostalZone>\n`;
    }
    xmlString += `        <cac:Country>\n`;
    xmlString += `          <cbc:IdentificationCode>${escapeXML(invoice.supplier.country)}</cbc:IdentificationCode>\n`;
    xmlString += `        </cac:Country>\n`;
    xmlString += `      </cac:PostalAddress>\n`;
    xmlString += `    </cac:Party>\n`;
    xmlString += `  </cac:AccountingSupplierParty>\n`;

    // Customer
    xmlString += `  <cac:AccountingCustomerParty>\n`;
    xmlString += `    <cac:Party>\n`;
    xmlString += `      <cac:PartyName>\n`;
    xmlString += `        <cbc:Name>${escapeXML(invoice.customer.name)}</cbc:Name>\n`;
    xmlString += `      </cac:PartyName>\n`;
    xmlString += `      <cac:PostalAddress>\n`;
    if (invoice.customer.street) {
        xmlString += `        <cbc:StreetName>${escapeXML(invoice.customer.street)}</cbc:StreetName>\n`;
    }
    if (invoice.customer.city) {
        xmlString += `        <cbc:CityName>${escapeXML(invoice.customer.city)}</cbc:CityName>\n`;
    }
    if (invoice.customer.postalCode) {
        xmlString += `        <cbc:PostalZone>${escapeXML(invoice.customer.postalCode)}</cbc:PostalZone>\n`;
    }
    xmlString += `        <cac:Country>\n`;
    xmlString += `          <cbc:IdentificationCode>${escapeXML(invoice.customer.country)}</cbc:IdentificationCode>\n`;
    xmlString += `        </cac:Country>\n`;
    xmlString += `      </cac:PostalAddress>\n`;
    xmlString += `    </cac:Party>\n`;
    xmlString += `  </cac:AccountingCustomerParty>\n`;

    // Tax details
    xmlString += `  <cac:TaxTotal>\n`;
    xmlString += `    <cbc:TaxAmount>${escapeXML(invoice.taxTotal.taxAmount.toFixed(2))}</cbc:TaxAmount>\n`;
    xmlString += `    <cac:TaxSubtotal>\n`;
    xmlString += `      <cbc:Percent>${escapeXML(invoice.taxTotal.taxPercentage.toFixed(2))}</cbc:Percent>\n`;
    xmlString += `    </cac:TaxSubtotal>\n`;
    xmlString += `  </cac:TaxTotal>\n`;

    // Line items
    invoice.lineItems.forEach((item) => {
        xmlString += `  <cac:InvoiceLine>\n`;
        xmlString += `    <cbc:ID>${escapeXML(item.id)}</cbc:ID>\n`;
        xmlString += `    <cbc:InvoicedQuantity>${item.quantity.toFixed(2)}</cbc:InvoicedQuantity>\n`;
        xmlString += `    <cbc:LineExtensionAmount>${item.lineTotal.toFixed(2)}</cbc:LineExtensionAmount>\n`;
        xmlString += `    <cac:Item>\n`;
        xmlString += `      <cbc:Description>${escapeXML(item.description)}</cbc:Description>\n`;
        xmlString += `    </cac:Item>\n`;
        xmlString += `    <cac:Price>\n`;
        xmlString += `      <cbc:PriceAmount>${item.unitPrice.toFixed(2)}</cbc:PriceAmount>\n`;
        xmlString += `    </cac:Price>\n`;
        xmlString += `  </cac:InvoiceLine>\n`;
    });

    // Closing tag
    xmlString += `</Invoice>\n`;

    return xmlString;
}

module.exports = {
    generateUBLInvoiceXML,
    escapeXML,
};
