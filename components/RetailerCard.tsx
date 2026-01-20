import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Retailer } from '@/scripts/data/types/retailer';
import { MapPin, Globe, Mail, Phone, MessageCircle } from 'lucide-react';

interface RetailerCardProps {
    retailer: Omit<Retailer, 'englishName'> & { english_name?: string };
}

const RetailerCard: React.FC<RetailerCardProps> = ({ retailer }) => {
    const { contact } = retailer;
    console.log(retailer)
    return (
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <CardTitle className="text-lg font-bold leading-tight">
                            {retailer.name}
                        </CardTitle>
                        {retailer.english_name && (
                            <CardDescription className="text-sm mt-1">
                                {retailer.english_name}
                            </CardDescription>
                        )}
                    </div>
                    <Badge variant="outline" className="shrink-0">
                        {retailer.country}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <div>
                    <Badge variant="secondary" className="mb-2">
                        {retailer.category.product}
                    </Badge>
                </div>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-auto">
                    {(contact.shopAddress || contact.factoryAddress) && (
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                            <span className="break-words">
                                {contact.shopAddress || contact.factoryAddress}
                            </span>
                        </div>
                    )}

                    {contact.website && (
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 shrink-0" />
                            <a 
                                href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline text-primary break-all"
                            >
                                {contact.website}
                            </a>
                        </div>
                    )}

                    {contact.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 shrink-0" />
                            <a href={`mailto:${contact.email}`} className="hover:underline break-all">
                                {contact.email}
                            </a>
                        </div>
                    )}

                    {contact.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 shrink-0" />
                            <span>{contact.phone}</span>
                        </div>
                    )}

                    {contact.wechat && (
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 shrink-0" />
                            <span className="break-all">WeChat: {contact.wechat}</span>
                        </div>
                    )}
                </div>
                
                {retailer.exhibition && retailer.exhibition.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="font-semibold text-xs mb-2 uppercase text-muted-foreground">Exhibitions</p>
                        <div className="flex flex-wrap gap-2">
                            {retailer.exhibition.map((ex, index) => (
                                <Badge key={index} variant="outline" className="text-xs font-normal">
                                    {ex.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RetailerCard;
