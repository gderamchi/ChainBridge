import * as fs from 'fs';
import { Retailer, RetailerClothingCategory } from './sandbox/data/types/retailer';

// Read the output.json file
const outputData = JSON.parse(fs.readFileSync('./sandbox/output.json', 'utf-8'));

const exhibition = {
    name: "Intertextile",
    address: "168 East Yinggang Road, Shanghai, China"
};

// Valid product categories from RetailerClothingCategory
const validProducts = [
    "A Variety of Protective Wears", "Accessories", "Agent", "Artificial Fur / Plush",
    "Belt", "Belts", "Bridal Wear Fabrics", "Button", "Buttons / Buckles",
    "Casual Wear Fabrics", "Children & Infants Fabrics", "Collar", "Cotton", "Cups",
    "Design & Styling", "Digital Print", "Digital Prints", "Digital Solutions",
    "Down Fabric and Filling", "Dyeing Auxiliaries", "Econogy Hub (Accessories)",
    "Econogy Hub (Cashmere)", "Econogy Hub (Certificate)", "Econogy Hub (Functional)",
    "Econogy Hub (Knitted)", "Econogy Hub (Regeneration Fiber Fabric)",
    "Econogy Hub (Testing &", "Econogy Hub (Testing & Certification)",
    "Econogy Hub (Traceability", "Econogy Hub (Traceability Platform and Service)",
    "Feather", "Functional", "Functional Outdoor and",
    "Functional Outdoor and Sportswear Fabrics", "Functional Shapewear Fabric",
    "Glue / Adhesive tape", "Graphic Media", "Hanger, Mannequin",
    "Headwear, Brooch, Jewelry", "Heat Transfer Print", "Heat Transfer Prints",
    "Interlinings", "Jacquard", "Knitted", "Knitted Denim", "Knitted Wool", "Label",
    "Labels / Badges / Hangtags", "Lace & Embroidery", "Lace and embroidery",
    "Lace, Ribbon, Embroidery", "Lace, Ribbon, Embroidery/Knitted", "Linen / Ramie",
    "Linen/Ramie", "Lining", "Linings", "Man-made", "Man-made (Wool-like)",
    "Metal Accessories", "Mixed", "Network Media", "Others", "Others (Association)",
    "Others (Cashmere)", "Others (Collar)", "Others (Cupro)",
    "Others (Jacquard and oobby fabrics for haute couture)", "Others (Jacquard)",
    "Others (Ribbing)", "Others (Tencel)", "Packaging, Shopping Bag",
    "Pajamas / Housecoat Fabric", "Pocket, Bag, Box", "Printed", "Reflective Materials",
    "Rhinestone, Bead and Sequin", "Rhinestones, Bead, Sequin", "Scarves",
    "Shirting Fabrics", "Shoulder Pads", "Shoulder Straps", "Silk", "Swimwear Fabrics",
    "Synthetic Leather", "Tape", "Testing & Certification", "Thread", "Trade publication",
    "Trend Forecaster", "Underwear Fabric", "Wool", "Wool-Woolen", "Wool-Worsted",
    "Woven Denim", "Yarns & Fibres", "Zippers / Zip Fasteners"
] as const;

function normalizeProduct(product: string): RetailerClothingCategory['product'] {
    // Try exact match first
    if (validProducts.includes(product as any)) {
        return product as RetailerClothingCategory['product'];
    }
    
    // Try case-insensitive match
    const lowerProduct = product.toLowerCase();
    const match = validProducts.find(p => p.toLowerCase() === lowerProduct);
    if (match) {
        return match;
    }
    
    // Default to "Others" if no match found
    return "Others";
}

function parseSheet(sheet: any): Retailer[] {
    const retailers: Retailer[] = [];
    const headers = sheet.headers;
    
    // Check if this sheet has exhibitor data
    // Based on the structure, columns seem to be:
    // Column 1 (Exhibitors): English Name
    // Column 2: Chinese Name
    // Column 3: Product Category
    // Column 4: Hall/Booth Area
    // Column 5: Booth Number
    // Column 6: Email
    // Column 7: Country/Region
    
    // Process header row if it contains actual data
    if (headers && headers[0] && headers[0] !== 'Exhibitors' && headers[0] !== 'Column_7' && headers[0] !== 'China') {
        const englishName = headers[0]?.replace(/\n/g, ' ').trim();
        const chineseName = headers[1]?.trim();
        const productCategory = headers[2]?.trim();
        const boothNumber = headers[4]?.trim();
        const contactInfo = headers[5]?.trim();
        const country = headers[6]?.trim() || 'China';
        
        if (englishName && productCategory) {
            retailers.push({
                englishName: englishName,
                name: chineseName || englishName,
                category: {
                    kind: "clothing",
                    product: normalizeProduct(productCategory)
                },
                country: country,
                contact: {
                    email: contactInfo && contactInfo.includes('@') ? contactInfo : undefined,
                    website: contactInfo && (contactInfo.startsWith('http') || contactInfo.startsWith('www')) ? contactInfo : undefined
                },
                exhibition: [{
                    name: exhibition.name,
                    address: exhibition.address,
                    boothNumber: boothNumber
                }]
            });
        }
    }
    
    // Process rows
    if (sheet.rows && Array.isArray(sheet.rows)) {
        for (const row of sheet.rows) {
            // Skip header-like rows
            if (row.Column_7 === 'Country/Region' || Object.keys(row).length <= 1) {
                continue;
            }
            
            const englishName = (row.Exhibitors || row[headers[0]])?.replace(/\n/g, ' ').trim();
            const chineseName = (row.Column_2 || row[headers[1]])?.trim();
            const productCategory = (row.Column_3 || row[headers[2]])?.trim();
            const boothNumber = (row.Column_5 || row[headers[4]])?.trim();
            const contactInfo = (row.Column_6 || row[headers[5]])?.trim();
            const country = (row.Column_7 || row[headers[6]])?.trim() || 'China';
            
            if (englishName && productCategory) {
                retailers.push({
                    englishName: englishName,
                    name: chineseName || englishName,
                    category: {
                        kind: "clothing",
                        product: normalizeProduct(productCategory)
                    },
                    country: country,
                    contact: {
                        email: contactInfo && contactInfo.includes('@') ? contactInfo : undefined,
                        website: contactInfo && (contactInfo.startsWith('http') || contactInfo.startsWith('www')) ? contactInfo : undefined
                    },
                    exhibition: [{
                        name: exhibition.name,
                        address: exhibition.address,
                        boothNumber: boothNumber
                    }]
                });
            }
        }
    }
    
    return retailers;
}

// Parse all sheets
const allRetailers: Retailer[] = [];

for (const sheet of outputData.sheets) {
    const sheetRetailers = parseSheet(sheet);
    allRetailers.push(...sheetRetailers);
}

// Remove duplicates based on englishName
// const uniqueRetailers = allRetailers.reduce((acc: Retailer[], current) => {
//     const exists = acc.find(item => item.englishName === current.englishName);
//     if (!exists) {
//         acc.push(current);
//     }
//     return acc;
// }, []);
const uniqueRetailers = allRetailers;

// Write the standardized output
const output = {
    exportedAt: new Date().toISOString(),
    exhibition: exhibition,
    totalRetailers: uniqueRetailers.length,
    retailers: uniqueRetailers
};

fs.writeFileSync('./standardized_retailers.json', JSON.stringify(output, null, 2), 'utf-8');

console.log(`Successfully exported ${uniqueRetailers.length} retailers to standardized_retailers.json`);