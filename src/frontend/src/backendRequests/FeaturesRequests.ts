import request from "./Request";

export interface Feature {
    fileName: string;
    data: string;
}

export async function getFeatures(): Promise<string[]> {
    const featureNames = await request("features") as string[];
    return featureNames;
}

export async function getFeature(fileName: string): Promise<Feature> {
    const feature: Feature = await request(`features/${fileName}`);
    return feature;
}

export async function addFeature(feature: Feature): Promise<void> {
    await request("features/add", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(feature),
    })
}

export async function removeFeature(fileName: string) {
    await request(`features/${fileName}`, {
        method: 'DELETE'
    })
}