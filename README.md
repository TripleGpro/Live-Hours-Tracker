# Triple G Lawncare - Employee Time Tracker

A modern, professional time tracking application for Triple G Lawncare employees. Features a clean interface optimized for iPad use with Kiosk Pro Lite.

## Features

### Employee Features
- **Simple Login**: Dropdown selection of employee names (no password required)
- **Clock In/Out**: Large, touch-friendly buttons
- **Notes**: Optional notes for each clock in/out action
- **Confirmation**: "Are you sure?" step before logging time
- **Thank You Screen**: Confirmation after successful action
- **Time Display**: Current time and date shown after login

### Admin Features
- **Employee Management**: Add and delete employees
- **Secure Access**: Admin password protection
- **Local Storage**: Employee list saved on device
- **Real-time Updates**: Changes reflect immediately in dropdown

## Setup Instructions

### 1. Local Network Setup (Recommended)

#### On Your Mac:
```bash
# Navigate to project folder
cd "/Users/michaelcarey/Desktop/GGG Hours Tracker WORKING copy"

# Start local server
python3 -m http.server 8000
```

#### Find Your Mac's IP:
- System Preferences → Network → WiFi → Advanced
- Note the IP address (e.g., `192.168.1.105`)

#### On iPad:
1. Connect to same WiFi network
2. Open Safari
3. Go to: `http://YOUR_MAC_IP:8000`
4. Add to Home Screen for app-like experience

### 2. Kiosk Pro Lite Setup

1. **Download Kiosk Pro Lite** from App Store (free)
2. **Configure Settings:**
   - Homepage URL: `http://YOUR_MAC_IP:8000`
   - Auto-refresh: Every 30 seconds
   - Security: Require password to exit
   - Full-screen: Enabled
3. **Mount iPad** securely in office
4. **Test workflow** with employees

## Admin Access

### Default Admin Password
- **Password**: `tripleg2024`
- **Access**: Click "Admin Mode" button on login screen

### Employee Management
- **Add Employee**: Enter name and click "Add Employee"
- **Delete Employee**: Click "Delete" button next to employee name
- **Validation**: Prevents duplicates and empty names
- **Storage**: Employee list saved locally on iPad

### Security Notes
- Change default admin password in `script.js`
- Admin password is stored in code (consider more secure methods for production)
- Employee data stored in browser localStorage

## Testing

### Mock Mode
The app runs in mock mode by default (`MOCK_MODE = true` in `script.js`). This means:
- No real n8n webhooks are called
- All actions simulate success responses
- Perfect for testing without backend setup

### Test Credentials
- **Employee**: Select any name from dropdown (no password required)
- **Admin Password**: `tripleg2024`

## n8n Integration

### Webhook URLs
Update these in `script.js` when ready for production:
```javascript
const CONFIG = {
    LOGIN_WEBHOOK: 'https://your-n8n-instance.com/webhook/login',
    CLOCK_IN_WEBHOOK: 'https://your-n8n-instance.com/webhook/clock-in',
    CLOCK_OUT_WEBHOOK: 'https://your-n8n-instance.com/webhook/clock-out'
};
```

### Data Sent to n8n
```json
{
    "employeeId": "John Smith",
    "employeeName": "John Smith",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "action": "clock-in",
    "date": "1/15/2024",
    "time": "10:30:00 AM",
    "notes": "Optional notes from employee"
}
```

## File Structure
```
├── index.html          # Main application interface
├── styles.css          # Styling and responsive design
├── script.js           # Application logic and admin functions
├── README.md           # This documentation
└── n8n-workflow-examples.json  # Sample n8n configurations
```

## Customization

### Colors and Branding
- Primary green: `#00ff00` (neon green)
- Background: Dark gradient with green accents
- Company logo: Triple G branding with grass element

### Employee List
- Default employees can be modified in `script.js`
- Admin can add/delete employees through the interface
- Maximum 50 characters per employee name

## Troubleshooting

### Common Issues
1. **iPad can't connect**: Check both devices on same WiFi
2. **IP address changed**: Check Mac's Network settings again
3. **Admin not working**: Verify password is `tripleg2024`
4. **Employee not appearing**: Refresh page after adding employee

### Browser Compatibility
- Optimized for Safari on iPad
- Works on Chrome, Firefox, Edge
- Responsive design for different screen sizes

## Security Considerations

### For Office Use
- Use office WiFi (not public)
- Consider dedicated network for time tracking
- Physical security for iPad (wall mount, protective case)
- Regular admin password changes

### Data Privacy
- Employee data stored locally on iPad
- No data sent to external servers in mock mode
- Consider data backup procedures

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify all files are in the same directory
3. Ensure Python server is running
4. Test with different browsers if needed

---

**Triple G Lawncare** - Professional Lawn Care & Landscaping Services  
Bringhurst, Indiana | 765.461.0053 