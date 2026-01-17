export type RetailerContact = Partial<{
    factoryAddress: string,
    shopAddress: string,
    wechat: string,
    website: string,
    email: string,
    phone: string
}>;

export type Retailer = {
    name: string,
    contact: RetailerContact
}