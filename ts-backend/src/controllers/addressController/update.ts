import { Request, Response } from 'express';

import UserModel from '../../models/UserModel';

interface IAddressData {
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipcode?: string;
}

export default async function update(req: Request, res: Response) {

    const id = Number(req.params.id);
    const { userId } = req.tokenPayload;

    const {
        street,
        number,
        neighborhood,
        city,
        state,
        zipcode,
    } = req.body as IAddressData;

    try {

        const user = await UserModel.findOne(userId, {
            relations: ['addresses'],
        });

        if(user == null) return res.status(400).json({ message: 'user not found' });

        const filteredAddress = user.addresses?.filter( (address) => address.id === id );
        
        if(filteredAddress == null || filteredAddress.length === 0) return res.status(400).json({ message: "address not found" });

        const address = filteredAddress[0];
        
        if(street) address.street = street;
        if(number) address.number = number;
        if(neighborhood) address.neighborhood = neighborhood;
        if(city) address.city = city;
        if(state) address.state = state;
        if(zipcode) address.zipcode = zipcode;

        await address.save();

        return res.sendStatus(204);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal error" });
    }
}
