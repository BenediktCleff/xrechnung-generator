# XRechnung Generator

<div>
   <img src="https://badgen.now.sh/npm/v/xrechnung-generator" alt="Version" />
   <img src="https://badgen.now.sh/npm/license/xrechnung-generator" alt="MIT License" />
   <img src="https://badgen.now.sh/npm/types/xrechnung-generator" alt="Types included" />
</div>

XRechnung is a **standardized electronic invoice format** developed to comply with the **European Directive 2014/55/EU**, which mandates electronic invoicing in public procurement. It is primarily used in **Germany**, but it adheres to EU-wide guidelines for electronic invoicing.

A lightweight Node.js module for creating XRechnung-compliant invoices in the UBL (Universal Business Language) format.

## Installation

Install the module via npm:

```bash
npm install xrechnung-generator
```

## Usage

### Import the Module

```javascript
import XRechnungGenerator from 'xrechnung-generator'
```

### Example: Using the Functions

```javascript
const invoiceData = {
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

// Create a new invoice
const xrechnung = new XRechnungGenerator(invoiceData);
console.log(xrechnung.toXMLString());
```

## API

### `XRechnungGenerator`

```javascript
const xrechnung = new XRechnungGenerator(invoiceData);
```

- **`invoiceData` (InvoiceData)**: The invoice to convert (see example above).

```typescript
interface InvoiceData {
  id: string;
  issueDate: string;
  dueDate?: string; // optional
  currency: string;
  totalAmount: number;
  supplier: {
    name: string;
    country: string;
    street?: string; // optional
    postalCode?: string; // optional
    city?: string; // optional
    taxNumber?: string; // optional
    legalEntityID?: string; // optional
  };
  customer: {
    name: string;
    country: string;
    street?: string; // optional
    postalCode?: string; // optional
    city?: string; // optional
    taxNumber?: string; // optional
    legalEntityID?: string; // optional
  };
  taxTotal: {
    taxAmount: number;
    taxPercentage: number;
  };
  paymentDetails?: { // optional
    paymentMeansCode?: string; // optional
    paymentID?: string; // optional
  };
  notes?: string[]; // optional
  lineItems: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
}
```


#### Methods

1. **`toXMLString()`**
    - Returns the XML representation of the invoice as a string.

   ```javascript
   const xmlString = xrechnung.toXMLString();
   ```

2. **`toBuffer()`**
    - Returns the XML representation as a `Buffer` object.

   ```javascript
   const buffer = xrechnung.toBuffer();
   ```

3. **`toBlob()`**
    - Returns the XML representation as a `Blob` object (useful for browser environments).

   ```javascript
   const blob = xrechnung.toBlob();
   console.log(blob.content);
   ```

4. **`writeFile(filePath)`**
    - Writes the XML representation to the specified file path.
    - **Parameters**:
        - `filePath` (String): Path to the output file.
    - Returns a `Promise`.

   ```javascript
   xrechnung.writeFile('/path/to/invoice.xrechnung')
       .then(() => console.log('File written successfully.'))
       .catch(console.error);
   ```

## Contribution

Contributions in the form of bug reports, feature requests, or pull requests are welcome! Please ensure you run the tests and cover new functionality when contributing.

## License

This project is licensed under the [MIT License](LICENSE).


## Hire Me

Looking for a developer with expertise in **Node.js**? Feel free to reach out to me for freelance projects, collaborations, or full-time opportunities!

Contact me [hello@pixelpal.io](mailto:hello@pixelpal.io)
