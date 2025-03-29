import React from 'react'

const EmergencyContacts = () => {
    const contacts = [
      { name: "Hospital Reception", number: "XXX-XXX-XXXX" },
      { name: "Emergency Room (ER)", number: "XXX-XXX-XXXX" },
      { name: "Ambulance Services", number: "XXX-XXX-XXXX" },
      { name: "ICU & Critical Care", number: "XXX-XXX-XXXX" },
      { name: "Blood Bank", number: "XXX-XXX-XXXX" },
      { name: "Poison Control Center", number: "XXX-XXX-XXXX" },
      { name: "Pharmacy", number: "XXX-XXX-XXXX" },
    ];
  
    return (
      <div style={{ padding: "20px", textAlign: "center", color: '#1C4A2A'}}>
        <h2>Hospital Emergency Contacts</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#1C4A2A" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd", color: 'white'}}>Service</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", color: 'white' }}>Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{contact.name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <a href={`tel:${contact.number}`} style={{ textDecoration: "none", color: "blue" }}>
                    {contact.number}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default EmergencyContacts;
  