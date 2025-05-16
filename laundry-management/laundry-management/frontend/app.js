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

// Handle order form submission
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

    try {
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

       if (res.ok) {
        alert("Value"+result);
         document.getElementById('orderResult').textContent = `Order Placed! Order ID: ${result.order_id}`;
        
       } else {
         document.getElementById('orderResult').textContent = `Error: ${result.error}`;
       }
    } catch (err) {
      console.error('Error:', err);
      document.getElementById('orderResult').textContent = 'Failed to place order. Try again later.';
    }
  });
}

// Handle order tracking
if (document.getElementById('trackForm')) {
  document.getElementById('trackForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const trackId = document.getElementById('trackId').value.trim();
    const result = document.getElementById('trackResult');

    if (!trackId) {
      result.textContent = 'Please enter a valid Order ID';
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/orders/${trackId}`);
      const data = await res.json();

      if (!res.ok) {
        result.textContent = `Error: ${data.error}`;
        return;
      }

      result.innerHTML = `
        <div class="bg-green-100 text-green-800 p-3 rounded mt-2">
          <strong>Order ID:</strong> ${trackId}<br/>
          <strong>Status:</strong> ${data.status}<br/>
          <strong>Service:</strong> ${data.service_name || 'N/A'}<br/>
          <strong>Total:</strong> ₹${data.total_amount || 0}
        </div>`;
    } catch (err) {
      console.error('Tracking error:', err);
      result.textContent = 'Failed to track order. Try again later.';
    }
  });
}
async function getEmployee() {
  const orderId = document.getElementById('employeeOrderId').value.trim();
  const resultDiv = document.getElementById('employeeResult');

  if (!orderId) {
    resultDiv.textContent = 'Please enter a valid Order ID.';
    return;
  }

  try {
    // Step 1: Get the order to find assigned employee ID
    const orderRes = await fetch(`http://localhost:3000/api/orders/${orderId}`);
    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      resultDiv.textContent = `Error: ${orderData.error}`;
      return;
    }

    const employeeId = orderData.employee_id;
    if (!employeeId) {
      resultDiv.textContent = 'No employee assigned to this order.';
      return;
    }

    // Step 2: Get employee details
    const empRes = await fetch(`http://localhost:3000/api/employees/${employeeId}`);
    const empData = await empRes.json();

    if (!empRes.ok) {
      resultDiv.textContent = `Error: ${empData.error}`;
      return;
    }

    resultDiv.innerHTML = `
      <div class="bg-blue-100 text-blue-800 p-3 rounded mt-2">
        <strong>Employee ID:</strong> ${empData.employee_id}<br/>
        <strong>Employee Role:</strong> ${empData.role}<br/>
        <strong>Employee Name:</strong> ${empData.name}<br/>
        <strong>Phone:</strong> ${empData.contact}<br/>
        
      </div>
    `;
  } catch (err) {
    console.error('Error fetching employee:', err);
    resultDiv.textContent = 'Something went wrong. Try again later.';
  }
}
async function makePayment() {
  const orderId = document.getElementById('paymentOrderId').value.trim();
  const method = document.getElementById('paymentMethod').value;
  const resultDiv = document.getElementById('paymentResult');

  if (!orderId || !method) {
    resultDiv.textContent = 'Please provide Order ID and Payment Method.';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, method })
    });

    const data = await res.json();

    if (!res.ok) {
      resultDiv.textContent = `Payment Error: ${data.error}`;
    } else {
      resultDiv.textContent = `Payment Successful! Payment ID: ${data.payment_id}, Status: ${data.status}`;
    }
  } catch (err) {
    console.error('Payment failed:', err);
    resultDiv.textContent = 'Failed to make payment. Try again later.';
  }
}
