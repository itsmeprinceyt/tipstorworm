import Tipstor from "../../(models)/TipstorWormModel";
import { NextResponse } from "next/server";


export async function POST(req) {
    const body = await req.json();
    try {
        const newTipstorData = new Tipstor({
            title: body.title,
            description: body.description,
            photo_description: body.photo_description,
            photo: body.photo,
            hyperlink_description: body.hyperlink_description,
            hyperlink: body.hyperlink,
            category: body.category,
            color: body.color
        });

        // Save the new document to the database
        const result = await newTipstorData.save();
        return new NextResponse(
            JSON.stringify({ message: "Data has been added successfully" }),
            { status: 202, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ message: "Data submit error!" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
