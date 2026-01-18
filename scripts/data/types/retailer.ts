export type RetailerContact = Partial<{
    factoryAddress: string,
    shopAddress: string,
    wechat: string,
    website: string,
    email: string,
    phone: string
}>;

export type RetailerExhibition = {
    name: string,
    address: string,
    boothNumber?: string,
    boothCode?: string,
}

export type RetailerClothingCategory = {
    kind: "clothing",
    product:
    | "A Variety of Protective Wears"
    | "Accessories"
    | "Agent"
    | "Artificial Fur / Plush"
    | "Belt"
    | "Belts"
    | "Bridal Wear Fabrics"
    | "Button"
    | "Buttons / Buckles"
    | "Casual Wear Fabrics"
    | "Children & Infants Fabrics"
    | "Collar"
    | "Cotton"
    | "Cups"
    | "Design & Styling"
    | "Digital Print"
    | "Digital Prints"
    | "Digital Solutions"
    | "Down Fabric and Filling"
    | "Dyeing Auxiliaries"
    | "Econogy Hub (Accessories)"
    | "Econogy Hub (Cashmere)"
    | "Econogy Hub (Certificate)"
    | "Econogy Hub (Functional)"
    | "Econogy Hub (Knitted)"
    | "Econogy Hub (Regeneration Fiber Fabric)"
    | "Econogy Hub (Testing &"
    | "Econogy Hub (Testing & Certification)"
    | "Econogy Hub (Traceability"
    | "Econogy Hub (Traceability Platform and Service)"
    | "Feather"
    | "Functional"
    | "Functional Outdoor and"
    | "Functional Outdoor and Sportswear Fabrics"
    | "Functional Shapewear Fabric"
    | "Glue / Adhesive tape"
    | "Graphic Media"
    | "Hanger, Mannequin"
    | "Headwear, Brooch, Jewelry"
    | "Heat Transfer Print"
    | "Heat Transfer Prints"
    | "Interlinings"
    | "Jacquard"
    | "Knitted"
    | "Knitted Denim"
    | "Knitted Wool"
    | "Label"
    | "Labels / Badges / Hangtags"
    | "Lace & Embroidery"
    | "Lace and embroidery"
    | "Lace, Ribbon, Embroidery"
    | "Lace, Ribbon, Embroidery/Knitted"
    | "Linen / Ramie"
    | "Linen/Ramie"
    | "Lining"
    | "Linings"
    | "Man-made"
    | "Man-made (Wool-like)"
    | "Metal Accessories"
    | "Mixed"
    | "Network Media"
    | "Others"
    | "Others (Association)"
    | "Others (Cashmere)"
    | "Others (Collar)"
    | "Others (Cupro)"
    | "Others (Jacquard and oobby fabrics for haute couture)"
    | "Others (Jacquard)"
    | "Others (Ribbing)"
    | "Others (Tencel)"
    | "Packaging, Shopping Bag"
    | "Pajamas / Housecoat Fabric"
    | "Pocket, Bag, Box"
    | "Printed"
    | "Reflective Materials"
    | "Rhinestone, Bead and Sequin"
    | "Rhinestones, Bead, Sequin"
    | "Scarves"
    | "Shirting Fabrics"
    | "Shoulder Pads"
    | "Shoulder Straps"
    | "Silk"
    | "Swimwear Fabrics"
    | "Synthetic Leather"
    | "Tape"
    | "Testing & Certification"
    | "Thread"
    | "Trade publication"
    | "Trend Forecaster"
    | "Underwear Fabric"
    | "Wool"
    | "Wool-Woolen"
    | "Wool-Worsted"
    | "Woven Denim"
    | "Yarns & Fibres"
    | "Zippers / Zip Fasteners"
}

export type RetailerCategory = RetailerClothingCategory

export type Retailer = {
    englishName?: string,
    name: string,
    category: RetailerClothingCategory,
    country: string,
    contact: RetailerContact,
    exhibition: RetailerExhibition[],
}