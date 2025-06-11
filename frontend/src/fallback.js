if (typeof webix === 'undefined') {
    console.error('Webix library not loaded.');
    document.getElementById('app').innerHTML = '<p style="color: red;">Error: Failed to load Webix library. Please check your internet connection.</p>';
}