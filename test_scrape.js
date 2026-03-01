import { gotScraping } from 'got-scraping';

async function test() {
    try {
        const response = await gotScraping({
            url: 'https://otakudesu.best/ongoing-anime/',
            headerGeneratorOptions: {
                browsers: [
                    { name: 'chrome', minVersion: 120 },
                    { name: 'firefox', minVersion: 120 },
                ],
                devices: ['desktop'],
                locales: ['en-US', 'en'],
                operatingSystems: ['windows', 'linux'],
            },
        });
        console.log('Status Code:', response.statusCode);
        console.log('Body length:', response.body.length);
        if (response.body.includes('venz')) {
            console.log('Success: Found expected content!');
        } else {
            console.log('Failure: Content not found. Body snippet:', response.body.substring(0, 500));
        }
    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Response Status:', err.response.statusCode);
            console.error('Response Body Snippet:', err.response.body.substring(0, 500));
        }
    }
}

test();
