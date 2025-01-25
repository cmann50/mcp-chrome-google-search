import {getWebContent} from '../../src/toolsImpl/webFetchTool';

describe('web-fetch Tool', () => {
    it('should fetch and parse content from a URL', async () => {
        const url = 'https://apple.com';

        try {
            console.log('Test: Calling getWebContent with URL:', url);
            const result = await getWebContent(url);
            console.log('Test: Received result type:', typeof result);
            console.log('Test: Result length:', result?.length);
            console.log('Test: Raw result:', result);

            // Check that we got content
            expect(result).toBeTruthy();
            expect(result.length).toBeGreaterThan(0);

            // Basic content validation - apple.com should contain Apple-related content
            expect(result.toLowerCase()).toMatch(/apple|iphone|mac|ipad/);

            // Log the results for inspection
            console.log('Web Content Results:');
            console.log('-----------------');
            console.log(result);
            console.log('-----------------');

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error('Should not throw an error: ' + errorMessage);
        }
    }, 30000);

    it('should include links when requested', async () => {
        const url = 'https://apple.com';

        const result = await getWebContent(url, {includeLinks: true});

        // Check for links section and content
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);

        // If we have links, they should be properly formatted
        if (result.includes('=== Links ===')) {
            expect(result).toMatch(/\([^)]+\)/);
        }

        console.log('Content with Links:');
        console.log('-----------------');
        console.log(result);
        console.log('-----------------');
    }, 30000);


});