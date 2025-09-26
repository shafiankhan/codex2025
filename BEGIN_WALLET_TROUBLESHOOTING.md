# Begin Wallet Connection Troubleshooting

## 🔧 Common Issues & Solutions

### Issue 1: "Begin Wallet not found"

**Possible Causes:**
- Begin Wallet extension not installed
- Extension disabled
- Wrong browser
- Extension not loaded yet

**Solutions:**
1. **Install Begin Wallet Extension**:
   - Visit Begin Wallet official website
   - Download and install browser extension
   - Create or import your wallet

2. **Check Extension Status**:
   - Open browser extensions page (chrome://extensions/)
   - Ensure Begin Wallet is enabled
   - Try refreshing the page

3. **Wait for Extension to Load**:
   ```javascript
   // Wait for wallet to load
   setTimeout(() => {
       // Try connection again
   }, 3000);
   ```

### Issue 2: "User declined connection"

**Solution:**
- Click "Connect" again
- Approve the connection in Begin Wallet popup
- Check if Begin Wallet is unlocked

### Issue 3: "Failed to enable wallet"

**Solutions:**
1. **Unlock Begin Wallet**:
   - Click Begin Wallet extension icon
   - Enter your password
   - Try connecting again

2. **Clear Browser Cache**:
   - Clear browser cache and cookies
   - Restart browser
   - Try again

3. **Check Network**:
   - Ensure you're on the correct network (Preprod/Mainnet)
   - Switch networks if needed

### Issue 4: Connection works but features missing

**Solutions:**
1. **Update Begin Wallet**:
   - Check for extension updates
   - Update to latest version

2. **Check API Version**:
   ```javascript
   console.log(window.cardano?.begin?.version);
   ```

3. **Feature Compatibility**:
   - Some features may not be available in all versions
   - Check Begin Wallet documentation

## 🧪 Testing Steps

### Step 1: Use Test Page
1. Open `test-begin-wallet.html` in your browser
2. Click "Check Available Wallets"
3. Look for Begin Wallet in the results

### Step 2: Manual Console Test
```javascript
// Open browser console (F12) and run:

// Check if Begin Wallet is available
console.log('Begin Wallet:', window.cardano?.begin);

// Try to connect
if (window.cardano?.begin) {
    window.cardano.begin.enable().then(api => {
        console.log('Connected!', api);
    }).catch(error => {
        console.error('Connection failed:', error);
    });
}
```

### Step 3: Network Check
```javascript
// Check network after connection
api.getNetworkId().then(networkId => {
    console.log('Network:', networkId === 0 ? 'Testnet' : 'Mainnet');
});
```

## 🔄 Alternative Connection Methods

### Method 1: Polling Detection
```javascript
async function waitForBeginWallet(timeout = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
        if (window.cardano?.begin) {
            return window.cardano.begin;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('Begin Wallet not found after timeout');
}
```

### Method 2: Event-Based Detection
```javascript
window.addEventListener('load', () => {
    // Check for Begin Wallet after page load
    setTimeout(checkBeginWallet, 2000);
});

document.addEventListener('DOMContentLoaded', () => {
    // Alternative check on DOM ready
    setTimeout(checkBeginWallet, 1000);
});
```

## 🆘 Still Having Issues?

### Debug Information to Collect:
1. **Browser & Version**: Chrome 120, Firefox 115, etc.
2. **Begin Wallet Version**: Check extension details
3. **Console Errors**: Copy any error messages
4. **Network**: Testnet or Mainnet
5. **Operating System**: Windows, Mac, Linux

### Test with Demo Wallet:
If Begin Wallet won't connect, you can still test the Career Navigator:
1. Use the "Demo Wallet" option
2. This simulates Begin Wallet features
3. Test all functionality without real wallet

### Contact Support:
- Begin Wallet: Check their official support channels
- Career Navigator: Create GitHub issue with debug info

## 🎯 Quick Fix Checklist

- [ ] Begin Wallet extension installed and enabled
- [ ] Extension is up to date
- [ ] Browser cache cleared
- [ ] Wallet is unlocked
- [ ] Correct network selected
- [ ] Page refreshed after wallet installation
- [ ] No other wallet conflicts
- [ ] JavaScript enabled in browser
- [ ] No ad blockers interfering

## 🔗 Useful Links

- Begin Wallet Official Website
- Browser Extension Store
- Begin Wallet Documentation
- Career Navigator GitHub Issues