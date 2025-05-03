// Load services for order form
async function loadServices() {
  try {
    const res = await fetch('http://localhost:3000/api/services');
    const services = await res.json();
    const select = document.getElementById('service');

    // Add default option
    const defaultOpt = document.createElement('option');
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    defaultOpt.textContent = 'Select a Service';
    select.appendChild(defaultOpt);

    services.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.service_id;
      opt.textContent = `${s.service_name} - ₹${s.price}`;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error('Failed to load services:', err);
  }
}

if (document.getElementById('orderForm')) {
  loadServices();

  document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const addressInput = document.getElementById('address');
    const contactInput = document.getElementById('contact');
    const serviceInput = document.getElementById('service');

    const data = {
      name: nameInput.value,
      address: addressInput.value,
      contact: contactInput.value,
      service_id: serviceInput.value,
    };

    const res = await fetch('http://localhost:3000/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    document.getElementById('orderResult').textContent = `Order Placed! Order ID: ${result.order_id}`;
  });
}
