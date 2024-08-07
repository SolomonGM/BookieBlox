const testFetch = async () => {
    try {
        const response = await fetch('/data/test.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Should log: { message: "Test file successfully served" }
    } catch (error) {
        console.error('Failed to fetch test file:', error);
    }
};

testFetch();
