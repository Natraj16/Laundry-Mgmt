// Load services for order form
async function loadServices() {
    const res = await fetch('/api/services');
    const services = await res.json();
    const select = document.getElementById('service');
    services.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.service_id;
      opt.textContent = `${s.service_name} - $${s.price}`;
      select.appendChild(opt);
    });
  }
  
  if (document.getElementById('orderForm')) {
    loadServices();
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        name: name.value,
        address: address.value,
        contact: contact.value,
        service_id: service.value,
      };
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      orderResult.textContent = `Order Placed! Order ID: ${result.order_id}`;
    });
  }
  
  async function trackOrder() {
    const id = document.getElementById('trackId').value;
    const res = await fetch(`/api/track/${id}`);
    const result = await res.json();
    document.getElementById('trackResult').textContent = `Status: ${result.status}`;
  }
  
  async function makePayment() {
    const id = paymentOrderId.value;
    const method = paymentMethod.value;
    const res = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: id, method }),
    });
    const result = await res.json();
    paymentResult.textContent = `Payment ${result.status}! Payment ID: ${result.payment_id}`;
  }
  
  async function getEmployee() {
    const id = empOrderId.value;
    const res = await fetch(`/api/employee/${id}`);
    const emp = await res.json();
    empResult.textContent = `Assigned Employee: ${emp.name}, Contact: ${emp.contact}`;
  }
  