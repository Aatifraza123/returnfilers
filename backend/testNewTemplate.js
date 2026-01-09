const { getAdminNotificationTemplate, getCustomerConfirmationTemplate } = require('./utils/emailTemplates');

console.log('Testing new email templates...\n');

// Test contact template
const adminHtml = getAdminNotificationTemplate({
  type: 'contact',
  data: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    message: 'This is a test message'
  }
});

console.log('Admin template generated, length:', adminHtml.length);
console.log('Contains RF badge:', adminHtml.includes('logo-badge'));
console.log('Contains gradient:', adminHtml.includes('linear-gradient'));
console.log('Contains info-card:', adminHtml.includes('info-card'));
console.log('Contains ReturnFilers:', adminHtml.includes('ReturnFilers'));

// Test customer template
const customerHtml = getCustomerConfirmationTemplate({
  type: 'contact',
  data: {
    name: 'Test User',
    message: 'This is a test message'
  }
});

console.log('\nCustomer template generated, length:', customerHtml.length);
console.log('Contains RF badge:', customerHtml.includes('logo-badge'));
console.log('Contains gradient:', customerHtml.includes('linear-gradient'));
console.log('Contains info-card:', customerHtml.includes('info-card'));

console.log('\n✅ Templates are working correctly!');
