async function test() {
    try {
        const res = await fetch('http://localhost:8070/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@admin.com',
                password: 'admin123'
            })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Data:", data);
    } catch(err) {
        console.error("Error:", err);
    }
}
test();
